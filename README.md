Automatic Notification system for cryptocurrency prices

This project creates a Cloudflare Worker to periodically poll the price of a cryptocurrency, and automatically notify the owner if it falls below a predetermined threshold.

## Getting Started

Install the necessary dependencies, setup Cloudflare and test

'''bash
$ npm ci
$ npm test
'''

To deploy to your own Worker

'''bash
$ npx wrangler login
$ npm run deploy
'''