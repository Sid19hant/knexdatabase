const express = require('express');
const passport = require('passport');
const router = express.Router();
const userModel = require('../models/user');
const user=require('../migrations/20240307144030_users')
const ProductModel=require('../models/products')
const CartModel=require('../models/cart')

router.get('/register', (req, res) => {
  res.render('register'); // Render registration form
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }
    await userModel.createUser(username, password);
    res.redirect('/login');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

router.get('/login', (req, res) => {
  res.render('login'); // Render login form
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));
const knex = require('knex');
const knexConfig = require('../knexfile');

router.get('/dashboard',isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.getUserByUsername(req.session.passport.user);
    const products = await ProductModel.getAllProducts();
    res.render('dashboard', { user, products });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal server error');
  }
});

router.post('/add-to-cart',isLoggedIn, async function(req, res, next) {
  try {
    const userId = req.user.id; // Assuming user is authenticated and user data is available in req.user
    const { productId, quantity } = req.body;
    await CartModel.addToCart(userId, productId, quantity);
    res.redirect('/cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send('Internal server error');
  }
});

router.get('/cart',isLoggedIn, async function(req, res, next) {
  try {
    const userId = req.user.id; // Assuming user is authenticated and user data is available in req.user
    const cartItems = await CartModel.getCartItems(userId);
    res.render('cart', { cartItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).send('Internal server error');
  }
});


router.get("/logout",function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})
function isLoggedIn(req,res,next){
  if (req.isAuthenticated())return next();
  res.redirect("/login")
}
module.exports = router;
