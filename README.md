# pantone-bot (Every Pantone Color)

> Every Pantone color, tweeted

https://twitter.com/pantone_colors

### Usage

* Start app
  * `node index.js`
* Create a directory of Pantone color png's
  * `npm run generate-images`
* Reset the used colors cache
  * `npm run reset-used-colors`

### Config

Before running, you'll need to create `config.js` with your Twitter API credentials.

```javascript
module.exports = {
  consumer_key:         'your-key',
  consumer_secret:      'your-secret',
  access_token:         'access-token',
  access_token_secret:  'access-token-secret'
};
```

## License
Copyright (c) 2015 Sam Breed  
Licensed under the MIT license.
