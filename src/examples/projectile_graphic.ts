import { Point, Vector, Canvas, Color } from "../lib";

type Projectile = {
	position: Point,
	velocity: Vector,
};

type Environment = {
	gravity: Vector,
	wind: Vector,
};

function tick(env: Environment, proj: Projectile): Projectile {
	return {
		position: proj.position.addVector(proj.velocity),
		velocity: proj.velocity.addVector(env.gravity).addVector(env.wind)
	};
}

function withInBounds(x: number, y: number, width: number, height: number): boolean {
	return x >= 0 && x < width && y >=0 && y < height;
}

function simulation() {
	const width = 900;
	const height = 550;
	const canvas = new Canvas(width, height);
	const color = Color.fromRGB(1, 0, 0);

	let proj: Projectile = {
		position: Point.fromXYZ(0, 1, 0),
		velocity: Vector.fromXYZ(1, 1.8, 0).normalize().scalarMultiply(11.25),
	};

	const env: Environment = {
		gravity: Vector.fromXYZ(0, -0.1, 0),
		wind: Vector.fromXYZ(-0.01, 0, 0),
	};


	const x = proj.position.x;
	const y = canvas.height - proj.position.y;
	if (withInBounds(x, y, width, height)) {
		canvas.writePixel(x, y, color);
	}

	while (proj.position.y > 0) {
		proj = tick(env, proj);
		const x = Math.floor(proj.position.x);
		const y = Math.floor(canvas.height - proj.position.y);
		if (withInBounds(x, y, width, height)) {
			canvas.writePixel(x, y, color);
		}
	}
	canvas.toPPMFile("projectile");
	//process.stderr.write(canvas.toPPMStr());
}

simulation();