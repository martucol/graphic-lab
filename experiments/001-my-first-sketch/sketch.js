// use ASSETS_PATH for shared assets, e.g.:
// let img;
// function preload() {
//   img = loadImage(ASSETS_PATH + 'my-image.jpg');
// }


// https://github.com/acamposuribe/p5.brush#reference
let width = 500;
let height = 500;
let num;
let cs;
let palette = ["#EE91a5", "#7facc6", "#4e93cc", "#afd300"]


function setup() {
  width = windowWidth - 32;
  height = windowHeight - 100;
  cs = min(width, height);
  createCanvas(width, height, WEBGL);
  brush.load();
  noLoop();
  rectMode(CENTER)
	angleMode(DEGREES);

  brush.field("zigzag") // "waves" "curved" "seabed" "zigzag" "truncated"
  // brush.field("waves")
}


function draw() {
  translate(-width/2,-height/2)
  background("blue");
  // let available_brushes = ['pen', 'rotring', '2B', 'HB', '2H', 'cpencil', 'charcoal', 'hatch_brush', 'spray', 'marker', 'marker2']
  let available_brushes = ['pen', 'rotring'];
  let selected_brush = "rotring"
  // Set the stroke to a random brush, color, and weight = 1
  brush.set(selected_brush, "white", 4)
  drawShapes()

  // brush.flowLine(random(width), random(height), random(20,300), random(0,360))
}

function mousePressed() {
  redraw();
}

function drawShapes() {
  	for (let i = 0; i < 10; i++) {
		let nums = int(random(5, 20));
		let x = random(width)
		let y = random(height)
		let r = random(cs * 0.025, cs * 0.13)
		shape(x, y, r, nums, random(10, 27))
	}
}

function shape(x, y, r, nums, curveVal) {
	push();
	translate(x, y);
	let pts = [];
	for (let i = 0; i < 360; i += 360 / nums) {
		let radius = r * random(0.5, 1.1);
		let cx = radius * cos(i);
		let cy = radius * sin(i);
		let angle = atan2(cy, cx) + random(-15, 15)
		let pos = createVector(cx, cy);
		let ankerLength = (r / nums) * curveVal;
		let anchor1 = p5.Vector.fromAngle(radians(angle - 90), ankerLength);
		let anchor2 = p5.Vector.fromAngle(radians(angle + 90), ankerLength);
		let ankerP1 = p5.Vector.add(pos, anchor1);
		let ankerP2 = p5.Vector.add(pos, anchor2);
		pts.push({
			pos,
			ankerP1,
			ankerP2
		});
	}
	brush.beginShape();
	for (let i = 0; i < pts.length; i++) {
		let points = pts[i];
		let next = pts[(i + 1) % pts.length];
		brush.vertex(points.pos.x, points.pos.y);
		// bezierVertex(points.ankerP2.x, points.ankerP2.y, next.ankerP1.x, next.ankerP1.y, next.pos.x, next.pos.y);
	}
	brush.endShape(CLOSE);
	pop();
}