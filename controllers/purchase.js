const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/users.js');
const usercontroller = require('./users');

exports.purchasePremium = async (req, res, next) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.razorpay_key_id,
            key_secret: process.env.razorpay_key_secret
        });
        const amount = 1500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            console.log("Generated Order ID:", order.id);
            try {
                const createOrder = await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
                return res.status(201).json({ order: createOrder, key_id: rzp.key_id });
            } catch (err) {
                throw new Error(err);
            }
        });
    } catch (error) {
        console.log('error', error);
        res.status(403).json({ message: 'Something Went Wrong', error: error });
    }
};

exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id }});

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Assuming you have a user ID associated with the order
        const userId = order.userId;

        // Fetch the user based on the user ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's premium status
        await user.update({ ispremiumuser: true });
        const token = usercontroller.generateAccessToken(userId,undefined, true);

        // Update the order status to SUCCESSFUL
        await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' }).then(() => {
            return res.status(202).json({ success: true, message: "Transaction Successful", token });
        })
       // await user.update({ ispremiumuser: true });

    } catch (error) {
        console.log(error);
        res.status(403).json({ error: error, message: 'Something went wrong' });
    }
};

exports.showPremium = async (req,res,next) => {
    try {
        const user = await User.findAll({where: {id: req.user.id}});
        res.status(200).json({success: true, user: user[0].dataValues});
    } catch (err) {
        console.log(err,'error');
        res.status(404).json({success: false, message: 'User is not found'});
    }
}