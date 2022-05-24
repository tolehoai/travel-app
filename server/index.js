require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);

const bodyParser = require("body-parser");
const couchbase = require("couchbase");
const connectDatabase = async () => {
  /*var clusterVal;
  await couchbase
    .connect("couchbase://localhost", {
      //process.env.CLUSTER, process.env.CLUSTER_PASSWORD dùng để lấy biến CLUSTER, CLUSTER_PASSWORD trong file .env
      username: process.env.CLUSTER,
      password: process.env.CLUSTER_PASSWORD,
    })
    .then((cluster) => {
      app.locals.couchbase = couchbase;
      clusterVal = cluster;
      app.locals.cluster = cluster;
      app.locals.travel = cluster.bucket("travel-sample");
    });
  return clusterVal;*/
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Config cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Route
const records = require("./routers/records");

app.use("/records", records);

app.get("/", (req, res) => {
  res.send("a");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Server listen
server.listen(process.env.PORT, () => {
  //process.env.PORT dùng để lấy biến PORT trong file .env
  console.log(`Server Listening on http://localhost:${process.env.PORT} `);
});
connectDatabase().then((cluster) => {
  // module.exports = {app}
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  require("./socket")(io, cluster);
});
