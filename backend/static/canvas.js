import { setBlock } from "./socket.js";

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

var pixels = {};
var loadedImages = {};
var selectedBlock = "diamond_ore";

var canvasSize = [30, 30];

trackTransforms(ctx);
var lastX = canvas.width / 2;
var lastY = canvas.height / 2;

var transparentImage = null;

function loadImage(image) {
  var img = new Image();
  img.src = "/static/textures/" + image + ".webp";
  img.onload = function () {
    loadedImages[image] = img;
    redraw();
  };
}

function redraw() {
  // Clear the entire canvas
  var p1 = ctx.transformedPoint(0, 0);
  var p2 = ctx.transformedPoint(canvas.width, canvas.height);

  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;

  ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

  ctx.save();

  ctx.fillStyle = "rgb(255,255,255)";
  ctx.fillRect(0, 0, 48 * canvasSize[0], 48 * canvasSize[1]);

  for (let p in pixels) {
    var pixel = pixels[p];
    var x = pixel.x;
    var y = pixel.y;
    if (loadedImages[pixel.block]) {
      ctx.drawImage(loadedImages[pixel.block], x * 48, y * 48);
    } else {
      loadImage(pixel.block);
    }
  }

  if (transparentImage) {
    const originalAlpha = ctx.globalAlpha;
    ctx.globalAlpha = 0.5;
    if (loadedImages[transparentImage.image]) {
      ctx.drawImage(
        loadedImages[transparentImage.image],
        transparentImage.x * 48,
        transparentImage.y * 48
      );
    } else {
      loadImage(transparentImage.image);
    }
    ctx.globalAlpha = originalAlpha;
  }
}

var dragStart, dragged;

canvas.addEventListener(
  "mousedown",
  function (evt) {
    dragStart = ctx.transformedPoint(lastX, lastY);
    dragged = false;
  },
  false
);

canvas.addEventListener(
  "mousemove",
  function (evt) {
    lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
    lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
    dragged = true;
    if (dragStart) {
      var pt = ctx.transformedPoint(lastX, lastY);
      ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
      redraw();
    }
  },
  false
);

canvas.addEventListener(
  "mouseup",
  function (evt) {
    dragStart = null;

    if (!dragged) {
      // Calculate position, prepare for pixel placement
      var x =
        (evt.offsetX || evt.pageX - canvas.offsetLeft) - ctx.getTransform().e;
      var y =
        (evt.offsetY || evt.pageY - canvas.offsetTop) - ctx.getTransform().f;
      x = Math.round(x / ctx.getTransform().a);
      y = Math.round(y / ctx.getTransform().d);

      x = Math.floor(x / 48);
      y = Math.floor(y / 48);
      console.log(x, y);
      if (y < 0 || x < 0 || x > canvasSize[0] || y > canvasSize[1]) {
        return;
      }
      setBlock(x, y, selectedBlock);

      redraw();
    }
  },
  false
);

var scaleFactor = 1.1;

var zoom = function (clicks) {
  var pt = ctx.transformedPoint(lastX, lastY);
  ctx.translate(pt.x, pt.y);
  var factor = Math.pow(scaleFactor, clicks);
  ctx.scale(factor, factor);
  ctx.translate(-pt.x, -pt.y);
  redraw();
};

var handleScroll = function (evt) {
  var delta = evt.wheelDelta
    ? evt.wheelDelta / 40
    : evt.detail
    ? -evt.detail
    : 0;
  if (delta) zoom(delta);
  return evt.preventDefault() && false;
};

canvas.addEventListener("DOMMouseScroll", handleScroll, false);
canvas.addEventListener("mousewheel", handleScroll, false);

canvas.addEventListener(
  "mousemove",
  function (evt) {
    var x =
      (evt.offsetX || evt.pageX - canvas.offsetLeft) - ctx.getTransform().e;
    var y =
      (evt.offsetY || evt.pageY - canvas.offsetTop) - ctx.getTransform().f;
    x = Math.round(x / ctx.getTransform().a);
    y = Math.round(y / ctx.getTransform().d);
    x = x - (x % 48);
    y = y - (y % 48);

    var px = x / 48;
    var py = y / 48;

    if (py < 0 || px < 0 || px > canvasSize[0] - 1 || py > canvasSize[1] - 1) {
      transparentImage = null;
    } else {
      transparentImage = { x: px, y: py, image: selectedBlock };
    }

    redraw();
  },
  false
);

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var xform = svg.createSVGMatrix();
  ctx.getTransform = function () {
    return xform;
  };

  var savedTransforms = [];
  var save = ctx.save;
  ctx.save = function () {
    savedTransforms.push(xform.translate(0, 0));
    return save.call(ctx);
  };

  var restore = ctx.restore;
  ctx.restore = function () {
    xform = savedTransforms.pop();
    return restore.call(ctx);
  };

  var scale = ctx.scale;
  ctx.scale = function (sx, sy) {
    xform = xform.scaleNonUniform(sx, sy);
    return scale.call(ctx, sx, sy);
  };

  var rotate = ctx.rotate;
  ctx.rotate = function (radians) {
    xform = xform.rotate((radians * 180) / Math.PI);
    return rotate.call(ctx, radians);
  };

  var translate = ctx.translate;
  ctx.translate = function (dx, dy) {
    xform = xform.translate(dx, dy);
    return translate.call(ctx, dx, dy);
  };

  var transform = ctx.transform;
  ctx.transform = function (a, b, c, d, e, f) {
    var m2 = svg.createSVGMatrix();
    m2.a = a;
    m2.b = b;
    m2.c = c;
    m2.d = d;
    m2.e = e;
    m2.f = f;
    xform = xform.multiply(m2);
    return transform.call(ctx, a, b, c, d, e, f);
  };

  var setTransform = ctx.setTransform;
  ctx.setTransform = function (a, b, c, d, e, f) {
    xform.a = a;
    xform.b = b;
    xform.c = c;
    xform.d = d;
    xform.e = e;
    xform.f = f;
    return setTransform.call(ctx, a, b, c, d, e, f);
  };

  var pt = svg.createSVGPoint();
  ctx.transformedPoint = function (x, y) {
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(xform.inverse());
  };
}

function setPixel(x, y, block) {
  pixels[`${x},${y}`] = {
    x: x,
    y: y,
    block: block,
  };

  redraw();
}

function setAllPixels(newpixels) {
  pixels = newpixels;

  redraw();
}

export { setPixel, setAllPixels };