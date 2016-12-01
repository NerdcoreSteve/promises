var express = require('express')  
var app = express()  
app.use(express.static('public'))  
app.set('view engine', 'pug')

app.get('/', function (req, res) {  
    res.render('index')
})

app.get('/ajax', function (req, res) {  
    res.json({
        message: 'This comes from an AJAX call!'
    })
})

app.listen(3000, function () {  
    console.log('Example app listening on port 3000!')
})
