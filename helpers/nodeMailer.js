'use strict';
const nodemailer = require('nodemailer');

const sendInvoiceEmail = async (toEmail, orderData, formattedTotal) => {
  try {
    // 1. Buat akun testing otomatis (Ethereal Email) supaya 100% lgsg jalan tanpa setting Gmail
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true untuk port 465, false untuk port lainnya
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // 2. Susun isi email nota
    let info = await transporter.sendMail({
      from: '"Tukang Ketok Store" <noreply@tukangketok.com>',
      to: toEmail, // Email tujuan (bisa email siapa aja)
      subject: `Nota Pembelian #INV-00${orderData.id} - Tukang Ketok`,
      text: `Halo! Terima kasih sudah berbelanja perkakas di Tukang Ketok.\n\nNomor Invoice: INV-00${orderData.id}\nTotal Pembayaran: ${formattedTotal}\n\nSilakan cek website kami untuk detail pesanan.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #333;">Nota Pembelian - Tukang Ketok</h2>
          <hr>
          <p>Halo! Terima kasih sudah berbelanja perkakas di toko kami.</p>
          <p><strong>No. Invoice:</strong> INV-00${orderData.id}</p>
          <p><strong>Total Pembayaran:</strong> <span style="color: green; font-weight: bold;">${formattedTotal}</span></p>
          <br>
          <p><i>Barang yang sudah diketok tidak dapat ditukar kembali. Salam, Tukang Ketok!</i></p>
        </div>
      `
    });

    console.log("Message sent: %s", info.messageId);
    
    // Ini penting! Ethereal nyediain link preview email supaya lo bisa lgsg liat bentuk emailnya di browser
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return true;
  } catch (error) {
    console.log("Gagal kirim email:", error);
    return false;
  }
};

module.exports = { sendInvoiceEmail };