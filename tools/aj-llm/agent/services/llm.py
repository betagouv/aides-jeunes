import os
import re
import json
import asyncio
from typing import List, Dict, Any, Optional, Tuple

from dotenv import load_dotenv

# LangChain Providers
from langchain_openai import ChatOpenAI
from langchain_mistralai import ChatMistralAI
from langchain_google_genai import ChatGoogleGenerativeAI

from configs.settings import settings

load_dotenv()


class LLMService:
    """Client LLM multi-provider pour la génération de fiches Aides Jeunes.

    Détecte le provider selon le nom du modèle (gemini / mistral / grok / groq),
    ou force le gateway OpenAI-compatible (`force_gateway=True`) pour le switch
    de modèle sur un endpoint unique.
    """

    def __init__(self, model_name: str = None, force_gateway: bool = False):
        self.model_name = model_name or settings.MODEL_NAME
        # force_gateway: ignore provider detection, always use OPENAI_API_BASE.
        self.force_gateway = force_gateway
        self.max_tokens = settings.MAX_TOKENS
        self.llm = self._create_llm_client(temperature=0.1)

    # ── JSON helpers ──────────────────────────────────────────────────────────

    def _clean_json_content(self, content: str) -> str:
        """Fixes common LLM JSON errors like missing commas or markdown blocks."""
        # 1. Remove markdown code fences (robust to a missing closing fence on truncation)
        content = re.sub(r"```(?:json|yaml)?", "", content)

        # 1b. Drop prose / reasoning around the JSON (reasoning models like gpt-oss
        #     emit thinking text before the object). Keep the outermost {...} or [...].
        starts = [i for i in (content.find("{"), content.find("[")) if i != -1]
        if starts:
            start = min(starts)
            end = max(content.rfind("}"), content.rfind("]"))
            if end > start:
                content = content[start : end + 1]

        # 2. Basic cleanup
        content = content.strip().replace('\xa0', ' ')

        # 3. Handle models that might use single quotes for keys
        content = re.sub(r"'(\w+)'\s*:", r'"\1":', content)
        content = re.sub(r"\{\s*'(\w+)'\s*:", r'{"\1":', content)
        content = re.sub(r",\s*'(\w+)'\s*:", r',"\1":', content)

        # 4. Fix missing commas between key-value pairs or objects
        content = re.sub(r'("\s*:\s*[^"]*")\s*("\w+"\s*:)', r'\1,\2', content)
        content = re.sub(r'\}\s*\{', r'\},\{', content)
        content = re.sub(r'\]\s*\[', r'\],\[', content)

        # 5. Fix missing comma between array elements
        content = re.sub(r'("\s*)\s*(")', r'\1,\2', content)

        # 6. Remove trailing commas
        content = re.sub(r',\s*([\]\}])', r'\1', content)

        return content

    async def repair_json_with_llm(self, malformed_json: str) -> str:
        """Repairs JSON structure using the configured LLM (same gateway as generation).

        Falls back to Gemini only if a GOOGLE_API_KEY is set; otherwise reuses
        self.llm so repair works on OpenAI-compatible gateways (Open WebUI etc.).
        """
        print("🔧 Attempting LLM-based JSON repair...")
        repair_prompt = f"""Tu es un expert JSON. Répare cet objet JSON malformé pour qu'il soit parfaitement valide.
Ne change pas les valeurs, répare uniquement la structure (guillemets, virgules, accolades).
Réponds UNIQUEMENT avec le JSON brut, sans blocs de code markdown ni texte de réflexion.

JSON MALFORMÉ :
{malformed_json}"""

        try:
            if settings.GOOGLE_API_KEY:
                repair_llm = ChatGoogleGenerativeAI(
                    model="gemini-3.1-flash-lite-preview",
                    google_api_key=settings.GOOGLE_API_KEY,
                    temperature=0.0,
                )
            else:
                repair_llm = self.llm  # reuse the gateway client
            response = await repair_llm.ainvoke([{"role": "user", "content": repair_prompt}])
            return self._clean_json_content(response.content)
        except Exception as e:
            print(f"⚠️ LLM Repair failed: {e}")
            return malformed_json

    async def _safe_ainvoke(self, client: Any, messages: List[Dict], retries: int = 2):
        """Wrapper with retry logic for rate limits."""
        for attempt in range(retries + 1):
            try:
                return await client.ainvoke(messages)
            except Exception as e:
                err_msg = str(e)
                if ("429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg) and attempt < retries:
                    wait_time = (attempt + 1) * 2
                    print(f"⏳ Rate limit hit. Retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
                    continue
                raise e

    # ── Client factory ────────────────────────────────────────────────────────

    def _create_llm_client(self, temperature: float, max_tokens: int = None):
        """Factory method to create the appropriate Chat client."""
        model_id = self.model_name
        model_lower = model_id.lower()
        m_tokens = max_tokens or self.max_tokens

        # 0. Forced gateway: skip provider detection (model switching on one OpenAI-compat endpoint)
        if self.force_gateway:
            return ChatOpenAI(
                base_url=settings.OPENAI_API_BASE,
                api_key=settings.OPENAI_API_KEY,
                model_name=model_id,
                temperature=temperature,
                max_tokens=m_tokens,
            )

        # 1. Google Gemini
        if "gemini" in model_lower:
            return ChatGoogleGenerativeAI(
                model=model_id,
                google_api_key=settings.GOOGLE_API_KEY,
                temperature=temperature,
                max_output_tokens=m_tokens,
            )

        # 2. Mistral (Native SDK)
        if any(x in model_lower for x in ["mistral", "pixtral", "ministral", "codestral"]):
            return ChatMistralAI(
                model=model_id,
                mistral_api_key=settings.MISTRAL_API_KEY,
                temperature=temperature,
                max_tokens=m_tokens,
            )

        # 3. Grok (x.ai) - OpenAI Compatible
        if "grok" in model_lower:
            return ChatOpenAI(
                base_url="https://api.x.ai/v1",
                api_key=settings.CROQ_API_KEY,
                model_name=model_id,
                temperature=temperature,
                max_tokens=m_tokens,
            )

        # 4. Groq (OpenAI Compatible)
        groq_key = os.getenv("GROQ_API_KEY")
        if model_id.startswith("groq/") or ("llama" in model_lower and groq_key):
            real_model = model_id.replace("groq/", "")
            return ChatOpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=groq_key,
                model_name=real_model,
                temperature=temperature,
                max_tokens=m_tokens,
            )

        # 5. Default: Local / OpenAI-compatible gateway
        return ChatOpenAI(
            base_url=settings.OPENAI_API_BASE,
            api_key=settings.OPENAI_API_KEY,
            model_name=model_id,
            temperature=temperature,
            max_tokens=m_tokens,
        )

    # ── Benefit generation (Agent 1) ──────────────────────────────────────────

    async def generate_json_benefit(self, messages: list[dict]) -> dict:
        """Call LLM and return a parsed dict for an Aides Jeunes benefit."""
        response = await self._safe_ainvoke(self.llm, messages)
        content = self._clean_json_content(response.content)
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            content = await self.repair_json_with_llm(content)
            try:
                return json.loads(content)
            except json.JSONDecodeError as exc:
                raise ValueError(f"JSON non parseable après repair: {exc}") from exc

    async def generate_benefit_with_raw(self, messages: list[dict]) -> Tuple[Optional[dict], str, Optional[str]]:
        """Like generate_json_benefit but also returns the raw LLM text (debug).

        Returns (parsed_dict_or_None, raw_content, error_or_None).
        """
        response = await self._safe_ainvoke(self.llm, messages)
        raw = response.content or ""
        content = self._clean_json_content(raw)
        try:
            return json.loads(content), raw, None
        except json.JSONDecodeError:
            repaired = await self.repair_json_with_llm(content)
            try:
                return json.loads(repaired), raw, None
            except json.JSONDecodeError as exc:
                return None, raw, f"JSON non parseable après repair: {exc}"
