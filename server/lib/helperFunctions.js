const ENV = process.env.ENV || 'development'
const knexConfig = require('../knexfile')
const knex = require('knex')(knexConfig[ENV])


// Totals the case amount purchased, 12 = 1, 13 = 2.
function caseAmount(num) {
  let number = Math.floor(num / 12) + 1
  if (num % 12 === 0) {
    number -= 1
  }
  return number
}

// Returns the shipping rates from the db
function fetchShippingRates() {
  return knex('shipping_rates')
  .select('*')
  .returning('*')
  .then((result) => {
    return result
  })
}

// finds address in the db
async function findAddress(rate) {
  const { address1: address } = rate.destination
  const data = {}
  let orderTotal = 0
  await rate.items.map((item) => {
    while (item.quantity >= 12) {
      item.quantity = item.quantity - 12
    }
    orderTotal += item.quantity
  })
  return await knex('customers')
    .select()
    .where('address', address)
    .returning('*')
    .then((result) => {
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
          .then((result) => {
            result.map((item) => {
              orderTotal += item.quantity
            })
            data.orderTotal = orderTotal
            return data
          })
      }
    })
}

// Creates new customer, order, and purchased_items in the db
function newCustomerOrder(body) {
  const { email, first_name: firstName, last_name: lastName } = body.customer

  const {
    address1: address,
    province_code: province,
  } = body.customer.default_address

  // totals the amount of bottles purchased to insert or increment in the db
  let bottlesPurchased = 0
  body.line_items.map((item) => {
    while (item.quantity >= 12) {
      item.quantity = item.quantity - 12
    }
    bottlesPurchased += item.quantity
  })

  // finds a custoemr with the address used (may need to replace this)
  return knex('customers')
    .select()
    .where('address', address)
    .then((result) => {
      //if the customer doesn'y exist create one
      if (result.length === 0) {
        return knex('customers')
          .insert({
            first_name: firstName,
            last_name: lastName,
            email,
            address,
            province,
            bottles_purchased: bottlesPurchased,
          })
          .returning('id')
          .then((id) => {
            // use the id of the customer created to create orders
            return knex('orders')
              .insert({
                customer_id: id[0],
              })
              .returning('id')
          })
          .then((id) => {
            //use the id of the orders to create pruchased items
            body.line_items.map((item) => {
              while (item.quantity >= 12) {
                item.quantity = item.quantity - 12
              }
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
          .then((result) => {
            // insert the new order
            return knex('orders')
              .insert({
                customer_id: result[0],
              })
              .returning('id')
              .then((id) => {
                // insert the new purchases connected to the order
                body.line_items.map((item) => {
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

// info that is sent back to the customer about their shipping
function genericShippingInfo(
  rates,
  prePurchasedCases,
  prePurchasedBottles,
  orderTotal,
  province,
) {
  rates.service_code = province
  rates.description = `You have previously paid for the shipping on ${prePurchasedCases} cases & bought ${prePurchasedBottles} bottles.`
  rates.service_name = `Cellar Direct Tiered Shipping - ${caseAmount(
    orderTotal,
  )} Case Tier - ${orderTotal}/${caseAmount(orderTotal) * 12} Bottles`
}

// Calculates shipping amount
async function shippingCalculator(rates, orderTotal, prePurchasedCases, province) {

  const shippingKey = caseAmount(orderTotal)
  const shippingRates = await fetchShippingRates()

  let shippingTotal = 0

  for (let index = prePurchasedCases; index < shippingKey; index++) {
    
    shippingTotal += shippingRates[0][`${province}`][index]
  }
  
  rates.total_price = shippingTotal.toString()
}

// Checks if an object is empty
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false
  }
  return true
}

// Gets customers list and deals with province filters
async function getCustomerList(filters) {
  let customers = []

  if (isEmpty(filters)) {
    return knex('customers').returning('*')
  } else {
    let customers = []
    await Promise.all(
      filters.map(async (item) => {
        return await knex('customers')
          .where('province', item.value)
          .then((filterResult) => {
            filterResult.map((item) => {
              customers.push(item)
            })
          })
      }),
    )
    return await customers
  }
}

// deletes customer, orders, and purchased_items from the db
async function deleteCustomers(ids) {
  await ids.map((id) => {
    return knex('orders')
      .where('customer_id', id)
      .then((result) => {
        result.map((item) => {
          return knex('purchased_items')
            .where('order_id', item.id)
            .del()
            .then((result) => {
              return true
            })
        })
        return true
      })
      .then(() => {
        return knex('orders')
          .where('customer_id', id)
          .del()
          .then(() => {
            return true
          })
      })
      .then(() => {
        return knex('customers')
          .where('id', id)
          .del()
        return true
      })
    return true
  })
  return true
}

// Search within an object for a key value
function search(nameKey, myArray) {
  let returnArray = []

  for (var i = 0; i < myArray.length; i++) {
    if (
      myArray[i].first_name === nameKey ||
      myArray[i].last_name === nameKey ||
      myArray[i].province === nameKey ||
      myArray[i].email === nameKey ||
      myArray[i].address === nameKey
    ) {
      returnArray.push(myArray[i])
    }
  }
  return returnArray
}

// Returns customer list after search
async function getCustomerListWithSearch(searchFilter, result) {
  let searchResult = []
  await Promise.all(
    searchFilter.map(async (item) => {
      const resultObject = search(item.value, result)
      await searchResult.push(resultObject)
    }),
  )
  return await searchResult
}


// Updates the shipping rates for all provinces, then returns the rates
async function updateShipping(rates) {
  
  for (let key in rates) {
    await knex('shipping_rates')
    .update({
      [key]: rates[key]
    })
  }

  return await knex('shipping_rates')
  .select('*')
  .returning('*')
  .then((result) => {
    return result
  })
}

module.exports = {
  caseAmount,
  findAddress,
  newCustomerOrder,
  genericShippingInfo,
  shippingCalculator,
  getCustomerList,
  deleteCustomers,
  isEmpty,
  search,
  getCustomerListWithSearch,
  updateShipping,
  fetchShippingRates,
}
