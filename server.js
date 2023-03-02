const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

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
    }
    db = client.db("todoapp");

    app.listen(8080, function () {
      console.log("DB 접속");
    });
  }
);

app.get("/", function (요청, 응답) {
  응답.render("index.ejs");
});

app.get("/write", function (요청, 응답) {
  응답.render("write.ejs");
});

app.get("/list", function (요청, 응답) {
  db.collection("post")
    .find()
    .toArray(function (에러, 결과) {
      console.log(결과);
      응답.render("list.ejs", { posts: 결과 });
    });
});

app.get("/detail/:id", function (요청, 응답) {
  요청.params.id = parseInt(요청.params.id);
  db.collection("post").findOne({ _id: 요청.params.id }, function (에러, 결과) {
    console.log(결과);
    응답.render("detail.ejs", { data: 결과 });
  });
});

app.get("/edit/:id", function (요청, 응답) {
  요청.params.id = parseInt(요청.params.id);
  db.collection("post").findOne({ _id: 요청.params.id }, function (에러, 결과) {
    console.log(결과);
    if (결과) {
      응답.render("edit.ejs", { post: 결과 });
    }
    if (에러) {
      console.log("에러");
    }
  });
});

app.put("/edit", function (요청, 응답) {
  db.collection("post").updateOne(
    { _id: parseInt(요청.body.id) },
    { $set: { 제목: 요청.body.title, 날짜: 요청.body.date } },
    function (에러, 결과) {
      console.log(결과);
      응답.redirect("/list");
    }
  );
});

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", function (요청, 응답) {
  응답.render("login.ejs");
});

// app.get("/fail", function (요청, 응답) {
//   응답.render("fail.ejs");
// });

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/fail",
  }),
  function (요청, 응답) {
    응답.redirect("/");
  }
);

app.get("/mypage", 로그인했니, function (요청, 응답) {
  console.log(요청.user);
  응답.render("mypage.ejs", { 사용자: 요청.user });
});

function 로그인했니(요청, 응답, next) {
  if (요청.user) {
    next();
  } else {
    응답.send("로그인을 안했습니다");
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCallback: false,
    },
    function (입력한아이디, 입력한비번, done) {
      //console.log(입력한아이디, 입력한비번);
      db.collection("login").findOne(
        { id: 입력한아이디 },
        function (에러, 결과) {
          if (에러) return done(에러);

          if (!결과)
            return done(null, false, { message: "존재하지않는 아이디요" });
          if (입력한비번 == 결과.pw) {
            return done(null, 결과);
          } else {
            return done(null, false, { message: "비번틀렸어요" });
          }
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (아이디, done) {
  db.collection("login").findOne({ id: 아이디 }, function (에러, 결과) {
    done(null, 결과);
  });
});

app.get("/search", (요청, 응답) => {
  var 검색조건 = [
    {
      $search: {
        index: "titleSearch",
        text: {
          query: 요청.query.value,
          path: "제목", // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜'] , '제목'
        },
      },
    },
    // { $sort: { _id: 1 } },
    // { $limit : 10}
    { $project: { 제목: 1, _id: 0, score: { $meta: "searchScore" } } },
  ];
  console.log(요청.query.value);
  db.collection("post")
    .aggregate(검색조건)
    .toArray((에러, 결과) => {
      응답.render("search.ejs", { posts: 결과 });
    });
});

app.post("/register", (요청, 응답) => {
  console.log("*** 요청 *** ---> ", 요청.body);
  db.collection("login").insertOne(
    { id: 요청.body.id, pw: 요청.body.pw },
    (에러, 결과) => {
      응답.redirect("/");
    }
  );
});

app.post("/add", function (요청, 응답) {
  응답.send("전송완료");
  console.log("*** 요청 *** ---> ", 요청);
  db.collection("counter").findOne(
    { name: "게시물갯수" },
    function (에러, 결과) {
      console.log("게시물 갯수 결과", 결과.totalPost);
      var 총개시물갯수 = 결과.totalPost;

      var 저장할거 = {
        _id: 총개시물갯수 + 1,
        제목: 요청.body.title,
        날짜: 요청.body.date,
        작성자: 요청.user._id,
      };

      db.collection("post").insertOne(저장할거, function () {
        console.log("저장완료");
        db.collection("counter").updateOne(
          { name: "게시물갯수" },
          { $inc: { totalPost: 1 } },
          function (에러, 결과) {}
        );
        if (에러) {
          return console.log(에러);
        }
      });
    }
  );
});

app.delete("/delete", function (요청, 응답) {
  console.log(요청.body);
  요청.body._id = parseInt(요청.body._id);

  var 삭제할데이터 = { _id: 요청.body._id, 작성자: 요청.user._id };

  db.collection("post").deleteOne(삭제할데이터, function (에러, 결과) {
    console.log("삭제완료");
    응답.status(200).send({ message: "status 200 성공했습니다." });
    if (결과) {
      console.log("결과는 ? ");
      console.log(결과);
    }
    if (에러) console.log("*** 에러 *** ---> ", 에러);
  });
});

app.use("/shop", require("./routes/shop.js"));

app.use("/board/sub", require("./routes/board.js"));
