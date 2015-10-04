'use strict'

var _ = require('underscore')
_.mixin( require('underscore.deferred') )
var Twit = require('twit')
var T = new Twit(require('./config.js'))
var wordfilter = require('wordfilter')
var ent = require('ent')
var fs = require('fs')

let colors = {
  'coated': require('pantoner/json/pantone-coated.json'),
  'color-of-the-year': require('pantoner/json/pantone-color-of-the-year.json'),
  'metallic': require('pantoner/json/pantone-metallic.json'),
  'pastels-neons': require('pantoner/json/pantone-pastels-neons.json'),
  'skin': require('pantoner/json/pantone-skin.json'),
  'uncoated': require('pantoner/json/pantone-uncoated.json')
}

var usedColors = require('./used-colors.json')

function generate() {
  let dfd = new _.Deferred()

  let key = _.keys(colors)[_.random(_.size(colors) - 1)]
  let colorSet = colors[key]
  let pantoneColor = colorSet[_.random(colorSet.length)]


  if (usedColors.indexOf(pantoneColor.pantone) > -1) {
    return generate()
  }

  dfd.resolve(pantoneColor)
  return dfd.promise()
}

function tweetColor(pantoneColor) {
  let name = pantoneColor.pantone
  var b64content = fs.readFileSync(`assets/pantone-${name}.png`, { encoding: 'base64' })

  // first we must post the media to Twitter
  T.post('media/upload', { media: b64content }, function (err, data, response) {
    if (err) {
      throw err
    }

    // now we can reference the media and post a tweet (media will attach to the tweet)
    var mediaIdStr = data.media_id_string
    var params = { status: `Pantone ${name}`, media_ids: [mediaIdStr] }

    T.post('statuses/update', params, function (err, data, response) {
      if (err) {
        console.log('error:', err)
        return
      }

      usedColors.push(name)

      fs.writeFile('used-colors.json', JSON.stringify(usedColors, null, 2), function(err) {
        console.log(`Successfully tweeted: Pantone ${name}`)
      })
    })
  })
}

function tweet() {
  let key = _.keys(colors)[_.random(_.size(colors) - 1)]
  let colorSet = colors[key]
  let pantoneColor = colorSet[_.random(colorSet.length - 1)]

  tweetColor(pantoneColor)
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

