let express = require('express');
let nodemailer = require('nodemailer');

let Alumno = require('../models/alumno');

let app = express();

app.get('/', (req, res)=>{
    Alumno.find({}).exec((err, data)=>{
        if(err){
            return res.status(500).json({
                error: err
            });
        }
        res.status(200).json({
            alumnos: data
        })
    })
})

app.get('/search/:nombre', (req, res)=>{
    let termino = (req.params.nombre).normalize('NFD').replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").normalize().toLowerCase();
    Alumno.find({termino: {$regex: termino}}).exec((err, data)=>{
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        res.status(200).json({
            alumnos: data
        })
    })

})

app.get('/:id', (req, res)=>{
    Alumno.findById(req.params.id, (err, data)=>{
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        if(data === null) {
            return res.status(200).json({
                cliente: null,
                mensaje: 'El alumno ya no existe'
            })
        }
        res.status(200).json({
            alumno: data
        })
    })
})


app.post('/', (req, res)=>{
    let body = req.body;
    if(body.nombre === null) {
        body.nombre = ' ';
    }
    let alumno = new Alumno({
        nombre: body.nombre,
        termino: (body.nombre).normalize('NFD').replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").normalize().toLowerCase(),
        email: body.email,
        curso: body.curso,
        fecha: new Date()
    });
    alumno.save((err, data)=>{
        if (err) {
            return res.status(400).json({
                error: err
            });
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
            to: alumno.email,
            subject: `Nuevo Curso SAP SD Ventas y Distribución`,
            html: `
                <p>Hola ${alumno.nombre}, ¿cómo estas? espero te encuentres bien.</p>
 
                <p>Acabamos de lanzar el NUEVO Curso Consultor SAP SD desde Cero, dedicado al módulo de Ventas y Distribución, siendo el complemento perfecto para el curso de MM que ya realizas y continuar tu formación en este apasionante software.</p>
                
                <p>Como el de MM, incluye todos los procesos avanzados de usuario, el customizing del módulo y la integración con los demás módulos de SAP, partiendo desde cero para llegar a nivel experto.</p>
                
                <p>Te dejo a continuación el enlace con el máximo descuento que nos permite Udemy para ti, tus familiares o amigos, disponible hasta el 9 de mayo:</p>
                
                <p><a href="https://www.udemy.com/course/curso-completo-consultor-sap-sd-desde-cero/?couponCode=ED6808BE7B9FEE2F25BE">https://www.udemy.com/course/curso-completo-consultor-sap-sd-desde-cero/?couponCode=ED6808BE7B9FEE2F25BE</a></p>
                
                <p>Recuerda que te puedes inscribir ahora y realizarlo cuando quieras y siempre mantendrás el acceso a todos los cursos, para repasos, consultas, etc.</p>
                
                <p>Gracias por tu confianza, quedo a tu entera disposición y recibe un cordial saludo!!</p>
                
                <p>Pedro Jiménez</p>
            `
        }

        transporter.sendMail(mailOptions, (err, info)=>{
            if(err) {
                console.log(err);
            } else {
                console.log('Éxito total' + info.response);
                res.status(200).json({
                    mensaje: 'Alumno creado y correo enviado'
                })
            }
        })

        // res.status(200).json({
        //     mensaje: 'Alumno creado correctamente'
        // });
    })
})

app.put('/:id', (req, res)=>{
    let body = req.body;

    Alumno.findById(req.params.id, (err, alumno)=>{
        if(err) {
            return res.status(500).json({
                error: err
            })
        }
        if(alumno === null) {
            return res.status(200).json({
                alumno: null,
                mensaje: 'El alumno ya no existe'
            })
        }
        alumno.nombre = body.nombre;
        alumno.termino = (body.nombre).normalize('NFD').replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1").normalize().toLowerCase();
        alumno.email = body.email;
        alumno.curso = body.curso;

        alumno.save((err, alumnoMod)=>{
            if(err) {
                res.status(500).json({
                    error: err
                })
            }
            res.status(200).json({
                mensaje: 'El alumno ' + alumnoMod.nombre + ' fue modificado.'
            })
        })
    })

})

app.delete('/:id', (req, res)=>{
    Alumno.findByIdAndRemove(req.params.id, (err, data)=>{
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            mensaje: 'Alumno eliminado correctamente'
        })
    })
})

module.exports = app;