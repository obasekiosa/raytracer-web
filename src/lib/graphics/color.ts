import { vec4 } from "gl-matrix";
import { Tuple } from "../geometry";

export class Color extends Tuple {
	
	static fromRGB(r: number, g: number, b: number): Color {
		return new Color(vec4.fromValues(r, g, b, 1));
	}

	get r(): number {
		return this.tup[0];
	}

	get g(): number {
		return this.tup[1];
	}

	get b(): number {
		return this.tup[2];
	}

	get a(): number {
		return this.tup[3];
	}

	add(other: Color): Color {
		const result = super.add(other);
		return Color.makeColor(result.moveTup());
	}

	multiply(other: Color): Color {
		const out = vec4.create();
		vec4.mul(out, this.tup, other.tup);
		return Color.makeColor(out);
	}

	clone(): Color {
		return new Color(vec4.clone(this.tup));
	}

	static makeColor(vec: vec4): Color {
		vec[3] = 1;
		return new Color(vec);
	}
}