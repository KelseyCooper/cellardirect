exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('customers', function(table) {
        table.increments('id')
        table.string('first_name')
        table.string('last_name')
        table.string('address').unique()
        table.string('email')
        table.string('province')
        table.integer('bottles_purchased')
      }),
  
      knex.schema.createTable('orders', table => {
        table.increments('id')
        table
          .integer('customer_id')
          .unsigned()
          .references('customers.id')
      }),
  
      knex.schema.createTable('purchased_items', table => {
        table.increments('id')
        table.string('product_name')
        table.integer('quantity')
        table
          .integer('order_id')
          .unsigned()
          .references('orders.id')
      }),
    ])
  }
  
  exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('purchased_items'),
        knex.schema.dropTable('orders'),
        knex.schema.dropTable('customers')
    ])
  }
  