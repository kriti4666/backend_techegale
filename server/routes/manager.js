
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const managerController = require('../controllers/managerController');


router.use(authMiddleware('Manager'));

router.get('/getproducts', managerController.getInventory)
router.post('/addProduct', managerController.addProduct);
router.put('/updateProductQuantity', managerController.updateProductQuantity);
router.delete('/deleteProduct', managerController.deleteProduct);
router.post('/placeOrder', managerController.placeOrder);
router.put('/orders/updateStatus', managerController.updateOrderStatus);
router.post('/singleProduct', managerController.getSingleProduct);
router.get('/orders/all', managerController.getAllUsersOrders);


module.exports = router;
