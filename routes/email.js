let express = require('express');
let app = express();
let nodemailer = require('nodemailer');

let Factura = require('../models/factura');
// let env = require('../env');

app.get('/factura/:id', (req, res)=>{

    Factura.findById(req.params.id, (err, factura)=>{
        if(err){
            return res.status(500).json({
                error: err
            })
        }
        
        let transporter = nodemailer.createTransport({
            host: "smtp.ionos.es",
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: "curso15@sapienslearning.com",
                pass: "Stavros1234*"
            }
        });

        // Autorizar (solo para Google) desde https://myaccount.google.com/lesssecureapps

        let mailOptions = {
            from: 'curso15@sapienslearning.com',
            to: factura.cliente.email,
            subject: `Nueva factura n. ${factura.numero} de ACME, S.A.`,
            html: `
                Buenos días Genesio...
                <img src="http://sapienslearning.com/assets/logo.svg">
            `,
            attachments: [
                {
                    path: `facturas/${factura.numero}.pdf`,
                    contentType: 'application/pdf'
                }
            ]
        }

        transporter.sendMail(mailOptions, (err, info)=>{
            if(err) {
                console.log(err);
            } else {
                console.log('Éxito total' + info.response);
                res.status(200).json({
                    mensaje: 'El correo electrónico fue enviado con éxito'
                })
            }
        })

    })

})

module.exports = app;

