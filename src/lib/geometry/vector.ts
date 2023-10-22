import { vec4, vec3 } from "gl-matrix";
import { Tuple } from "./tuple";
import { Point } from "./point";

export class Vector extends Tuple {

	protected constructor(vec: vec4) {
		if (vec[3] !== 0) throw new Error("Vector must have w entry set to 0");
		super(vec);
	}

	static fromXYZ(x: number, y: number, z: number) {
		return new Vector(vec4.fromValues(x, y, z, 0));
	}

	static makeVector(vec: vec4): Vector {
		vec[3] = 0;
		return new Vector(vec);
	}

	addVector(other: Vector): Vector {
		const result = super.add(other)
		return Vector.makeVector(result.moveTup());
	}

	addPoint(other: Point): Point {
		const result = super.add(other)
		return Point.makePoint(result.moveTup());
	}

	subVector(other: Vector): Vector {
		const result = super.subtract(other);
		return Vector.makeVector(result.moveTup());
	}


	scalarDivide(scalar: number): Vector {
		const result = super.scalarDivide(scalar);
		return Vector.makeVector(result.moveTup());
	}

	scalarMultiply(scalar: number): Vector {
		const result = super.scalarMultiply(scalar);
		return Vector.makeVector(result.moveTup());
	}

	negate(): Vector {
		const result = super.negate();
		return Vector.makeVector(result.moveTup());
	}

	magnitude(): number {
		return vec4.length(this.tup);
	}

	normalize(): Vector {
		const result = super.normalize();
		return Vector.makeVector(result.moveTup());
	}
	
	dot(other: Vector): number {
		return vec4.dot(this.tup, other.tup);	
	}

	cross(other: Vector): Vector {
		const out = vec4.create();
		vec3.cross(out as vec3, this.tup as vec3, other.tup as vec3);
		return Vector.makeVector(out);
	}

	static isVector(other: Tuple) {
		return other.w === 0;
	}

	static zero() {
		return Vector.makeVector(vec4.create());
	}

}
