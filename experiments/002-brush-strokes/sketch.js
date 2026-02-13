// use ASSETS_PATH for shared assets, e.g.:
// let img;
// function preload() {
//   img = loadImage(ASSETS_PATH + 'my-image.jpg');
// }


// https://github.com/acamposuribe/p5.brush#reference
let width = 500;
let height = 500;

let palette = ["#EE91a5", "#7facc6", "#4e93cc", "#afd300"]


function setup() {
  width = windowWidth - 32;
  height = windowHeight - 100;
  createCanvas(width, height, WEBGL);
  brush.load();
  background(251, 251, 250);
  frameRate(5);
  brush.field("zigzag") // "waves" "curved" "seabed" "zigzag" "truncated"
  // brush.field("waves")

}

function draw() {
    translate(-width/2,-height/2)
        let available_brushes = brush.box();

    // Set the stroke to a random brush, color, and weight = 1
    brush.set(random(available_brushes), random(palette), 2)

    brush.flowLine(random(width), random(height), random(20,300), random(0,360))
}
