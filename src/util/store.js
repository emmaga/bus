export function getLocal (name) {
  if (window.localStorage) {
    return JSON.parse(localStorage.getItem(name))
  }
}

export function setLocal (name, val) {
  if (window.localStorage) {
    localStorage.setItem(name, JSON.stringify(val))
  }
}

export function clearLocal (name) {
  if (window.localStorage) {
    localStorage.removeItem(name)
  }
}
