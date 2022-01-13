const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const router = require('./router');

var imgFuncs = require('./imgFunctions');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/upload', router);

app.listen(port, () => console.log(`Listennig on  port ${port}`));

app.get('/api/test', (req, res) => {
    console.log('fon');
    res.send('test');
});

app.post('/api/img', (req, res) => {

    var funcs = {
        "otsusThreshold": imgFuncs.otsusThreshold,
        "grayscale": imgFuncs.grayscale,
        "binarization": imgFuncs.binarization
    };

    var func = req.body.func;
    var img = req.body.img;


    console.log(img);
    console.log(funcs[func](img));
    console.log(img);
    res.send('pronto');
});