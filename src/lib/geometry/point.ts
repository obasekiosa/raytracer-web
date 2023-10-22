import { vec4 } from "gl-matrix";
import { Tuple } from "./tuple";
import { Vector } from "./vector";

export class Point extends Tuple {

	protected constructor(vec: vec4) {
		if (vec[3] !== 1.0) throw new Error("Point must have w entry set to 1");
		super(vec);
	}

	static fromXYZ(x: number, y: number, z: number) {
		return new Point(vec4.fromValues(x, y, z, 1));
	}

	addVector(other: Vector): Point {
		const result = super.add(other)
		return Point.makePoint(result.moveTup());
	}

	subPoint(other: Point): Vector {
		const result = super.subtract(other);
		return Vector.makeVector(result.moveTup());
	}

	subVector(other: Vector): Point {
		const result = super.subtract(other);
		return Point.makePoint(result.moveTup());
	}

	negate(): Point {
		const result = super.negate();
		return Point.makePoint(result.moveTup());
	}

	scalarDivide(scalar: number): Point {
		const result = super.scalarDivide(scalar);
		return Point.makePoint(result.moveTup());
	}

	scalarMultiply(scalar: number): Point {
		const result = super.scalarMultiply(scalar);
		return Point.makePoint(result.moveTup());
	}

	toString(): string {
		return super.toString();
	}

	static isPoint(other: Tuple) {
		return other.w === 1.0;
	}

	static makePoint(vec: vec4) {
		vec[3] = 1.0;
		return new Point(vec);
	}

	static zero(): Point {
		return Point.makePoint(vec4.create());
	}
	
}
