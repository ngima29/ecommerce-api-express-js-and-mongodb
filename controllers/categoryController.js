const Category = require('../models/categoryModel')

// to post a category in the database
exports.postCategory = async (req, res) => {
    let category = new Category(req.body)
    Category.findOne({ category_name: category.category_name }, async (error, data) => {
        if (data == null) {
            category = await category.save()
            if (!category) {
                return res.status(400).json({ error: 'something went wrong' })
            }
            res.json({ category })
        }
        else
            return res.status(400).json({ error: 'category name must be unique' })
    })

}
//  to show all category list
exports.categoryList = async (req, res) => {
    const category = await Category.find()
    if (!category) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(category)

}

// to show category details
exports.categoryDetails = async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) {
        return res.status(400).json({ error: 'something went wrong' })
    }
    res.send(category)
}


//  to updata category

exports.updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            category_name: req.body.category_name
        },
        { new: true }
    )
    if (!category) {
        return res.status(400).json({ error: 'category name must be unique' })
    }
    res.send(category)
}


// to delete category
exports.deleteCategory = (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (!category) {
            return res.status(403).jsnon({ error: 'category not found' })
        }
        else {
            return res.status(200).json({ message: 'category deleted' })
        }
    })
        .catch(err => {
            return res.status(400).json({ error })
        })
}