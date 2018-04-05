const express = require('express')
const app = express()

app.use(express.static('public'))
//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile('index.html');
})

app.listen(8080, function () {
    console.log('Public iohome at port 8080')
})