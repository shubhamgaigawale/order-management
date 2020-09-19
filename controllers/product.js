const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");
const { update } = require("../models/product");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Product not found."
                })
            }
            req.product = product;
            next();
        })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image."
            })
        }
        //Destructure the fields
        const { price, name, description, category, stock } = fields
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error:"Please include all fields."
            })
        }

        let product = new Product(fields)

        //Handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size to big."
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type
        }
        console.log(product)

        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Saving product in database failed."
                })
            }
            res.json(product)
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(res.product);
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with image."
            })
        }
        //Updation code
        let product = req.product;
        product = _.extend(product, fields)

        //Handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size to big."
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type
        }
        console.log(product)

        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Updation of product in database failed."
                })
            }
            res.json(product)
        })
    })
}

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error:"Failed to delete product."
            })
        }
        res.json({
            message:"Delete successfully",
            deletedProduct
        })
    })
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? (eq.query.sortBy) : "_id";
    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, products) => {
            if(err){
                return res.status(400).json({
                    error:"No products found."
                })
            }
            res.json(products);
        })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("Category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error:"No category found."
            })
        }
        res.json(category);
    })
}

//middleware
exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content_Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next()
}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {
                    $inc : {stock: -prod.count, sold: +prod.count}
                }
            }
        }
    })
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error:"Bulk operations failed"
            })
        }
        next()
    })
} 


