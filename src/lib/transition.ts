export function getTitleFromRoute(route) {
  let meta
  for (let index = route.matched.length - 1; index >= 0; index -= 1) {
    meta = route.matched[index].meta
    if (meta.headTitle) {
      if (typeof meta.headTitle === "function") {
        return meta.headTitle(route.params)
      }
      return meta.headTitle
    }
  }
  return process.env.VITE_TITLE
}
