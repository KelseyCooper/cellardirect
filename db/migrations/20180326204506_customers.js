exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable("customers", function(table) {
        table.increments('id');
        table.string("name");
        table.string("email");
        table.string("gender");
        table.integer("age");
        table.string("reason_to_buy");
      }),
  
      knex.schema.createTable('purchased', (table) => {
        table.increments('id');
        table.integer('order_number');
        table.string('color');
        table.string('size');
        table.integer('user_id').unsigned()
        .references('customers.id')
      })
    ])
  };
  
  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('purchased'),
      knex.schema.dropTable("customers")
    ]);
  };