export function setSituationCredentials($cookies, situationId, token) {
  $cookies.set(`simulation_${situationId}`, token, "24h")
}
