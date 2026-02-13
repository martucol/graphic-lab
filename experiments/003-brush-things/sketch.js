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

// Stored shape data — only regenerated on click
let shapes = [];
let shapeSpeed = 10; // how fast shapes move per frame


function setup() {
  width = windowWidth - 32;
  height = windowHeight - 100;
  cs = min(width, height);
  createCanvas(width, height, WEBGL);
  brush.load();
  rectMode(CENTER)
	angleMode(DEGREES);

  brush.field("zigzag") // "waves" "curved" "seabed" "zigzag" "truncated"
  // brush.field("waves")
  frameRate(24)
  generateShapes();
}


function draw() {
  translate(-width/2,-height/2)
  background("blue");
  // let available_brushes = ['pen', 'rotring', '2B', 'HB', '2H', 'cpencil', 'charcoal', 'hatch_brush', 'spray', 'marker', 'marker2']
  let selected_brush = "rotring"
  brush.set(selected_brush, "white", 4)
  drawShapes()

  // brush.flowLine(random(width), random(height), random(20,300), random(0,360))
}

function mousePressed() {
  generateShapes();
}

function generateShapes() {
  shapes = [];
  for (let i = 0; i < 10; i++) {
    let nums = int(random(5, 20));
    let x = random(width);
    let y = random(height);
    let r = random(cs * 0.025, cs * 0.083);
    let curveVal = random(10, 27);

    // Pre-compute all vertices for this shape
    let pts = [];
    for (let a = 0; a < 360; a += 360 / nums) {
      let radius = r * random(0.5, 1.1);
      let cx = radius * cos(a);
      let cy = radius * sin(a);
      let angle = atan2(cy, cx) + random(-15, 15);
      let pos = createVector(cx, cy);
      let ankerLength = (r / nums) * curveVal;
      let anchor1 = p5.Vector.fromAngle(radians(angle - 90), ankerLength);
      let anchor2 = p5.Vector.fromAngle(radians(angle + 90), ankerLength);
      let ankerP1 = p5.Vector.add(pos, anchor1);
      let ankerP2 = p5.Vector.add(pos, anchor2);
      pts.push({ pos, ankerP1, ankerP2 });
    }

    // Random starting direction (use 360 since angleMode is DEGREES)
    let dir = random(360);
    let vx = cos(dir) * shapeSpeed;
    let vy = sin(dir) * shapeSpeed;
    shapes.push({ x, y, vx, vy, pts });
  }
}

function drawShapes() {
  for (let s of shapes) {
    drawShape(s);
  }
}

function drawShape(s) {
  // Move
  s.x += s.vx;
  s.y += s.vy;

  // Bounce off canvas edges
  if (s.x <= 0 || s.x >= width) s.vx *= -1;
  if (s.y <= 0 || s.y >= height) s.vy *= -1;
  s.x = constrain(s.x, 0, width);
  s.y = constrain(s.y, 0, height);

  push();
  translate(s.x, s.y);
  brush.beginShape(0.1);
  for (let i = 0; i < s.pts.length; i++) {
    let pt = s.pts[i];
    brush.vertex(pt.pos.x, pt.pos.y);
  }
  brush.endShape(CLOSE);
  pop();
}
