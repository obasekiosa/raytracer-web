import { Point, Vector } from "../lib";

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


function simulation() {

	let proj: Projectile = {
		position: Point.fromXYZ(0, 1, 0),
		velocity: Vector.fromXYZ(1, 1, 0).normalize(),
	};

	const env: Environment = {
		gravity: Vector.fromXYZ(0, -0.1, 0),
		wind: Vector.fromXYZ(-0.01, 0, 0),
	};

	console.log(proj);

	while (proj.position.y > 0) {
		proj = tick(env, proj);
		console.log(proj);
	}
}

simulation();