exports.seed = async function(knex, Promise) {
  await knex('purchased_items').del()
  await knex('orders').del()
  await knex('customers').del()
  await knex('shipping_rates').del()
  await knex.raw('ALTER SEQUENCE customers_id_seq RESTART WITH 1')
  await knex.raw('ALTER SEQUENCE orders_id_seq RESTART WITH 1')
  await knex.raw('ALTER SEQUENCE purchased_items_id_seq RESTART WITH 1')
  await knex('customers')
    .then(() => {
      return knex('customers').insert({
        first_name: 'Bruce',
        last_name: 'Smith',
        address: '120 Maple st',
        email: 'fake@emal.com',
        province: 'BC',
        bottles_purchased: 2,
      })
    })
    .then(() => {
      return knex('customers').insert({
        first_name: 'Kelly',
        last_name: 'Graddy',
        address: '1222 Brown Ave',
        email: 'fake@emal.com',
        province: 'AB',
        bottles_purchased: 2,
      })
    })
    .then(() => {
      return knex('customers').insert({
        first_name: 'Shirley',
        last_name: 'Dunlop',
        address: '92 Hillcrest circle',
        email: 'fake@emal.com',
        province: 'BC',
        bottles_purchased: 5,
      })
    })
    .then(() => {
      return knex('customers').insert({
        first_name: 'Shirley',
        last_name: 'Reid',
        address: '1220 Quartz st',
        email: 'fake@emal.com',
        province: 'SK',
        bottles_purchased: 3,
      })
    })
    .then(() => {
      return knex('customers').insert({
        first_name: 'Matt',
        last_name: 'Ford',
        address: '2220 Green st',
        email: 'fake@emal.com',
        province: 'AB',
        bottles_purchased: 1,
      })
    })
    .then(() => {
      return knex('customers').insert({
        first_name: 'Kelsey',
        last_name: 'Cooper',
        address: '1055 Willow st',
        email: 'fake@emal.com',
        province: 'BC',
        bottles_purchased: 12,
      })
    })
  await knex('orders').then(() => {
    return knex('orders')
      .insert({
        customer_id: 1,
      })
      .then(() => {
        return knex('orders').insert({
          customer_id: 2,
        })
      })
      .then(() => {
        return knex('orders').insert({
          customer_id: 3,
        })
      })
      .then(() => {
        return knex('orders').insert({
          customer_id: 4,
        })
      })
      .then(() => {
        return knex('orders').insert({
          customer_id: 5,
        })
      })
      .then(() => {
        return knex('orders').insert({
          customer_id: 6,
        })
      })
  })
  await knex('purchased_items')
  .then(() => {
    return knex('purchased_items').insert({
      product_name: 'Chilean White Wine',
      quantity: 2,
      order_id: 1,
    })
  })
  .then(() => {
    return knex('purchased_items').insert({
      product_name: 'Red Italian Wine',
      quantity: 2,
      order_id: 2,
    })
  })
  .then(() => {
    return knex('purchased_items').insert({
      product_name: 'Red Italian Wine',
      quantity: 5,
      order_id: 3,
    })
  })
  .then(() => {
    return knex('purchased_items').insert({
      product_name: 'Portuguese Red Wine',
      quantity: 3,
      order_id: 4,
    })
  })
  .then(() => {
    return knex('purchased_items').insert({
      product_name: 'French Rosé Wine',
      quantity: 1,
      order_id: 5,
    })
  })
  .then(() => {
    return knex('purchased_items').insert({
      product_name: 'Portuguese Red Wine',
      quantity: 12,
      order_id: 6,
    })
  })
  .then(() => {
    return knex('shipping_rates').insert({
      AB: [10002, 9000, 7000, 6000, 5000, 4000, 3000, 2000, 1000],
      BC: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
      MB: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
      NB: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
      NL: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
      NT: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
      NS: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
      NU: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
      ON: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
      PE: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
      QC: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
      SK: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
      YT: [1000, 900, 700, 600, 500, 400, 300, 200, 100],
    })
  })
}
