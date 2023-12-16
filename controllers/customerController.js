const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const mongoose = require('mongoose');


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



//ADD_TO_CART
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (cartItemIndex !== -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//GET USER CART
exports.getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId).populate('cart.productId');
    if (user && user.cart) {
      res.status(200).json(user.cart);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


//UPDATE CART ITEM
exports.updateCartItem = async (req, res) => {
  try {
    // const { productId } = req.params;
    const { quantity, userId, productId } = req.body;

    // console.log(productId, quantity, userId)



    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({ message: 'Not enough quantity available' });
    }

    await User.updateOne({ _id: userId, 'cart.productId': productId }, { $set: { 'cart.$.quantity': quantity } });

    res.status(200).json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


//PLACE ORDER
exports.placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate('cart.productId');

    if (!user.cart.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderedProducts = user.cart.map(item => ({ 
      productId: item.productId._id, 
      quantity: item.quantity 
    }));

    let orderTotal = 0;

    for (const item of orderedProducts) {
      const product = await Product.findById(item.productId);

      if (!product || product.quantity < item.quantity) {
        throw new Error('Insufficient stock for one or more products');
      }

      product.quantity -= item.quantity;
      await product.save();


      const productTotal = item.quantity * product.price;
      orderTotal += productTotal;
    }

    const order = new Order({
      customerId: userId,
      products: orderedProducts,
      total: orderTotal, 
    });

    await order.save();
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




// GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const userOrders = await Order.find({ customerId: userId });

    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//TRACK ORDER
exports.trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
