const orderItem = require('../models/order-item.js')
const Order = require('../models/orderModel.js')


// post order

exports.postOrder= async (req,res)=>{
    const orderItemIds= Promise.all(req.body.orderItems.map(async(orderItem)=>{
        let newOrderItem= new orderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })
        newOrderItem= await newOrderItem.save()
        return newOrderItem._id
    }))
   const orderItemIdResolved = await orderItemIds

   const TotalPrices = await Promise.all(orderItemIdResolved.map(async(orderId)=>{
    const itemOrder = await orderItem.findById(orderId).populate('product','product_price')
    const total = itemOrder.quantity*itemOrder.product.product_price
    return total

   }))
   const TotalPrice = TotalPrices.reduce((a,b)=>a+b,0)

   let order = new Order({
    orderItems:orderItemIdResolved,
    shippingAddress1:req.body.shippingAddress1,
    shippingAddress2:req.body.shippingAddress2,
    city:req.body.city,
    zip:req.body.zip,
    country:req.body.country,
    totalPrice:TotalPrice,
    phone:req.body.phone,
    user:req.body.user

   })
   order = await order.save()
   if(!order){
    return res.status(400).json({erroe:"something went wrong"})

   }
   res.send(order)
   
}

//order list

exports.orderList= async(req,res)=>{
    const order = await Order.find()
    .populate('user',"name")
    .sort({dataOrdered:-1})
    if(!order){ 
        return res.status(400).json({erroe:"something went wrong"})

   }
   res.send(order)
}

// order details
exports.orderDetails = async (req,res)=>{
    const order = await Order.findById(req.params.id)
    .populate('user','name')
    .populate({
        path:'orderItems',populate:{
            path:'product',populate: 'category'
        }
    })
    if(!order){ 
        return res.status(400).json({erroe:"something went wrong"})

   }
   res.send(order)

}

// update status 

exports.updateStatus = async(req,res)=>{
    const order = await Order.findByIdAndUpdate(
        req.param.id,{
            status:req.body.status
        },
            {new:true}    
    )
    if(!order){ 
        return res.status(400).json({erroe:"something went wrong"})

   }
   res.send(order)
}
//user order

exports.userOrders =async (req,res)=>{
    const userOrderList = await Order.find({user:req.params.user})
    .populate({
        path:'orderItems',populate:{
            path:'product',populate: 'category'
        }
    })
    .sort({dataOrdered:-1})
    if(!userOrderList){ 
        return res.status(400).json({erroe:"something went wrong"})

   }
   res.send(userOrderList)
}

// detele ordre

exports.deleteOrder= async (req,res)=>{
    Order.findByIdAndRemove(req.params.id.then(async(order)=>{
        if(order){
            await order.orderItem.map(async orderItem =>{
                await orderItem.findByIdAndRemove(orderItem)
            })
            return res.status(400).json({'message':" order has been delete"})
        }else{
            return res.status(400).json({error:"failed to delete order"})   
        }
    }))
    .catch(err=>{
        return res.status(400).json({error:"failed to delete order"})
    }
    )
}