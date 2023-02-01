const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs");

app.use("/public", express.static("public"));

var db;
MongoClient.connect(
  "mongodb+srv://admin:dkdkeld159@cluster0.ukzyigk.mongodb.net/?retryWrites=true&w=majority",
  { useUnifiedTopology: true },
  function (에러, client) {
    if (에러) return;
    {
      console.log(에러);
      console.log("에러다 !!!!!!!!!!!!!!");
    }
    db = client.db("todoapp");

    db.collection("post").insertOne(
      { 이름: "Deok", _id: 101 },
      function (에러, 결과) {
        console.log("저장완료");
      }
    );
    app.listen(8080, function () {
      console.log("listening on 8080 ㅋㅋㅋㅋㅋㅋ");
    });
  }
);

app.get("/", function (요청, 응답) {
  응답.render("index.ejs");
});

app.get("/write", function (요청, 응답) {
  응답.render("write.ejs");
});

app.post("/add", function (요청, 응답) {
  응답.send("전송완료");
  db.collection("counter").findOne(
    { name: "게시물갯수" },
    function (에러, 결과) {
      console.log("게시물 갯수 결과", 결과.totalPost);
      var 총개시물갯수 = 결과.totalPost;

      db.collection("post").insertOne(
        { _id: 총개시물갯수 + 1, 제목: 요청.body.title, 날짜: 요청.body.date },
        function () {
          console.log("저장완료");
          db.collection("counter").updateOne(
            { name: "게시물갯수" },
            { $inc: { totalPost: 1 } },
            function (에러, 결과) {}
          );
          if (에러) {
            return console.log(에러);
          }
        }
      );
    }
  );
});

app.get("/list", function (요청, 응답) {
  db.collection("post")
    .find()
    .toArray(function (에러, 결과) {
      console.log(결과);
      응답.render("list.ejs", { posts: 결과 });
    });
});

app.delete("/delete", function (요청, 응답) {
  console.log(요청.body);
  요청.body._id = parseInt(요청.body._id);
  db.collection("post").deleteOne(요청.body, function (에러, 결과) {
    console.log("삭제완료");
    응답.status(200).send({ message: "status 200 성공했습니다." });
    if (결과) {
      console.log("결과는 ? ");
      console.log(결과);
    }
  });
  // .find()
});

app.get("/detail/:id", function (요청, 응답) {
  요청.params.id = parseInt(요청.params.id);
  db.collection("post").findOne({ _id: 요청.params.id }, function (에러, 결과) {
    console.log(결과);
    응답.render("detail.ejs", { data: 결과 });
  });
});
