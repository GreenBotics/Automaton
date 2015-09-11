import {h} from '@cycle/dom'

//minimalistic : based on https://sites.google.com/site/progyumming/javascript/shortest-webgl

  function shaderProgram(gl, vs, fs) {
    var prog = gl.createProgram();
    var addshader = function(type, source) {
      var s = gl.createShader((type == 'vertex') ?
        gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw "Could not compile "+type+
          " shader:\n\n"+gl.getShaderInfoLog(s);
      }
      gl.attachShader(prog, s);
    };
    addshader('vertex', vs);
    addshader('fragment', fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw "Could not link the shader program!";
    }
    return prog;
  }

function attributeSetFloats(gl, prog, attr_name, rsize, arr) {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr),
    gl.STATIC_DRAW);
  var attr = gl.getAttribLocation(prog, attr_name);
  gl.enableVertexAttribArray(attr);
  gl.vertexAttribPointer(attr, rsize, gl.FLOAT, false, 0, 0);
}

function getContext(elem){
    try {
      var gl = elem
        .getContext("experimental-webgl");
      if (!gl) { throw new Error("Failed to initialize WebGL context") }
    } catch (err) {
      throw new Error("Your web browser does not support WebGL!")
    }

    return gl
}

  function draw(gl, data=[[0]]) {

    let input = data[0][0]

    gl.clearColor(1.0, 1.0, input, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    var prog = shaderProgram(gl,
      "attribute vec3 pos;"+
      "void main() {"+
      " gl_Position = vec4(pos, 2.0);"+
      "}",
      "void main() {"+
      " gl_FragColor = vec4(0., 0., 1.0, 1.0);"+
      "}"
    )
    gl.useProgram(prog)

    attributeSetFloats(gl, prog, "pos", 3, [
      -1, 0, 0,
      0, 1, 0,
      0, -1, 0,
      1, 0, 0
    ])
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }


////////////Actual widget
function GlWidget(data) {
    this.type = 'Widget'
    this.data = data
}

GlWidget.prototype.init = function () {
  console.log("GlWidget init")
  let elem = document.createElement('canvas')
  this.gl = getContext(elem)
  return elem
}

GlWidget.prototype.update = function (prev, elem) {
  this.gl = this.gl || prev.gl
  let {gl,data} = this
  draw(gl,data)
}

function foo(data){
   return h('div', [
      h('label', 'Name:'),
      h('input.field', {attributes: {type: 'text'}}),
      h('h1', 'Hello '),
      h('div', [
        new GlWidget(data)
      ])
    ])
}

export {GlWidget,foo}
