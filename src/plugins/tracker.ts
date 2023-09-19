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
}
