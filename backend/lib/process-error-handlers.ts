// Les erreurs des bibliothèques HTTP portent le `ClientRequest` et l'
// `IncomingMessage` sous-jacents, qui se référencent l'un l'autre. Une copie
// superficielle d'un tel objet perd le `toJSON` d'axios et expose la boucle :
// c'est ce que fait pm2 avant de diffuser l'erreur au processus maître, d'où le
// « Converting circular structure to JSON » qui remplace la trace attendue.
// On n'en journalise donc qu'un résumé plat.
const REPORTED_KEYS = ["name", "message", "code", "status"]

function safeString(value: unknown): string {
  try {
    return String(value)
  } catch {
    // Objet sans prototype, `Symbol.toPrimitive` qui lève, accesseur piégé…
    return "<valeur non convertible en chaîne>"
  }
}

function safeRead(source: Record<string, unknown>, key: string): unknown {
  try {
    return source[key]
  } catch (error) {
    // `message` et `status` peuvent être des accesseurs, et lever à la lecture.
    return `<lecture impossible : ${safeString(error)}>`
  }
}

export function summarize(reason: unknown): Record<string, unknown> {
  if (!(reason instanceof Error)) {
    return { name: typeof reason, message: safeString(reason) }
  }

  const error = reason as unknown as Record<string, unknown>
  const summary: Record<string, unknown> = {}
  for (const key of REPORTED_KEYS) {
    const value = safeRead(error, key)
    if (value !== undefined) {
      summary[key] = value
    }
  }
  // `response.status` est le seul champ d'un AxiosError qui explique le rejet ;
  // le reste de `response` porte la référence circulaire.
  const response = safeRead(error, "response")
  const upstreamStatus =
    response && typeof response === "object"
      ? safeRead(response as Record<string, unknown>, "status")
      : undefined
  if (upstreamStatus !== undefined) {
    summary.upstreamStatus = upstreamStatus
  }
  return summary
}

// `JSON.stringify` lève sur un BigInt, et laisse tomber symboles et fonctions.
function jsonSafe(_key: string, value: unknown): unknown {
  const type = typeof value
  return type === "bigint" || type === "symbol" || type === "function"
    ? safeString(value)
    : value
}

export function formatRejection(reason: unknown): string {
  try {
    return JSON.stringify(summarize(reason), jsonSafe)
  } catch (error) {
    return `<résumé non sérialisable : ${safeString(error)}>`
  }
}

/*
 * `Sentry.init` installe par défaut `onUnhandledRejectionIntegration` en mode
 * « warn » : elle signale déjà le rejet et imprime `reason.stack`. Cet écouteur
 * n'y ajoute qu'une ligne plate et greppable — nom, code, statut amont — que la
 * pile seule ne donne pas et qui survit à la recopie. Il ne signale rien à
 * Sentry : ce serait un doublon.
 *
 * Pas d'écouteur `uncaughtException` : Sentry installe
 * `onUncaughtExceptionIntegration`, qui avec son défaut
 * `exitEvenIfOtherHandlersAreRegistered: false` renonce à arrêter le processus
 * dès qu'un écouteur étranger existe. En poser un désarmerait cet arrêt et
 * laisserait tourner un processus dans un état corrompu.
 */
export function registerProcessErrorHandlers(
  processLike: NodeJS.EventEmitter = process,
  logger: (...args: unknown[]) => void = console.error,
): void {
  processLike.on("unhandledRejection", (reason: unknown) => {
    // Un garde-fou qui lève détruit ce qu'il existe pour préserver : le rejet
    // deviendrait une exception non rattrapée, et le résumé ne paraîtrait pas.
    try {
      logger("unhandledRejection", formatRejection(reason))
    } catch {
      logger("unhandledRejection", "<résumé impossible>")
    }
  })
}
