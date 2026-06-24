import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    # LLM Configuration
    MODEL_NAME = os.getenv("MODEL_NAME", "ministral-3b-2512")
    OPENAI_API_BASE = os.getenv("OPENAI_API_BASE", "http://localhost:1234/v1")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "lm-studio")

    MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GOOGLE_API_AI_STUDIO")
    CROQ_API_KEY = os.getenv("CROQ_API_KEY")

    # Redis Configuration
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB = int(os.getenv("REDIS_DB", "0"))
    REDIS_CACHE_TTL = int(os.getenv("REDIS_CACHE_TTL", "3600"))  # 1 hour

    # Agent Parameters
    MAX_TOKENS = int(os.getenv("MAX_TOKENS", "4096"))

    # Paths
    # BASE_DIR = tools/aj-llm ; le repo aides-jeunes est 2 niveaux au-dessus.
    BASE_DIR = Path(__file__).parent.parent
    AIDES_JEUNES_ROOT = BASE_DIR.parent.parent

    # Aides Jeunes data path (par défaut : data/ du repo qui contient cet outil)
    AIDES_JEUNES_DATA_PATH = Path(os.getenv(
        "AIDES_JEUNES_DATA_PATH",
        str(AIDES_JEUNES_ROOT / "data")
    ))
    # Dossier des fiches benefits (sortie Agent 1)
    AIDES_JEUNES_BENEFITS_PATH = AIDES_JEUNES_DATA_PATH / "benefits" / "javascript"

settings = Settings()
