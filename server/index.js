require('isomorphic-fetch')
require('dotenv').config()

const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
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

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

const ENV = process.env.ENV || 'development'
const knexConfig = require('./knexfile')
const knex = require('knex')(knexConfig[ENV])

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
  scope: [
    'write_orders, write_products, read_customers, write_customers, write_shipping',
  ],
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
      callback_url: `https://${SHOPIFY_APP_HOST}/custom-shipping`,
    })

    return response.redirect('/')
  },
}

const registerWebhook = function(shopDomain, accessToken, webhook) {
  const shopify = new ShopifyAPIClient({
    shopName: shopDomain,
    accessToken: accessToken,
  })
  shopify.webhook
    .create(webhook)
    .then(
      response => console.log(`webhook '${webhook.topic}' created`),
      err =>
        console.log(
          `Error creating webhook '${webhook.topic}'. ${JSON.stringify(
            err.response.body,
          )}`,
        ),
    )
}

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
      response =>
        console.log(`carrierService '${carrierService.name}' created`),
      err =>
        console.log(
          `Error creating carrierService '${
            carrierService.name
          }'. ${JSON.stringify(err.response.body)}`,
        ),
    )
}

const app = express()
const isDevelopment = NODE_ENV !== 'production'

app.use(
  bodyParser.json({
    type: '*/*',
  }),
)

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

function caseAmount(num) {
  let number = Math.floor(num / 12) + 1
  if (num % 12 === 0) {
    number -= 1
  }
  return number
}

async function findAddress(rate) {
  const { address1: address } = rate.destination
  const data = {}
  let orderTotal = 0
  await rate.items.map(item => {
    //TODO test this and see if it works
    // if any item comes in with a quantitity of 12, it is substracted from it's total.
    while (item.quantity >= 12) {
      item.quantity = item.quantity - 12
    }
    orderTotal += item.quantity
  })
  return await knex('customers')
    .select()
    .where('address', address)
    .returning('*')
    .then(result => {
      // Checks if an address exists in the system
      if (result.length === 0) {
        data.orderTotal = orderTotal
        data.prePurchasedCases = 0
        data.prePurchasedBottles = 0
        return data
      } else {
        data.prePurchasedCases = caseAmount(result[0].bottles_purchased)
        data.prePurchasedBottles = result[0].bottles_purchased
        return knex('orders')
          .where('customer_id', result[0].id)
          .join('purchased_items', 'orders.id', '=', 'purchased_items.order_id')
          .then(result => {
            result.map(item => {
              orderTotal += item.quantity
            })
            data.orderTotal = orderTotal
            return data
          })
      }
    })
}

const shippingRates = {
  AB: [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000],
  BC: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
  MB: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
  NB: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
  NL: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
  NT: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
  NS: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
  NU: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
  ON: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
  PE: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
  QC: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
  SK: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
  YT: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
}

app.post('/custom-shipping', function(req, res) {
  const { province } = req.body.rate.destination
  console.log(province);
  
  let data = {
    rates: [
      {
        service_name: 'Cellar Direct Custom Shipping',
        service_code: 'BC',
        total_price: '1295',
        currency: 'CAD',
      },
    ],
  }
  function genericShippingInfo(
    rates,
    prePurchasedCases,
    prePurchasedBottles,
    orderTotal,
  ) {
    rates.service_code = province
    rates.description = `You have previously paid for the shipping on ${
      prePurchasedCases
    } cases & bought ${prePurchasedBottles} bottles.`
    rates.service_name = `Cellar Direct Tiered Shipping - ${caseAmount(
      orderTotal,
    )} Case Tier`
  }

  function shippingCalculator(rates, orderTotal, prePurchasedCases) {
    shippingKey = caseAmount(orderTotal)

    let shippingTotal = 0

    for (let index = prePurchasedCases; index < shippingKey; index++) {
      shippingTotal += shippingRates[`${province}`][index]
    }
    rates.total_price = shippingTotal.toString()
  }

  findAddress(req.body.rate).then(result => {
    const { prePurchasedCases, prePurchasedBottles, orderTotal } = result

    if (result.prePurchasedCases === 0) {
      genericShippingInfo(
        data.rates[0],
        prePurchasedCases,
        prePurchasedBottles,
        orderTotal,
      )

      //TODO see if this can be refactored. check if the <= can be used for other case
      shippingCalculator(data.rates[0], orderTotal, prePurchasedCases)

      res.json(data)
    } else {
      genericShippingInfo(
        data.rates[0],
        prePurchasedCases,
        prePurchasedBottles,
        orderTotal,
      )
      if (result.prePurchasedCases === caseAmount(result.orderTotal)) {
        data.rates[0].total_price = '00'
      } else {
        //get the max key of shipping amounts.
        shippingCalculator(data.rates[0], orderTotal, prePurchasedCases)
      }
      res.json(data)
    }
  })
})

// Create shopify middlewares and router
const shopify = ShopifyExpress(shopifyConfig)

// Mount Shopify Routes
const { routes, middleware } = shopify
const { withShop, withWebhook } = middleware

app.use('/', routes)

// Client
app.get('/', withShop, function(request, response) {
  const { session: { shop, accessToken } } = request
  response.render('app', {
    title: 'Shopify Node App',
    apiKey: shopifyConfig.apiKey,
    shop: shop,
  })
})

function newCustomerOrder(body) {
  const { email, first_name: firstName, last_name: lastName } = body.customer

  const { address1: address } = body.customer.default_address

  // totals the amount of bottles purchased to insert or increment in the db
  let bottlesPurchased = 0
  body.line_items.map(item => {
    bottlesPurchased += item.quantity
  })

  // finds a custoemr with the address used (may need to replace this)
  return knex('customers')
    .select()
    .where('address', address)
    .then(result => {
      //if the customer doesn'y exist create one
      if (result.length === 0) {
        console.log('new user created')

        return knex('customers')
          .insert({
            first_name: firstName,
            last_name: lastName,
            email,
            address,
            bottles_purchased: bottlesPurchased,
          })
          .returning('id')
          .then(id => {
            // use the id of the customer created to create orders
            return knex('orders')
              .insert({
                customer_id: id[0],
              })
              .returning('id')
          })
          .then(id => {
            //use the id of the orders to create pruchased items
            body.line_items.map(item => {
              return knex('purchased_items')
                .insert({
                  product_name: item.title,
                  quantity: item.quantity,
                  order_id: id[0],
                })
                .then(() => {
                  return true
                })
            })
            return true
          })
      } else {
        //if the customer does exist, find them and increment the bottlesPurchased
        return knex('customers')
          .select()
          .where('address', address)
          .increment('bottles_purchased', bottlesPurchased)
          .returning('id')
          .then(result => {
            // insert the new order
            return knex('orders')
              .insert({
                customer_id: result[0],
              })
              .returning('id')
              .then(id => {
                // insert the new purchases connected to the order
                body.line_items.map(item => {
                  // console.log(item.title)
                  return knex('purchased_items')
                    .insert({
                      product_name: item.title,
                      quantity: item.quantity,
                      order_id: id[0],
                    })
                    .then(() => {
                      return true
                    })
                })
                return true
              })
          })
      }
    })

  return true
}

app.post('/order-create', function(req, res) {
  newCustomerOrder(req.body)
  res.sendStatus(200)
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
