import {vec4} from "gl-matrix"

export class Tuple {
	
	protected readonly tup: vec4; 

	protected constructor(vec: vec4) {
		this.tup = vec;
	}
 

	static fromXYZW(x: number, y: number, z: number, w: number) {
		return new Tuple(vec4.fromValues(x, y, z, w)); 
	}

	static makeTuple(vec: vec4): Tuple {
		return new Tuple(vec);
	}
		
	
	moveTup(): vec4 {
		return this.tup;
	}

	subtract(other: Tuple): Tuple {
		let out: vec4 = vec4.create();
		vec4.sub(out, this.tup, other.tup);
		return new Tuple(out);
	}

	add(other: Tuple): Tuple {
		let out: vec4 = vec4.create();
		vec4.add(out, this.tup, other.tup)
		return new Tuple(out);
	}
	
	negate(): Tuple {
		const out = vec4.create();
		vec4.negate(out, this.tup);
		return new Tuple(out);
	}

	scalarMultiply(scalar: number): Tuple {
		const out = vec4.create();
		console.log(this.tup);
		vec4.scale(out, this.tup, scalar);
		return new Tuple(out);
	}

	scalarDivide(scalar: number): Tuple {
		const out = vec4.create();
		vec4.scale(out, this.tup, 1 / scalar);
		return new Tuple(out);
	}

	normalize(): Tuple {
		const out = vec4.create();
		vec4.normalize(out, this.tup);
		return new Tuple(out);
	}

	magnitude(): number {
		return vec4.length(this.tup);
	}

	equals(other: Tuple): boolean {
		return vec4.exactEquals(this.tup, other.tup);
	}

	toString(): string {
		return `Tuple(${this.tup[0]}, ${this.tup[1]}, ${this.tup[2]}, ${this.tup[3]}`;
	}

	get(x: number): number {
		if (x < 0 || x > 4) throw new Error("Index out of bounds error");
		return this.tup[x];
	}

	get x(): number {
		return this.get(0);
	}

	set x(value: number) {
		this.tup[0] = value
	}

	get y(): number {
		return this.get(1);
	}

	set y(value: number) {
		this.tup[1] = value
	}

	get z(): number {
		return this.get(2);
	}

	set z(value: number) {
		this.tup[2] = value
	}

	get w(): number {
		return this.get(3);
	}

	set w(value: number) {
		this.tup[3] = value
	}

	static zero(): Tuple {
		return new Tuple(vec4.create());
	}
}
