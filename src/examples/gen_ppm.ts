import { Canvas, Color } from "../lib";


function makePPM() {
	const canvas = new Canvas(10, 2);
	const color = Color.fromRGB(1, 0.8, 0.6);
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 2; j++) {
			canvas.writePixel(i, j, color);
		}
	}

	canvas.toPPMFile("temp1");
}

makePPM();