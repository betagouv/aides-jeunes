enum StorageType {
  localStorage = "localStorage",
  sessionStorage = "sessionStorage",
}

export class StorageService {
  private storageAvailable: boolean
  private storageType: StorageType
  constructor(type) {
    this.storageType = type
    this.storageAvailable = this.available()
  }
  available(): boolean {
    try {
      const storage: Storage | null = window[this.storageType]
      const storageTest = "__storage_test__"
      storage.setItem(storageTest, storageTest)
      const storedValue = storage.getItem(storageTest)
      storage.removeItem(storageTest)
      return storedValue === storageTest
    } catch (e) {
      return false
    }
  }
  setItem(key: string, value: any) {
    if (this.storageAvailable) {
      window[this.storageType].setItem(key, JSON.stringify(value))
    }
  }
  getItem(key: string): any | null {
    if (this.storageAvailable) {
      const item = window[this.storageType].getItem(key)
      if (item) {
        return JSON.parse(item)
      }
    }
    return null
  }
}

export default {
  local: new StorageService(StorageType.localStorage),
  session: new StorageService(StorageType.sessionStorage),
}
