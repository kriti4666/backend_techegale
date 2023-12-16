const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');



//GET INVENTORY
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Product.find();
    res.status(200).json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// GET ALL USER ORDERS
exports.getAllUsersOrders = async (req, res) => {
  try {
    const allOrders = await Order.find();

    res.status(200).json(allOrders);
  } catch (error) {
    console.error('Error fetching all users orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



//ADD PRODUCTS
exports.addProduct = async (req, res) => {
  try {
    const { name, image, description,
       weight, quantity, price } = req.body;


    const newProduct = new Product({ name, image, description, weight, quantity, price });

    await newProduct.save();

    res.status(201).json({ message: 'Product added to inventory successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



//UPDATE PRODUCT QUANTITY
exports.updateProductQuantity = async (req, res) => {
  try {
    const { quantity,productId } = req.body;


    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndUpdate(productId, { $set: { quantity } });

    res.status(200).json({ message: 'Product quantity updated successfully' });
  } catch (error) {
    console.error('Error updating product quantity:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


//DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Get Single Product
exports.getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching single product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



//PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const { customerId, products } = req.body;

    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const order = new Order({ customerId, products });

    await order.save();

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status,orderId } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
