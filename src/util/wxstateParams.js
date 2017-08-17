import {getSearchParamByName} from './searchParams'

let stateStr = getSearchParamByName('state')

export function getStateParamByName (name) {
  let match = RegExp(name + ',([^;]*)').exec(stateStr)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}
