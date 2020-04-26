let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cors = require('cors');

let app = express();

let alumno = require('./routes/alumno');
// let email = require('./routes/email');

const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb+srv://pjimenez:Stavros1234@cluster0-gmpvs.mongodb.net/crm?retryWrites=true&w=majority', options)
            .then(()=>{
                console.log('Conexión ok database')
            })
            .catch(err=>{
                console.log(err);
            })

app.use(cors());

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({'extended':'false'}));

app.use('/alumno', alumno);
// app.use('/email', email);

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});

