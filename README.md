# pantone-bot (Every Pantone Color)

> Every Pantone color, tweeted

https://twitter.com/pantone_colors

### Usage

* Create a directory of Pantone color png's
  * `npm run generate-images`
* Reset the used colors cache
  * `npm run reset-used-colors`
* Start app
  * `node index.js`

### Config

Before starting the app, you'll need to create `config.js` with your Twitter API credentials.

```javascript
module.exports = {
  consumer_key:         'your-key',
  consumer_secret:      'your-secret',
  access_token:         'access-token',
  access_token_secret:  'access-token-secret'
};
```

You'll also need to be sure to run `npmr run generate-images` and `npm run reset-used-colors` prior to starting the app.

## License
Copyright (c) 2015 Sam Breed  
Licensed under the MIT license.
