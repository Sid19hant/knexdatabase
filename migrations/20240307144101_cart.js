// migrations/create_cart_table.js
const knex=require('../knexfile')

exports.up = function(knex) {
    return knex.schema.createTable('cart', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('product_id').unsigned().notNullable().references('id').inTable('products').onDelete('CASCADE');
      table.integer('quantity').notNullable().defaultTo(1);
      // Add other columns as needed
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('cart');
  };
  