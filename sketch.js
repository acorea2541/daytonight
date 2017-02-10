/*
Title: Abraham's Day to Night Video Filter
Imagined, Designed, and Programmed by: Abraham Corea Diaz
Date: 2-10-2017
Includes code from (title, author, URL):
 * cv-examples/FaceTracking, Kyle McDonald, https://github.com/kylemcdonald/cv-examples
*/

//Face Tracking Code
// https://github.com/kylemcdonald/AppropriatingNewTechnologies/wiki/Week-2
var capture;
var tracker
var w = 640,
	h = 480;
//My Code
var moveup = h; //y coordinate of blanket
var headx = w / 2; //x coordinate of cap image
var heady = -1; //y coordinate of cap image
var headw = 0; //width of cap image
var headh = 0; //height of cap image

function preload() {
	cap = loadImage("cap.png");//https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwjE3eefsPzRAhUB9GMKHb_wAgwQjRwIBw&url=https%3A%2F%2Fpixabay.com%2Fen%2Fphotos%2Fblue%2520cap%2F&bvm=bv.146094739,d.cGc&psig=AFQjCNEYglVyL3SBoK-m5QK38zRLrRwTpw&ust=1486501581545660
}

function setup() {
	//Face Tracking Code
	capture = createCapture(VIDEO);
	createCanvas(w, h);
	capture.size(w, h);
	capture.hide();

	colorMode(HSB);

	tracker = new clm.tracker();
	tracker.init(pModel);
	tracker.start(capture.elt);

}

function draw() {
	image(capture, 0, 0, w, h);
	var positions = tracker.getCurrentPosition();

	noFill();
	stroke(255);
	beginShape();
	for (var i = 0; i < positions.length; i++) {
		vertex(positions[i][0], positions[i][1]);
	}
	endShape();

	noStroke();
	for (var i = 0; i < positions.length; i++) {
		fill(map(i, 0, positions.length, 0, 360), 50, 100);
		ellipse(positions[i][0], positions[i][1], 4, 4);
		text(i, positions[i][0], positions[i][1]);
	}

	if (positions.length > 0) {
		var mouthLeft = createVector(positions[44][0], positions[44][1]);
		var mouthRight = createVector(positions[50][0], positions[50][1]);
		var smile = mouthLeft.dist(mouthRight);
		//rect(20, 20, smile * 3, 20);
	}

	loadPixels();

//My Code

	if (positions.length > 0) {//only when a face is detected
		for (var i = 0; i < positions.length; i++) {//loop through array of pixels

			var eyes = dist(positions[29][0], positions[29][1], positions[31][0], positions[31][1]);//distance between upper and lower right eyelid

			if (eyes > 15) {//eyes open wide
				for (var i = 0; i < pixels.length; i += 4) {//for color value of all pixels
					pixels[i] = pixels[i] + 110; //red
					pixels[i + 1] = pixels[i + 1] + 65; //green
					pixels[i + 2] = pixels[i + 2] + 15; //blue
					pixels[i + 3] = 215; //transparency
				}
				updatePixels();
			} else if (eyes < 11.5) {//eyes closed
				for (var i = 0; i < pixels.length; i += 4) {
					pixels[i] = pixels[i] - 70; //red
					pixels[i + 1] = pixels[i + 1] - 50; //green
					pixels[i + 2] = pixels[i + 2]; //blue
					pixels[i + 3] = 255; //transparency
				}
				updatePixels();
				blanket(moveup);//draws blanket at bottom of sreen
				if (moveup > positions[7][1] + 20) {//if blanket is farther down than chin
					moveup--;//move blanket up
				} else {
					moveup = positions[7][1] + 20;//once blanket is at chin, if chin moves below blanket, blanket will lower with chin
				}
				headw = positions[14][0] - positions[0][0];//width of cap is width of face
				headh = headw * 0.85714285714286;//height of cap proportionate to width
				hat();//draw cap
				if (heady < positions[22][1] - 190) {//if cap is higher up than forehead
					heady++;//move cap down
				} else {
					heady = positions[22][1] - 190;//once cap is at head, if head moves above cap, cap will move with head
				}
				if (headx != positions[19][0] - 25) {//if cap is not at center of head
					headx = positions[19][0] - 25;//move to center of head
				}
			}
		}
	}
}


function blanket(y) {//draw blanket
	stroke(0);
	strokeWeight(4);
	fill(95);
	rect(0, y, w, 70, 20, 20, 5, 5);//rounded white rectangle
	fill('#004465');
	rect(0, y + 70, w, h);//blue rectangle
}

function hat() {//draw cap
	image(cap, headx, heady, headw, headh);
}