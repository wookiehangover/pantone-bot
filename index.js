'use strict'

let _ = require('underscore')
let Twit = require('twit')
let T = new Twit(require('./config.js'))
let fs = require('fs')
let hex2rgb = require('./hex2rgb')
let rgb2hsl = require('color-convert').rgb2hsl

let colors = {
  'coated': require('pantoner/json/pantone-coated.json'),
  'color-of-the-year': require('pantoner/json/pantone-color-of-the-year.json'),
  'metallic': require('pantoner/json/pantone-metallic.json'),
  'pastels-neons': require('pantoner/json/pantone-pastels-neons.json'),
  'skin': require('pantoner/json/pantone-skin.json'),
  'uncoated': require('pantoner/json/pantone-uncoated.json')
}

let usedColors = require('./used-colors.json')

function getColor() {
  let key = _.keys(colors)[_.random(_.size(colors) - 1)]
  let colorSet = colors[key]
  let pantoneColor = colorSet[_.random(colorSet.length - 1)]

  if (usedColors.indexOf(pantoneColor.pantone) > -1) {
    return getColor()
  }

  return pantoneColor
}

function getMedia(pantoneColor, done) {
  let filename = `assets/pantone-${pantoneColor.pantone}.png`
  fs.readFile(filename, { encoding: 'base64' }, (err, media) => {
    if (err) {
      console.log('error:', err)
      return
    }
    done(media)
  })
}

function tweetColor(pantoneColor, media) {
  let name = pantoneColor.pantone
  let hex = pantoneColor.hex
  let rgb = hex2rgb(hex)
  let hsl = rgb2hsl(rgb)

  T.post('account/update_profile_banner', { banner: media }, (err) => {
    if (err) {
      console.error('Error update profile banner: ', err)
    } else {
      console.log('Profile image banner')
    }
  })

  T.post('account/update_profile_image', { image: media }, (err) => {
    if (err) {
      console.error('Error update profile image: ', err)
    } else {
      console.log('Profile image updated')
    }
  })

  T.post('media/upload', { media }, (err, data) => {
    if (err) {
      throw err
    }

    let mediaIdStr = data.media_id_string
    let params = {
      status: [
        `Pantone ${name}`,
        `rgb(${rgb.join(',')})`,
        `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`,
        `${pantoneColor.hex}`
      ].join('\n'),
      media_ids: [mediaIdStr]
    }

    T.post('statuses/update', params, (err, data) => {
      if (err) {
        console.log('error:', err)
        return
      }

      usedColors.push(name)

      fs.writeFile('used-colors.json', JSON.stringify(usedColors, null, 2), (err) => {
        console.log(`Successfully tweeted: Pantone ${name}`)
      })
    })
  })
}

function tweet() {
  let pantoneColor = getColor()
  getMedia(pantoneColor, (media) => {
    tweetColor(pantoneColor, media)
  })
}

// Tweet every 4 hours
setInterval(function () {
  try {
    tweet()
  }
  catch (e) {
    console.log(e)
  }
}, 1000 * 60 * 60 * 4)

// Tweet once on initialization
tweet()

