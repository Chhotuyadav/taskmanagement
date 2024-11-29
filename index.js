const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config({ path: "./.env" });

const app = express();

const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:4000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true,
};
// app.use(logger);

app.use((req, res, next) => {
  corsOptions.origin(req.headers.origin, (err, success) => {
    if (err) {
      res.status(403).send("CORS error: not allowed by CORS");
    } else {
      res.header("Access-Control-Allow-Origin", req.headers.origin);
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    }
  });
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
});



app.get("/", (req, res) => {
  res.send("Hello, Man! Welcome to Task managment system");
});

const userRouter = require("./Router/Route")();
app.use(userRouter);

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
