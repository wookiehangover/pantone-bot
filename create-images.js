'use strict'

var _ = require('underscore')
var Buffer = require('buffer').Buffer
var PNG = require('pngjs2').PNG
var fs = require('fs')
var async = require('async')

function hexToRgb(hex) {
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

function imageFromColor(pantoneColor, done) {
  let color = hexToRgb(pantoneColor.hex)
  let r = color[0]
  let g = color[1]
  let b = color[2]

  let width = 400
  let height = 400

  let bitmap = new Buffer(width * height * 3)

  var ofs = 0
  for (var i = 0; i < bitmap.length; i+=3) {
    bitmap[ofs++] = r
    bitmap[ofs++] = g
    bitmap[ofs++] = b
  }

  var png = new PNG({
    width: width,
    height: height,
    inputHasAlpha: false
  })

  png.data = bitmap

  let name = `assets/pantone-${pantoneColor.pantone}.png`
  let file = fs.createWriteStream(name)

  file.on('finish', function() {
    console.log(`\t${name} saved`)

    if (_.isFunction(done)) {
      done()
    }
  })

  png.pack().pipe(file)
}

let colorPaths = [
  'coated',
  'color-of-the-year',
  'metallic',
  'pastels-neons',
  'skin',
  'uncoated'
]

_.each(colorPaths, function(path) {
  let colors = require(`pantoner/json/pantone-${path}.json`)
  async.eachLimit(colors, 10, imageFromColor, function(err) {
    if (err) {
      console.error(err)
    } else {
      console.log(`Finished! ${colors.length} colors saved.`)
    }
  })
})

