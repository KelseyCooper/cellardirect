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
          .onDelete('CASCADE')
      }),
  
      knex.schema.createTable('purchased_items', table => {
        table.increments('id')
        table.string('product_name')
        table.integer('quantity')
        table
          .integer('order_id')
          .unsigned()
          .references('orders.id')
          .onDelete('CASCADE')
      }),
      knex.schema.createTable('shipping_rates', table => {
        table.specificType('AB', 'integer ARRAY')
        table.specificType('BC', 'integer ARRAY')
        table.specificType('MB', 'integer ARRAY')
        table.specificType('NB', 'integer ARRAY')
        table.specificType('NL', 'integer ARRAY')
        table.specificType('NT', 'integer ARRAY')
        table.specificType('NS', 'integer ARRAY')
        table.specificType('NU', 'integer ARRAY')
        table.specificType('ON', 'integer ARRAY')
        table.specificType('PE', 'integer ARRAY')
        table.specificType('QC', 'integer ARRAY')
        table.specificType('SK', 'integer ARRAY')
        table.specificType('YT', 'integer ARRAY')
      })
    ])
  }
  
  exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('purchased_items'),
        knex.schema.dropTable('orders'),
        knex.schema.dropTable('customers'),
        knex.schema.dropTable('shipping_rates')
    ])
  }
  