'use strict'

module.exports = function(hex) {
  hex = hex.replace('#', '')
  let r = hex.substr(0,2)
  let g = hex.substr(2,2)
  let b = hex.substr(4,2)

  return [
    parseInt(`0x${r}`),
    parseInt(`0x${g}`),
    parseInt(`0x${b}`)
  ]
}
