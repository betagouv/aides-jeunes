type StorageType = "localStorage" | "sessionStorage"

const availableStorages: { StorageType?: boolean } = {}

function storageAvailable(type: StorageType): boolean {
  if (type in availableStorages) {
    return availableStorages[type]
  }

  try {
    const storage: Storage | null = window[type]
    const storageTest = "__storage_test__"
    storage.setItem(storageTest, storageTest)
    storage.removeItem(storageTest)
    availableStorages[type] = true
  } catch (e) {
    availableStorages[type] = false
  }
  return availableStorages[type]
}

function setItem(type: StorageType, key: string, value: any): void {
  if (storageAvailable(type)) {
    window[type].setItem(key, JSON.stringify(value))
  }
}

function getItem(type: StorageType, key: string): any | null {
  if (storageAvailable(type)) {
    const item = window[type].getItem(key)
    if (item) {
      return JSON.parse(item)
    }
  }
  return null
}

export default {
  setItem,
  getItem,
}
