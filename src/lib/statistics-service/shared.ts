export function skipSendStatistics(): boolean {
  return (
    window.navigator.doNotTrack === "1" &&
    document.cookie.indexOf("piwik_ignore") >= 0
  )
}
