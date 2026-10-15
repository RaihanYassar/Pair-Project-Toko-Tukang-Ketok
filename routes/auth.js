'use strict';

const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login?error=Silakan login terlebih dahulu!');
  } else {
    next();
  }
};

const isSeller = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login?error=Silakan login terlebih dahulu!');
  }
  
  if (req.session.user.role === 'seller') {
    return next()
  }
  
  res.send('Akses ditolak! Halaman ini khusus untuk Seller (Penjual).');
};

module.exports = {
  authMiddleware,
  isSeller
};