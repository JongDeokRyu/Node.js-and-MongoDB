const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


const MongoClient = require('mongodb').MongoClient


var db;
MongoClient.connect('mongodb+srv://admin:dkdkeld159@cluster0.ukzyigk.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (에러, client) {
    if (에러) return console.log(에러)
    db = client.db('todoapp');



    app.listen(8080, function () {
        console.log('listening on 8080')
    });
});

app.listen(8080, function () {
    console.log('listening on 8080')
})

app.get('/pet', function (요청, 응답) {
    응답.send('펫용품 사시오')
})

app.get('/', function (요청, 응답) {
    응답.sendFile(__dirname + '/index.html')
})

app.get('/write', function (요청, 응답) {
    응답.sendFile(__dirname + '/write.html')
})

app.post('/add', function (요청, 응답) {
    응답.send('전송완료')
    console.log(요청.body);
})