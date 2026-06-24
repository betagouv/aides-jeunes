import os
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from backend.routes.health import router as health_router
from backend.routes.auth import router as auth_router
from backend.routes.config import router as config_router
from backend.routes.contribution import router as contribution_router
from backend.routes.models import router as models_router

# Phoenix tracing — opt-in. Set PHOENIX_TRACING=1 (collecteur OTLP requis sur :4317).
if os.getenv("PHOENIX_TRACING") == "1":
    try:
        from phoenix.otel import register
        from openinference.instrumentation.langchain import LangChainInstrumentor
        _tracer_provider = register(project_name="aj-llm")
        LangChainInstrumentor().instrument(tracer_provider=_tracer_provider)
        print("✅ Phoenix tracing enabled — project: aj-llm")
    except Exception as _e:
        print(f"⚠️  Phoenix tracing not available: {_e}")

app = FastAPI(
    title="Aides Jeunes LLM",
    description="Agents IA pour la base Aides Jeunes",
    version="1.0.0",
)

app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(config_router, prefix="/api", tags=["config"])
app.include_router(auth_router, tags=["auth"])
app.include_router(contribution_router, prefix="/api", tags=["contribution"])
app.include_router(models_router, prefix="/api", tags=["models"])

# Frontend : servi automatiquement si buildé (pnpm build → frontend/dist).
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
else:

    @app.get("/", response_class=HTMLResponse)
    async def get_index():
        """Le frontend n'est pas buildé : indiquer comment le lancer."""
        return """<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Aides Jeunes LLM — API</title></head>
<body style="font-family:system-ui;max-width:640px;margin:3rem auto;line-height:1.5">
  <h1>Aides Jeunes LLM — API</h1>
  <p>L'API tourne. Le frontend (interface web) n'est pas servi ici en mode dev.</p>
  <h2>Ouvrir l'interface</h2>
  <p>Lance le frontend dans un autre terminal :</p>
  <pre style="background:#f4f4f4;padding:1rem;border-radius:6px">cd frontend
pnpm dev</pre>
  <p>Puis ouvre <a href="http://localhost:5173">http://localhost:5173</a></p>
  <p>API : <a href="/docs">/docs</a> (Swagger)</p>
</body></html>"""


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
