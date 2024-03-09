// models/CartModel.js

const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

const CartModel={

  async addToCart(userId, productId, quantity) {
    try {
      // Add the product to the cart for the specified user
      await db('cart').insert({ user_id: userId, product_id: productId, quantity });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async getCartItems(userId) {
    try {
      // Fetch cart items for the specified user
      return await db('cart')
        .select('products.id', 'products.name', 'products.price', 'cart.quantity')
        .innerJoin('products', 'cart.product_id', 'products.id')
        .where('cart.user_id', userId);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  }

  // Add other cart-related methods as needed
}

module.exports = CartModel;
