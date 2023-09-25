import ABTestingService from "@/plugins/ab-testing-service.js"

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

// * Waits for `window._paq` to become available.
//   Stops trying after reaching the specified timeout.
function waitForPaq(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const intervalId = setInterval(() => {
      if (window._paq) {
        clearInterval(intervalId)
        resolve()
      } else if (Date.now() - startTime > timeout) {
        clearInterval(intervalId)
        reject(new Error("Timeout reached."))
      }
    }, 100)
  })
}

function initializeABTestingDimensions() {
  const ABTestingEnvironment = ABTestingService.getEnvironment()
  for (const name in ABTestingEnvironment) {
    const data = ABTestingEnvironment[name]
    if (data.deleted) {
      tracker.deleteCustomDimension(data.index)
    } else {
      tracker.setCustomDimension(data.index, `${name}/${data.value}`)
    }
  }
}

waitForPaq().then(() => {
  initializeABTestingDimensions()
})

const tracker = {
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
  deleteCustomDimension: (index: number) => {
    window._paq?.push(["deleteCustomDimension", index])
  },
  setCustomDimension: (index: number, value: string) => {
    window._paq?.push(["setCustomDimension", index, value])
  },
  getVisitorId: () => {
    let visitorId: string | undefined
    window._paq?.push([
      function () {
        visitorId = this?.getVisitorId()
      },
    ])

    return visitorId
  },
}

export default tracker
