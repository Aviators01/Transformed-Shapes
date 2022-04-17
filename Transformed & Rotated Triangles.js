/* 
Timothy Queva
CS3110 Lab4
October 21, 2020
*/

var VSHADER_SOURCE =
	'attribute vec4 a_position;\n' +
	'uniform mat4 u_xformMatrix;\n' +
	'void main(){ \n' +
	'	gl_Position = u_xformMatrix * a_position;\n' +
	'}\n';

var FSHADER_SOURCE =
	'precision mediump float;\n' +
	'uniform vec4 u_FragColor;\n' +
	'void main(){ \n' +
	'	gl_FragColor = u_FragColor;\n' +
	'}\n';

function main(){
	//Gets the canvas
	var canvas = document.getElementById('Lab4');
	
	//Gets the WebGL rendering context in order for us to use the webgl system
	var gl = getWebGLContext(canvas);
	
	//This initializes the shaders. Parameters are (rendering context,vshader,fshader)
	var stat;
	stat = initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
	if(!stat) console.log("Shaders failed to initialize");
	
	//This code section gets the memory location of the WebGL variables we specified earlier(a_position,u_FragColor)
	//Parameters are (program,name)
	var u_fragcolour = gl.getUniformLocation(gl.program,'u_FragColor');
	var a_position = gl.getAttribLocation(gl.program,'a_position');
	var u_xformMatrix =gl.getUniformLocation(gl.program,'u_xformMatrix');
	
	//Clears the canvas. ie. cleans the drawing area.
	gl.clearColor(0.0,0.0,0.0,0.5);	//This specifies the color
	gl.clear(gl.COLOR_BUFFER_BIT);	//This actually cleans the canvas with the specified color
	
	
	var identMatrix = new Float32Array([
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0
	]);
	gl.uniformMatrix4fv(u_xformMatrix,false,identMatrix);
	
	//Assigning a colour to this shape
	gl.uniform4f(u_fragcolour,1.0,0.0,0.0,0.7);
	Triangle(gl,a_position);
	
	
	
	var angle = -30;
	var radian = angle * (Math.PI/180);
	var cosB = Math.cos(radian);
	var sinB = Math.sin(radian);
	
	var xformMatrix = new Float32Array([
		cosB, sinB, 0.0, 0.0,
	   -sinB, cosB, 0.0, 0.0,
		0.0,  0.0, 1.0, 0.0,
		0.0,  0.0, 0.0, 1.0
	]);
	
	var Sx=-1;
	var Sy=1;
	var Sz=1;
	
	//this array is the transformation matrix times the rotation matrix in the order: rotation*transformation matrix.
	//The end result is rotation*transformation*original matrix = transformed matrix that is then rotated.
	var transMatrix = new Float32Array([
		cosB*Sx,sinB*Sy,0.0,0.0,
		(-sinB)*Sx,cosB*Sy,0.0,0.0,
		0.0,0.0,Sz,0.0,
		0.0,0.0,0.0,1.0
	]);
	gl.uniformMatrix4fv(u_xformMatrix,false,transMatrix);
	
	//Assigning a colour to this shape
	gl.uniform4f(u_fragcolour,1.0,0.0,0.0,1.0);
	Triangle(gl,a_position);
}

//Draws a triangle
function Triangle(gl,position){
	//1. Create the buffer object
	var vertexBuffer = gl.createBuffer();
	
	//2. Bind the buffer object to a target
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	
	//3. Write data to the buffer object
	var vertices = new Float32Array([
		-0.4,0.2,	-0.5,-0.1,	-0.3,-0.1
	]);
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	
	//4. Assign the buffer object to an attribute variable
	gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
	
	//5. Enable the assignment
	gl.enableVertexAttribArray(position);
	
	//Draws the lines for the "Z"
	gl.drawArrays(gl.TRIANGLES,0,3);
	
	return vertices;
}