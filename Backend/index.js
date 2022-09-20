const http = require("http");
const express = require("express");
const { urlencoded } = require("express");
const { Server } = require("socket.io");
const Blockchain = require("./BlockChain");
const Block = require("./Block");

const app = express();
app.use(urlencoded());
app.use(express.json());

let wait = 0;

app.get("/", (req, res) => {
  if (wait == 0) {
    wait++;
    console.log(wait);
    runProcess();
  } else wait++;
  res.send("Refresh to generate a Random Block");
});

let miners = {};
let times = {};

const runProcess = () => {
  if (wait != 0) generateRandomTime();
};

//method to genereate random data for a block
const getRandomData = () => {
  return { data: 1000 * Math.random(), minedBy: "", timestamp: "" };
};

// Creating of BlockChain
let chain = new Blockchain();
console.log(chain);

let leaderRecieved = false;
let startTime;

const server = http.createServer(app);

let io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// To Generate Random Time for each block;
const generateRandomTime = () => {
  leaderRecieved = false;
  Object.keys(miners).forEach((ele) => {
    times[ele] = Math.ceil(10 * Math.random());
    io.to(ele).emit("getTime", times[ele]);
  });
  startTime = new Date().getSeconds();
};

io.on("connection", (socket) => {
  console.log(socket.id);

  // will fire on Register event of client
  socket.on("register", (name) => {
    miners[socket.id] = name;
    console.log(miners);
  });

  socket.on("timeComplete", () => {
    if (new Date().getSeconds() - startTime >= times[socket.id]) {
      if (!leaderRecieved) {
        io.to(socket.id).emit(
          "getBlock",
          new Date().getTime(),
          getRandomData(),
          chain.getPreviousBlockHash()
        );
        leaderRecieved = true;
      }
    }
  });

  socket.on("receiveBlock", (timestamp, data, previousHash, hash) => {
    if (new Block(timestamp, data, previousHash).hash == hash) {
      chain.chain.push(new Block(timestamp, data, previousHash, hash));
      console.log(JSON.stringify(chain, null, 2));
      io.to(socket.id).emit("successMine");
      if (wait != 0) {
        wait--;
      }
      runProcess();
    } else console.log("HASH REJECTED");
  });
});

server.listen(5000, () => {
  console.log("Server has started at port 5000");
});
