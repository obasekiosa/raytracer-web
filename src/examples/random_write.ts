import { Canvas, Color } from "../lib";


function makePPM() {
	const canvas = new Canvas(5, 3);
	const c1 = Color.fromRGB(1.5, 0, 0);
	const c2 = Color.fromRGB(0, 0.5, 0);
	const c3 = Color.fromRGB(-0.5, 0, 1);

	canvas.writePixel(0, 0, c1);
	canvas.writePixel(2, 1, c2);
	canvas.writePixel(4, 2, c3);
	canvas.toPPMFile("random_write");
}

makePPM();