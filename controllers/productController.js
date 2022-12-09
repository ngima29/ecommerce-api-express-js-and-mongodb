const Product = require('../models/productModel')

// to store produt
exports.postProduct = async (req, res) => {
    let product = new Product({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        countInstock: req.body.countInstock,
        product_description: req.body.product_description,
        product_image: req.file.path,
        category: req.body.category



    })
    product = await product.save()
    if (!product) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(product)
}

// to show all product list
exports.productList = async (req, res) => {
    const product = await Product.find().populate('category')
    if (!product) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(product)
}

// to show product details
exports.productDetails = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(product)
}


//  to delete a product

exports.deleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.params.id).then(product => {
        if (!product) {
            return res.status(403).json({ error: 'product not found' })
        }
        else {
            return res.status(200).json({ message: 'product has been successfully delete' })
        }
    })
        .catch(err => {
            return res.status(400).json({ error })
        })
}

// to update Product
exports.updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        countInstock: req.body.countInstock,
        product_description: req.body.product_description,
        product_image: req.body.product_image,
        category: req.body.category

    },
        { new: true }
    )
    if (!product) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(product)
}