const express = require('express')
const router = express.Router()
const {postOrder, orderList, orderDetails, updateStatus, userOrders, deleteOrder} = require('../controllers/orderController')


router.post('/postorder',postOrder)
router.get('/orderlist',orderList)
router.get('/orderdetails/:id',orderDetails)
router.put('/updatestatus', updateStatus)
router.get('/userorders/:user',userOrders)
router.delete('/deleteorders/:id',deleteOrder)


module.exports=router
