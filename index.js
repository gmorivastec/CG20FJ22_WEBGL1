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

// writing 2 shaders 
// - vertex shader 
// - fragment shader 

// To write the shaders we're going to use a language 
// called GLSL - gl shading language
// HLSL - Direct3D (DirectX)
// CG - we're going to use this one in Unity

// shaders on OpenGL are interpreted
// on Vulkan shaders are compiled 

// version of the OpenGL ES API level we're using 
// precision can be - lowp, mediump, highp
// in - variable that will be received from the outside 

// how many times do you think this guy runs?
// once per vertex 
var vertexShader = `#version 300 es
precision mediump float; 
in vec2 pos; 
void main() {
    // a comment in GLSL
    // hi!
    // objective of a vertexShader - set gl_Position
    gl_Position = vec4(pos.x, pos.y, 0.0, 1.0); // vec4 - 4 values that represent location
    gl_PointSize = 5.0;
}`;

// how many times does this guy runs?
// once per fragment
var fragmentShader = `#version 300 es
precision mediump float;
out vec4 col;
void main() {
    col = vec4(1.0, 0.0, 0.0, 1.0); // 4 values that are colors - r, g, b, a
}`;

// we still have a bunch to do - once everything here is done we can reuse
// we need to actually transform source code into program (shaders)

var vs = gl.createShader(gl.VERTEX_SHADER);
var fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(vs, vertexShader);
gl.shaderSource(fs, fragmentShader);
gl.compileShader(vs);
gl.compileShader(fs);

// after the compilation check for errors
if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
    console.error(gl.getShaderInfoLog(vs));
}

if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
    console.error(gl.getShaderInfoLog(fs));
}

// create a program to attach our shaders to
var program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program); // you, context, are going to be using that set of shaders

if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error(gl.getProgramInfoLog(program));
}

// buffer creation 
// buffer - space in memory in which we store useful information for the render process

// we now load data into buffer
// use buffer as a source for vertices 
// allocates memory on GPU 
var buffer = gl.createBuffer();

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer
// bind buffer with channel 
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

// put some info on the buffer itself
// that something are the vertices to be drawn
// declare an array of values for your vertices
// current screen space goes from [-1, 1] in both x and y 
var triangleCoords = [-1.0, -1.0, 0.0, 1.0, 1.0, -1.0];

// use channel to send data 
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleCoords), gl.STATIC_DRAW);

// close channel - deallocate, empty the memory used
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// link GPU var with CPU 
gl.useProgram(program);

// retrieve a reference to the parameter within the shaders
var position = gl.getAttribLocation(program, 'pos');

// enable data reception for parameter
gl.enableVertexAttribArray(position); 

// bind buffer again to send data
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
// this is where the magic happens
// 1 - variable to which we are sending data
// 2 - how many dimensions are we using to describe the position within the vertices
// 3 - data type of the values being sent
// 4 - normalized or not
// 5 - stride and offset - check them later
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

// actually draw the triangle 
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
gl.drawArrays(gl.TRIANGLES, 0, 3);