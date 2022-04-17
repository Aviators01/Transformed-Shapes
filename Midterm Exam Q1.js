/*
Timothy Queva
CS3110 Midterm Exam
Nov. 4, 2020
*/

//This is for midterm question 1

var VSHADER_SOURCE =
	'attribute vec4 a_position;\n' +
	'attribute mat4 rotMatrix;\n' +
	'uniform mat4 u_modelMatrix;\n' +
	'void main(){ \n' +
	'	gl_Position = u_modelMatrix * a_position;\n' +
	'}\n';

var FSHADER_SOURCE =
	'precision mediump float;\n' +
	'uniform vec4 u_FragColor;\n' +
	'void main(){ \n' +
	'	gl_FragColor = u_FragColor;\n' +
	'}\n';

function main(){
	//Gets the canvas
	var canvas = document.getElementById('Midterm');
	
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
	var u_modelMatrix = gl.getUniformLocation(gl.program,'u_modelMatrix');

	//Clears the canvas. ie. cleans the drawing area.
	gl.clearColor(0.0,0.0,0.0,0.5);	//This specifies the color
	gl.clear(gl.COLOR_BUFFER_BIT);	//This actually cleans the canvas with the specified color
	
	var modelMat = new Matrix4();
	modelMat.setIdentity();
	
	house(gl,a_position,u_fragcolour,modelMat,u_modelMatrix);
}

function house(gl,position,colour,modelMat,u_modelMatrix){
	//1. Create the buffer object
	var vertexBuffer = gl.createBuffer();
	
	//2. Bind the buffer object to a target
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	
	//3. Write data to the buffer object
	var vertices = new Float32Array([
		0.0,0.6,	-0.15,0.5,	-0.08,0.5,
		-0.08,0.3,	0.08,0.3,	0.08,0.5,
		0.15,0.5,	-0.15,0.5,	0.15,0.5
		
	]);
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	
	//Assigning a colour to this shape
	gl.uniform4f(colour,0.0,0.0,0.0,0.7);
	
	//4. Assign the buffer object to an attribute variable
	gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
	
	//5. Enable the assignment
	gl.enableVertexAttribArray(position);
	
	//Transfers model matrix to WebGL system
	gl.uniformMatrix4fv(u_modelMatrix,false,modelMat.elements);
	
	//clear canvas in order for rotated shape to be drawn without previous images
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	//Draws the lines for the "Z"
	gl.drawArrays(gl.LINE_LOOP,0,9);
	
	
	/*****
		Shape rotation/transformation begins here
	******/
	//Assigning a colour to this shape
	gl.uniform4f(colour,0.0,0.0,0.0,1);
	
	//Sets model matrix for rotating and transfers to WebGL system
	modelMat.translate(1,0,0);
	modelMat.rotate(90,0,0,1);
	gl.uniformMatrix4fv(u_modelMatrix,false,modelMat.elements);
	
	gl.drawArrays(gl.LINE_LOOP,0,9);
}