const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 3002;

io.on("connection", (socket) => {
  console.log(socket.id, "connection");

  socket.on("join_room", (data) => {
    console.log("join event", data)
    socket.broadcast.emit("joined")
  });

  socket.on("offer", (offer) => {
    console.log("offer event", offer)
    io.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    console.log("answer event", answer)
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice", (ice) => {
    console.log("ice event", ice)
    socket.broadcast.emit("ice", ice);
  });

  // here line 관련

  socket.on("linesCustomer", (mapLines) => {
    console.log("linesCustomer  arrived", mapLines)
    console.log("mapLine.line", mapLines.lines)

    const linesCustomer = []
    mapLines.lines.forEach( (line) => {
      const newLine = []
      line.forEach( (point) => {
        newLine.push(point)
      })
      linesCustomer.push(newLine)
    })

    console.log("made new customer Lines", linesCustomer);
    io.emit("linesCustomer", linesCustomer)
  })

  socket.on("linesCSR", (mapLines) => {
    console.log("linesCSR  arrived", mapLines)

    console.log("made new CSR Lines", mapLines);
    const strLines = JSON.stringify(mapLines);
    io.emit("linesCSR", strLines);
  })

  // socket.on("add_csr_line", (newLine) => {
  //   console.log("add csr line", newLine)
  //   linesCSR.push(newLine)
  //   io.emit("linesCSR", linesCSR)
  // })

  // socket.on("add_customer_line", (mapLine) => {
  //   console.log("add customer line")
  //   //console.log("mapLine.line", mapLine.line)
  //   const newLine = []
  //   mapLine.line.forEach( (point) =>
  //     newLine.push(point)
  //   )
  //   linesCustomer.push(newLine)
  //   //console.log("made new Line and push", newLine);
  //   io.emit("linesCustomer", linesCustomer)
  // })

  // socket.on("remove_prev_csr_line", () => {
  //   console.log("remove csr line prev")
  //   if(linesCSR.length > 0) linesCSR.pop()
  //   io.emit("linesCSR", linesCSR)
  // })

  // socket.on("remove_all_csr_line", () => {
  //   console.log("remove csr line")
  //   if(linesCSR.length > 0) linesCSR.length = 0
  //   io.emit("linesCSR", linesCSR)
  // })


  // socket.on("remove_prev_customer_line", () => {
  //   console.log("remove customer line prev")
  //   if(linesCustomer.length > 0) linesCustomer.pop()
  //   io.emit("linesCustomer", linesCustomer)
  // })

  // socket.on("remove_all_customer_line", () => {
  //   console.log("remove customer line")
  //   if(linesCustomer.length > 0) linesCustomer.length = 0
  //   io.emit("linesCustomer", linesCustomer)
  // })
  // line 관련 끝

  socket.on("disconnect", () => {
    console.log(socket.id, "disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});