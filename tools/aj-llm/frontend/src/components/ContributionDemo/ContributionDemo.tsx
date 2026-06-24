import { useEffect, useState } from "react"
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { apiFetch } from "@/utils/api"

interface ContributionResponse {
  yaml_content: string | null
  filename: string | null
  missing_fields: string[]
  questions_for_contributor: string[]
  validation_errors: string[]
  error: string | null
  raw_llm_output?: string | null
  model_used?: string | null
}

const EXAMPLE = `Aide au permis de conduire
Versée par la région Île-de-France
Pour les jeunes de 18 à 25 ans en recherche d'emploi
Montant : 1300 euros maximum
Conditions : être inscrit à France Travail`

export default function ContributionDemo() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ContributionResponse | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [models, setModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState("")
  const [debug, setDebug] = useState(false)

  useEffect(() => {
    apiFetch("/api/models")
      .then((r) => r.json())
      .then((d: { current: string; models?: string[] }) => {
        const list = d.models?.length ? d.models : d.current ? [d.current] : []
        setModels(list)
        setSelectedModel(d.current ?? list[0] ?? "")
      })
      .catch((e) => {
        console.error("GET /api/models a échoué — backend démarré ?", e)
      })
  }, [])

  async function handleSubmit() {
    setLoading(true)
    setResult(null)
    setFetchError(null)
    try {
      const res = await apiFetch("/api/contribution/format", {
        method: "POST",
        body: JSON.stringify({
          yaml_content: input,
          model_name: selectedModel || null,
        }),
      })
      if (!res.ok) {
        throw new Error(`Erreur serveur (${res.status})`)
      }
      const data: ContributionResponse = await res.json()
      setResult(data)
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Aides Jeunes — Formateur de contribution
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Collez une description libre d'une aide. L'agent la structure en YAML
          conforme au format Aides Jeunes.
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Input */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              Description de l'aide
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <TextField
                select
                size="small"
                label="Modèle"
                value={models.includes(selectedModel) ? selectedModel : ""}
                onChange={(e) => setSelectedModel(e.target.value)}
                sx={{ minWidth: 240 }}
                helperText={
                  models.length === 0
                    ? "Aucun modèle (backend démarré ?)"
                    : undefined
                }
              >
                {models.length === 0 && (
                  <MenuItem value="" disabled>
                    — indisponible —
                  </MenuItem>
                )}
                {models.map((m) => (
                  <MenuItem
                    key={m}
                    value={m}
                    sx={{ fontFamily: "monospace", fontSize: 13 }}
                  >
                    {m}
                  </MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={
                  <Switch
                    checked={debug}
                    onChange={(e) => setDebug(e.target.checked)}
                  />
                }
                label="Debug"
              />
            </Stack>
            <TextField
              multiline
              minRows={14}
              fullWidth
              placeholder="Décrivez l'aide ici…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{ fontFamily: "monospace" }}
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <AutoFixHighIcon />
                  )
                }
                disabled={loading || !input.trim()}
                onClick={handleSubmit}
              >
                {loading ? "Formatage…" : "Formater"}
              </Button>
              <Button
                variant="text"
                disabled={loading}
                onClick={() => setInput(EXAMPLE)}
              >
                Exemple
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Output */}
        <Paper variant="outlined" sx={{ p: 2, minHeight: 360 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Résultat
          </Typography>

          {fetchError && <Alert severity="error">{fetchError}</Alert>}

          {!fetchError && !result && !loading && (
            <Typography variant="body2" color="text.secondary">
              Le YAML formaté apparaîtra ici.
            </Typography>
          )}

          {loading && (
            <Stack alignItems="center" sx={{ py: 6 }}>
              <CircularProgress />
            </Stack>
          )}

          {result && <ResultView result={result} debug={debug} />}
        </Paper>
      </Box>
    </Container>
  )
}

function ResultView({
  result,
  debug,
}: {
  result: ContributionResponse
  debug: boolean
}) {
  return (
    <Stack spacing={2}>
      {result.model_used && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontFamily: "monospace" }}
        >
          modèle : {result.model_used}
        </Typography>
      )}

      {result.error && <Alert severity="error">{result.error}</Alert>}

      <Collapse in={debug} unmountOnExit>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Sortie brute LLM
          </Typography>
          {result.raw_llm_output ? (
            <SyntaxHighlighter
              language="json"
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: 8,
                fontSize: 12,
                maxHeight: 320,
              }}
              wrapLongLines
            >
              {result.raw_llm_output}
            </SyntaxHighlighter>
          ) : (
            <Typography variant="body2" color="text.secondary">
              (aucune sortie — le LLM n'a pas été appelé)
            </Typography>
          )}
          <Divider sx={{ mt: 2 }} />
        </Box>
      </Collapse>

      {result.filename && (
        <Chip
          label={result.filename}
          color="primary"
          variant="outlined"
          sx={{ alignSelf: "flex-start", fontFamily: "monospace" }}
        />
      )}

      {result.yaml_content && (
        <Box sx={{ borderRadius: 1, overflow: "hidden", fontSize: 13 }}>
          <SyntaxHighlighter
            language="yaml"
            style={oneDark}
            customStyle={{ margin: 0, borderRadius: 8 }}
          >
            {result.yaml_content}
          </SyntaxHighlighter>
        </Box>
      )}

      {result.validation_errors.length > 0 && (
        <Alert severity="warning">
          <Typography variant="subtitle2">Erreurs de validation</Typography>
          <List dense disablePadding>
            {result.validation_errors.map((err, i) => (
              <ListItem key={i} disablePadding>
                <ListItemText primary={`• ${err}`} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      {result.missing_fields.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Champs manquants
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {result.missing_fields.map((f) => (
              <Chip
                key={f}
                label={f}
                size="small"
                color="warning"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
      )}

      {result.questions_for_contributor.length > 0 && (
        <>
          <Divider />
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Questions pour le contributeur
            </Typography>
            <List dense disablePadding>
              {result.questions_for_contributor.map((q, i) => (
                <ListItem key={i} disablePadding>
                  <ListItemText primary={`${i + 1}. ${q}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </Stack>
  )
}
