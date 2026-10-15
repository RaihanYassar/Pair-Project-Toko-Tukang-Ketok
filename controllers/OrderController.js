'use strict';
const { Order, OrderItem, Product, Category, UserProfile, User} = require('../models/index')
const formatRupiah = require('../helpers/formatRupiah')
const { sendInvoiceEmail } = require('../helpers/nodeMailer')

class OrderController {
  
  static async getCart(req, res) {
    try {
      const userId = req.session.user.id

      const orders = await Order.findAll({
        where: { UserId: userId },
        include: [
          {
            model: User,
            include: [UserProfile]
          },
          {
            model: Product,
            include: [Category],
            through: { attributes: ['totalPrice'] }
          }
        ]
      });

      res.render('product/cart', { 
        orders, 
        formatRupiah, 
        sessionUser: req.session.user 
      });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async postCart(req, res) {
    try {
      const { productId } = req.params
      const userId = req.session.user.id

      // dicek stoknya
      const product = await Product.findByPk(productId)
      if (!product || product.stock <= 0) {
        return res.send('Maaf, stok produk ini sudah habis!')
      }

      // buat Order berdasarkan UserId
      let [order, created] = await Order.findOrCreate({
        where: { UserId: userId },
        defaults: { UserId: userId }
      });

      // ngecek produk sudah ada di OrderItem
      let orderItem = await OrderItem.findOne({
        where: {
          OrderId: order.id,
          ProductId: productId
        }
      })

      if (orderItem) {
        // jika sudah jumlahkan (totalPrice/qty)
        await orderItem.update({
          totalPrice: orderItem.totalPrice + 1
        })
      } else {
        // buat record baru di OrderItem kalau blum
        await OrderItem.create({
          OrderId: order.id,
          ProductId: productId,
          totalPrice: 1
        });
      }

      await product.update({
        stock: product.stock - 1
      });

      res.redirect('/orders')
    } catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

  static async renderInvoice(req, res) {
    try {
      const { id } = req.params

      const order = await Order.findByPk(id, {
        include: [
          { model: User, include: [UserProfile] },
          { model: Product, include: [Category], through: { attributes: ['totalPrice'] } }
        ]
      });

      if (!order) {
        return res.send('Invoice tidak ditemukan!')
      }

      res.render('product/invoice', { 
        order, 
        formatRupiah, 
        sessionUser: req.session.user 
      })
    } catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

  static async sendEmailInvoice(req, res) {
    try {
      const { id } = req.params

      const order = await Order.findByPk(id, {
        include: [
          { model: User, include: [UserProfile] },
          { model: Product, through: { attributes: ['totalPrice'] } }
        ]
      });

      if (!order || !order.User) {
        return res.send('Data order atau user tidak ditemukan!');
      }

      let grandTotal = 0;
      order.Products.forEach(prod => {
        let qty = prod.OrderItem.totalPrice || 1;
        grandTotal += prod.price * qty;
      });

      // helper
      await sendInvoiceEmail(order.User.email, order, formatRupiah(grandTotal));

      res.redirect(`/orders/${id}/invoice`);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

}

module.exports = OrderController;