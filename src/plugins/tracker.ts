declare global {
  interface Window {
    _paq?: [
      string | (() => void),
      (number | string)?,
      string?,
      string?,
      string?
    ][]
  }
}

export default {
  trackEvent: (
    category: string,
    action: string,
    name?: string,
    value?: string
  ) => {
    window._paq?.push(["trackEvent", category, action, name, value])
  },
  disableTracking: () => {
    window._paq?.push(["optUserOut"])
  },
  enableTracking: () => {
    window._paq?.push(["forgetUserOptOut"])
  },
  pushCallback: (callback: () => void) => {
    window._paq?.push([callback])
  },
}
