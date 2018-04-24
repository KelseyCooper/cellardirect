require('isomorphic-fetch')
require('dotenv').config()

const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const bodyParserRaw = require('body-parser').raw({
  type: '*/*',
})
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const path = require('path')
const logger = require('morgan')

const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../config/webpack.config.js')

const ShopifyAPIClient = require('shopify-api-node')
const ShopifyExpress = require('@shopify/shopify-express')
const { MemoryStrategy } = require('@shopify/shopify-express/strategies')

const crypto = require('crypto')

const {
  caseAmount,
  findAddress,
  newCustomerOrder,
  genericShippingInfo,
  shippingCalculator,
  getCustomerList,
  deleteCustomers,
  isEmpty,
  getCustomerListWithSearch,
  search,
  updateShipping,
  fetchShippingRates,
} = require('./lib/helperFunctions')

const {
  SHOPIFY_APP_KEY,
  SHOPIFY_APP_HOST,
  SHOPIFY_APP_SECRET,
  NODE_ENV,
} = process.env

const shopifyConfig = {
  host: SHOPIFY_APP_HOST,
  apiKey: SHOPIFY_APP_KEY,
  secret: SHOPIFY_APP_SECRET,
  scope: ['write_orders, write_products, read_customers, write_shipping'],
  shopStore: new MemoryStrategy(),
  afterAuth(request, response) {
    const { session: { accessToken, shop } } = request
    registerWebhook(shop, accessToken, {
      topic: 'orders/create',
      address: `${SHOPIFY_APP_HOST}/order-create`,
      format: 'json',
    })

    registerCarrierService(shop, accessToken, {
      name: 'Cellar Direct Custom Shipping',
      active: true,
      service_discovery: true,
      carrier_service_type: 'api',
      format: 'json',
      callback_url: `${SHOPIFY_APP_HOST}/custom-shipping`,
    })

    return response.redirect('/')
  },
}

// Attempts to register the correct webhook using the shopify API
const registerWebhook = function(shopDomain, accessToken, webhook) {
  const shopify = new ShopifyAPIClient({
    shopName: shopDomain,
    accessToken: accessToken,
  })
  shopify.webhook
    .create(webhook)
    .then(
      (response) => console.log(`webhook '${webhook.topic}' created`),
      (err) =>
        console.log(
          `Error creating webhook '${webhook.topic}'. ${JSON.stringify(
            err.response.body,
          )}`,
        ),
    )
}

// Attempts to register the Carrier server to to feed the app shipping data
const registerCarrierService = function(
  shopDomain,
  accessToken,
  carrierService,
) {
  const shopify = new ShopifyAPIClient({
    shopName: shopDomain,
    accessToken: accessToken,
  })
  shopify.carrierService
    .create(carrierService)
    .then(
      (response) =>
        console.log(`carrierService '${carrierService.name}' created`),
      (err) =>
        console.log(
          `Error creating carrierService '${
            carrierService.name
          }'. ${JSON.stringify(err.response.body)}`,
        ),
    )
}

const app = express()
const isDevelopment = NODE_ENV !== 'production'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(
  session({
    store: isDevelopment ? undefined : new RedisStore(),
    secret: SHOPIFY_APP_SECRET,
    resave: true,
    saveUninitialized: false,
  }),
)

// Run webpack hot reloading in dev
if (isDevelopment) {
  const compiler = webpack(config)
  const middleware = webpackMiddleware(compiler, {
    hot: true,
    inline: true,
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  })

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))
} else {
  const staticPath = path.resolve(__dirname, '../assets')
  app.use('/assets', express.static(staticPath))
}

// Install
app.get('/install', (req, res) => res.render('install'))

// Create shopify middlewares and router
const shopify = ShopifyExpress(shopifyConfig)

// Mount Shopify Routes
const { routes, middleware } = shopify
const { withShop, withWebhook } = middleware

app.use('/shopify', routes)

// Client
app.get('/', withShop({ authBaseUrl: '/shopify' }), function(
  request,
  response,
) {
  const { session: { shop, accessToken } } = request
  response.render('app', {
    title: 'Shopify Node App',
    apiKey: shopifyConfig.apiKey,
    shop: shop,
  })
})

// Validates HMAC from shopify for webhooks
function webhookHMACValidator(req, res, next) {
  const shopifyHmac = req.get('X-Shopify-Hmac-SHA256')

  if (!shopifyHmac) {
    return res.status(409).json({
      error: 'Missing signature',
    })
  }

  try {
    var calculated = crypto
      .createHmac('SHA256', SHOPIFY_APP_SECRET)
      .update(req.body)
      .digest()
  } catch (e) {
    return res.status(409).json({
      error: 'Invalid signature',
    })
  }

  var shopifyHmacBuffer = Buffer.from(shopifyHmac, 'base64')

  var hashEquals = false

  try {
    hashEquals = crypto.timingSafeEqual(calculated, shopifyHmacBuffer)
  } catch (e) {
    hashEquals = false
  }

  if (hashEquals) {
    return next()
  } else {
    return res.status(409).json({
      error: 'Invalid signature',
    })
  }
}

// Webhook to add a customer when they make a purchase
app.post(
  '/order-create',
  bodyParserRaw,
  webhookHMACValidator,
  (req, res, next) => {
    var decodedBodyString = req.body.toString('utf8')

    const body = JSON.parse(decodedBodyString)

    newCustomerOrder(body)

    return res.status(200).json({ status: 'success' })
  },
)

// Endpoint for the client to get the shipping amounts for the customer
app.post('/custom-shipping', bodyParser.json(), async function(req, res) {
  const { province } = req.body.rate.destination

  let data = {
    rates: [
      {
        service_name: 'Cellar Direct Custom Shipping',
        currency: 'CAD',
      },
    ],
  }

  const result = await findAddress(req.body.rate)
  const { prePurchasedCases, prePurchasedBottles, orderTotal } = result
  if (result.prePurchasedCases === 0) {
    await genericShippingInfo(
      data.rates[0],
      prePurchasedCases,
      prePurchasedBottles,
      orderTotal,
      province,
    )

    await shippingCalculator(
      data.rates[0],
      orderTotal,
      prePurchasedCases,
      province,
    )

    res.json(data)
  } else {
    await genericShippingInfo(
      data.rates[0],
      prePurchasedCases,
      prePurchasedBottles,
      orderTotal,
      province,
    )
    if (result.prePurchasedCases === caseAmount(result.orderTotal)) {
      data.rates[0].total_price = '00'
    } else {
      //get the max key of shipping amounts.
      await shippingCalculator(
        data.rates[0],
        orderTotal,
        prePurchasedCases,
        province,
      )
    }
    res.json(data)
  }
})

// Gets the customer list to display in the shopify store, also handles filtering
app.post('/customer-list', bodyParser.json(), function(req, res) {
  //TODO write error handling, catch.
  if (!isEmpty(req.body)) {
    const provinceFilter = req.body.filter((item) => {
      if (item.key === 'accountStatusFilter') {
        return item.key
      }
    })

    const searchFilter = req.body.filter((item) => {
      if (item.key === 'Filter') {
        return item.key
      }
    })

    getCustomerList(provinceFilter).then((result) => {
      if (!isEmpty(searchFilter)) {
        getCustomerListWithSearch(searchFilter, result).then((searchResult) => {
          let result = []

          if (searchResult[0].length > 0) {
            for (let i = 0; i < searchResult.length; i++) {
              if (searchResult[i].length === 0) {
                result = []
              }
              searchResult[i].map((item) => {
                result.push(item)
              })
            }
          }

          res.status(200).json({ result })
        })
      } else {
        res.status(200).json({ result })
      }
    })
  } else {

    getCustomerList(req.body).then((result) => {
      res.status(200).json({ result })
    })
  }
})

// Deletes a range of customers by their ids
app.post('/delete-customers', bodyParser.json(), function(req, res) {
  //TODO write error handling, also authenticate header?
  deleteCustomers(req.body.data).then((ids) => {
    res.status(200).json({ success: true })
  })
})

// Fetches the shipping rates
app.get('/fetch-shipping-rates', function(req, res) {
  fetchShippingRates().then((shippingRates) => {

    //TODO write error handling, also authenticate header?
    res.status(200).json({ ...shippingRates })
  })
})

// Updates the shipping rates and returns them
app.post('/update-shipping-rates', bodyParser.json(), function(req, res) {

  updateShipping(req.body).then((shippingRates) => {
    //TODO write error handling, also authenticate header?
    res.status(200).json({ ...shippingRates })
  })
})

// Error Handlers
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(error, request, response, next) {
  response.locals.message = error.message
  response.locals.error = request.app.get('env') === 'development' ? error : {}

  response.status(error.status || 500)
  response.render('error')
})

module.exports = app
