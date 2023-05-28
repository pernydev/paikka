import { setPixel, setAllPixels } from "./canvas.js";

var socket = io();

socket.on("connect", function () {
  console.log("Connected to server");
});

function setBlock(x, y, block) {
  socket.emit("place", {
    x: x,
    y: y,
    block: block,
    token: "guest",
  });
}

socket.on("place", function (data) {
  console.log("place", data);
  setPixel(data.x, data.y, data.block);
});

socket.on("blocks", function (data) {
    console.log("blocks", data);
    var pixels = {}
    for (var i = 0; i < data.length; i++) {
        var pixel = data[i];
        pixels[pixel.x + "," + pixel.y] = pixel;
    }
    console.log(pixels);
    setAllPixels(pixels);
});


export { setBlock };

