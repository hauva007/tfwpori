let express = require('express');
let app = new express();
let parser = require('body-parser');

app.get('/', function(req, res) {
    res.render('./../app/index.ejs');
})
app.use(express.static(__dirname + '/../.tmp'))
app.listen(7777);

app.use(parser.json());

app.use(parser.urlencoded( { extended: false }));