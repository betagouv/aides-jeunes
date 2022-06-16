export function redirect(url) {
  if (window.self !== window.top) {
    // We are in an iframe
    window.parent.location.href = url
  } else {
    window.location.href = url
  }
}
