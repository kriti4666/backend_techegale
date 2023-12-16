
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const customerController = require('../controllers/customerController');


router.use(authMiddleware('Customer'));

router.get('/inventory', customerController.getInventory);
router.post('/addToCart', customerController.addToCart);
router.post('/userCart', customerController.getUserCart);
router.put('/updateCartItem', customerController.updateCartItem);
router.post('/placeOrder', customerController.placeOrder);
router.get('/trackOrder/:orderId', customerController.trackOrder);
router.post('/orders', customerController.getUserOrders)

module.exports = router;
