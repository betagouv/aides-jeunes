from typing import TypedDict, Optional
import yaml as pyyaml
from langgraph.graph import StateGraph, END
from pathlib import Path

from agent.services.referentiel import referentiel
from agent.services.llm import LLMService
from agent.tools.institution_lookup import lookup_institution
from agent.tools.yaml_validator import validate_benefit, json_to_yaml, compute_filename


class ContributionState(TypedDict):
    raw_yaml: str
    parsed_input: Optional[dict]
    institution_slug: Optional[str]
    institution_found: bool
    generated_json: Optional[dict]
    yaml_content: Optional[str]
    filename: Optional[str]
    validation_errors: list
    missing_fields: list
    questions_for_contributor: list
    retry_count: int
    error: Optional[str]
    model_name: Optional[str]
    raw_llm_output: Optional[str]


class ContributionAgent:
    def __init__(self):
        self.llm = LLMService()
        self._llm_cache: dict = {}
        self._system_prompt = self._load_system_prompt()

        workflow = StateGraph(ContributionState)
        workflow.add_node("parse_input", self._parse_input)
        workflow.add_node("lookup_institution", self._lookup_institution)
        workflow.add_node("generate_json", self._generate_json)
        workflow.add_node("json_to_yaml", self._json_to_yaml)
        workflow.add_node("validate", self._validate)
        workflow.add_node("output", self._output)

        workflow.set_entry_point("parse_input")
        workflow.add_edge("parse_input", "lookup_institution")
        workflow.add_edge("lookup_institution", "generate_json")
        workflow.add_edge("generate_json", "json_to_yaml")
        workflow.add_edge("json_to_yaml", "validate")
        workflow.add_conditional_edges(
            "validate",
            self._should_retry,
            {"retry": "generate_json", "done": "output"},
        )
        workflow.add_edge("output", END)

        self.app = workflow.compile()

    def _get_llm(self, model_name: Optional[str]) -> LLMService:
        """Return an LLMService for the requested model (cached).

        Overrides always hit the OpenAI-compatible gateway (force_gateway).
        """
        if not model_name or model_name == self.llm.model_name:
            return self.llm
        if model_name not in self._llm_cache:
            self._llm_cache[model_name] = LLMService(model_name=model_name, force_gateway=True)
        return self._llm_cache[model_name]

    def _load_system_prompt(self) -> str:
        path = Path(__file__).parent.parent / "prompts" / "contribution.yaml"
        with open(path, encoding="utf-8") as f:
            data = pyyaml.safe_load(f)
        return data["system_prompt"]

    def _should_retry(self, state: ContributionState) -> str:
        if state["validation_errors"] and state["retry_count"] < 2:
            return "retry"
        return "done"

    async def _parse_input(self, state: ContributionState) -> dict:
        # Tolerant: accept either structured YAML or free text.
        # On parse failure / non-mapping, fall back to free text — the LLM
        # structures it from raw_yaml downstream.
        try:
            parsed = pyyaml.safe_load(state["raw_yaml"])
            if isinstance(parsed, dict):
                return {"parsed_input": parsed, "error": None, "retry_count": 0}
        except pyyaml.YAMLError:
            pass
        return {"parsed_input": {}, "error": None, "retry_count": 0}

    async def _lookup_institution(self, state: ContributionState) -> dict:
        if state.get("error"):
            return {}
        parsed = state["parsed_input"]
        name = parsed.get("institution") or parsed.get("label") or ""
        slug, found = lookup_institution(str(name))
        return {"institution_slug": slug, "institution_found": found}

    async def _generate_json(self, state: ContributionState) -> dict:
        if state.get("error"):
            return {}
        institutions_sample = [
            {"slug": i["slug"], "name": i.get("name", "")}
            for i in referentiel.institutions[:50]
        ]
        user_content = (
            f"YAML brut de la contribution :\n{state['raw_yaml']}\n\n"
            f"Institution résolue : slug='{state['institution_slug']}', "
            f"found={state['institution_found']}\n\n"
            f"Erreurs de validation précédentes (à corriger) : {state.get('validation_errors', [])}\n\n"
            f"Référentiel institutions (extrait) :\n{institutions_sample}"
        )
        messages = [
            {"role": "system", "content": self._system_prompt},
            {"role": "user", "content": user_content},
        ]
        llm = self._get_llm(state.get("model_name"))
        try:
            parsed, raw, err = await llm.generate_benefit_with_raw(messages)
        except Exception as exc:  # network / provider error
            return {"error": f"LLM non disponible: {exc}", "generated_json": None}
        if err:
            return {"error": f"LLM: {err}", "generated_json": None, "raw_llm_output": raw}
        return {"generated_json": parsed, "validation_errors": [], "raw_llm_output": raw}

    async def _json_to_yaml(self, state: ContributionState) -> dict:
        if state.get("error") or not state.get("generated_json"):
            return {}
        return {"yaml_content": json_to_yaml(state["generated_json"])}

    async def _validate(self, state: ContributionState) -> dict:
        if state.get("error") or not state.get("generated_json"):
            return {"validation_errors": [], "retry_count": state.get("retry_count", 0)}

        errors = validate_benefit(
            state["generated_json"],
            existing_institution_slugs=[i["slug"] for i in referentiel.institutions],
            existing_benefit_slugs=referentiel.benefit_slugs,
        )
        retry_count = state.get("retry_count", 0)
        if errors:
            retry_count += 1

        filename = compute_filename(state["generated_json"]) if not errors else None

        return {
            "validation_errors": errors,
            "retry_count": retry_count,
            "filename": filename,
            "missing_fields": state["generated_json"].get("_missing_fields", []),
            "questions_for_contributor": state["generated_json"].get("_questions_for_contributor", []),
        }

    async def _output(self, state: ContributionState) -> dict:
        return {}


contribution_agent = ContributionAgent()
