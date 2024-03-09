const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);
const bcrypt = require('bcrypt');



const product= {


  async getAllProducts() {
    try {
      return await db('products').select('*');
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  }

  // Add other product-related methods as needed
}

module.exports = product;
