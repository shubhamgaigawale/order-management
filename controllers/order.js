const {Order, ProductCart} = require("../models/order");
const { json } = require("body-parser");

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, oder) => {
        if(err){
            return res.status(400).json({
                error:"No order in database"
            })
        }
        req.oder = oder;
        next();
    })
}

exports.createOrder = (req, res) => {
    req.body.oder.user = req.profile;
    const order = new Order(req.body.order)
    order.save((err, order) => {
        if(err){
            return res.status(400).json({
                error:"Failed to save order in database"
            })
        }
        res.json(order);
    })

}

exports.getAllOrders = (req, res) => {
    Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error:"Not able to find order."
            })
        }
        res.json(order);
    })
}


exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
}


exports.updateStatus = (req, res) => {
    Order.update(
        {_id:req.body.orderId},
        {$set: {status:req.body.status}        },
        (err, order) => {
            if(err){
                return res.status(400).json({
                    error:"Cannot update order status"
                })
            }
            res.json(order);
        }
    )
}
