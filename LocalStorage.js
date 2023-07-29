const regexVerifyJson = /^[\],:{}\s]*$|^"([^\\"]|\\["\\bfnrt\/]|\\u[\dA-Fa-f]{4})*"$|^'([^\\']|\\['\\bfnrt\/]|\\u[\dA-Fa-f]{4})*'$/

class LocalStorage {
  static getItem(key) {
    let value = localStorage[key]
    if (!value) return
    if (!regexVerifyJson.test(value)) return value
    return JSON.parse(value)
  }

  static setItem(key, valueStringify) {
    localStorage[key] = JSON.stringify(valueStringify)
  }
}
