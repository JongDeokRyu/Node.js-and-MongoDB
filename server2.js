const express = require("express");
const app = express();

// app.listen(8080, function () {
//   console.log("listening on 8080 zzz");
// });

const MongoClient = require("mongodb").MongoClient;
var db;

MongoClient.connect(
  // "mongodb+srv://admin:dkdkeld159@cluster0.ukzyigk.mongodb.net/?retryWrites=true&w=majority",
  // 공용와이파이를 사용할 때에는 Database 버전을 낮춘다.
  "mongodb://admin:dkdkeld159@ac-un4wy4t-shard-00-00.ukzyigk.mongodb.net:27017,ac-un4wy4t-shard-00-01.ukzyigk.mongodb.net:27017,ac-un4wy4t-shard-00-02.ukzyigk.mongodb.net:27017/?ssl=true&replicaSet=atlas-zlt20r-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useUnifiedTopology: true },
  function (에러, client) {
    if (에러) return console.log(에러);
    db = client.db("todoapp");

    db.collection("post").insertOne(
      { 이름: "John", _id: 100 },
      function (에러, 결과) {
        console.log("저장완료");
      }
    );

    //서버띄우는 코드 여기로 옮기기
    app.listen("8080", function () {
      console.log("listening on 8080");
    });
  }
);
