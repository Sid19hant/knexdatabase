// models/user.js

const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);
const bcrypt = require('bcrypt');

const User = {
  getUserByUsername: async function(username) {
    try {
      return await db('users').where('username', username).first();
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  },
  findByUsername: async function(username) {
    return db('users').where('username', username).first();
  },

  findById: async function(id) {
    return db('users').where('id', id).first();
  },

  createUser: async function(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    return db('users').insert({ username, password: hashedPassword });
  },

  validPassword: async function(username, password) {
    const user = await this.findByUsername(username);
    if (!user) {
      return false; // User not found
    }
    return await bcrypt.compare(password, user.password); // Compare hashed password
  }
};

module.exports = User;
