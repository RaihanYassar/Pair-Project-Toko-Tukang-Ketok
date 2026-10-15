const express = require('express');
const router = express.Router()
const UserController = require('../controllers/UserController')
const ProductController = require('../controllers/ProductController')
const OrderController = require('../controllers/OrderController')
const {authMiddleware, isSeller} = require('../routes/auth')

// Route Publik
router.get('/', UserController.home)
router.get('/login', UserController.getLoginPage)
router.post('/login', UserController.postLoginPage)
router.get('/register', UserController.getRegisterPage)
router.post('/register', UserController.postRegisterPage)
router.get('/logout', UserController.getLogout)

// Route Seller
router.get('/products/add', isSeller, ProductController.getAdd);
router.post('/products/add', isSeller, ProductController.postAdd);

// Route Produk
router.get('/products', authMiddleware, ProductController.products)
router.get('/products/:id', authMiddleware, ProductController.detailProduct)
router.get('/products/:id/edit', isSeller, ProductController.getEdit)
router.post('/products/:id/edit', isSeller, ProductController.postEdit)
router.get('/products/:id/delete', isSeller, ProductController.delete)

// Route Keranjang/Order
router.post('/products/:productId/buy', authMiddleware, OrderController.postCart)
router.get('/orders', authMiddleware, OrderController.getCart)

// Node Mailer
router.get('/orders/:id/invoice', authMiddleware, OrderController.renderInvoice)
router.get('/orders/:id/send-email', authMiddleware, OrderController.sendEmailInvoice)

module.exports = router