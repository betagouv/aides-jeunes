import { Box } from "@mui/material"
import ContributionDemo from "@/components/ContributionDemo/ContributionDemo"
import { useAuth } from "@/hooks/useAuth"

function App() {
  // Non-blocking auth check — fires in background, updates store when done.
  // If auth fails later, apiFetch redirects to /auth/login.
  useAuth()

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <ContributionDemo />
    </Box>
  )
}

export default App
