// 1 - retrieve a reference to the canvas
// DOM objects (search later if you wish)

var canvas = document.getElementById("canvas");

console.warn("A WARNING!");
console.error("AN ERROR!");
console.log("A LOG: ");
console.log(canvas);

// having a reference to the canvas we can manipulate however we wish
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// retrieve a context 
// context - when drawing we need a reference to an object of the API we're using
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
var gl = canvas.getContext("webgl2");

// decide the "blank" color
// clear color - the color of "nothing"

// r, g, b, a
// r - red 
// g - green
// b - blue
// a - alpha 
// [0, 1]

gl.clearColor(0.0, 1.0, 0.0, 1.0);

// clear - clean buffers from previous data
// we need to specify the buffers to clear
// constants have only one bit turned on 
// |- PIPE
// when using a single one is a bitwise operation
gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
console.log(gl);