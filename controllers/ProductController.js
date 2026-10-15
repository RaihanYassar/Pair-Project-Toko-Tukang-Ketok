const { Product, Category } = require('../models/index')

class ProductController {
  static async products(req, res) {
    try {
      const { search, message } = req.query
      const products = await Product.getAvailableProducts(search)

      res.render('product/products', { 
        products, 
        search, 
        message,
        sessionUser: req.session.user 
      })
    } catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

  static async detailProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [Category]
      });

      if (!product) {
        return res.send('Produk tidak ditemukan!')
      }

      res.render('product/productDetail', { 
        product, 
        sessionUser: req.session.user 
      })
    } catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

  static async getAdd(req, res) {
    try {
      const categories = await Category.findAll();
      
      res.render('product/addProduct', { 
        categories,
        sessionUser: req.session.user 
      });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async postAdd(req, res) {
    try {
      const { name, price, stock, CategoryId, description, imageUrl } = req.body;

      await Product.create({
        name,
        price,
        stock,
        CategoryId,
        description,
        imageUrl
      });

      res.redirect('/products');
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
  
  static async getEdit(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      const categories = await Category.findAll();

      res.render('product/editProduct', { 
        product, 
        categories, 
        sessionUser: req.session.user 
      });
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static async postEdit(req, res) {
    try {
      const { id } = req.params
      const { name, price, stock, CategoryId, description, imageUrl } = req.body;
      
      await Product.update(
        { name, price, stock, CategoryId, description, imageUrl },
        { where: { id } }
      );
      
      res.redirect('/products');
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  static delete(req, res) {
    const { id } = req.params;
    
    Product.destroy({ 
      where: { id } 
    })
    .then((result) => {
      res.redirect('/products?message=Produk berhasil dihapus');
    })
    .catch((error) => {
      console.log(error);
      res.send(error.message);
    });
  }
}

module.exports = ProductController