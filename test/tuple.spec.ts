import { toBeDeepCloseTo,toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { Tuple, Point, Vector } from "../src/lib";

expect.extend({toBeDeepCloseTo, toMatchCloseTo});

type ValueType = Tuple | Point | Vector;
type Components = [number, number, number, number];

const EPSILON = 0.00001;
const PRECISION = 5;

function compareHelper(a: ValueType, b: Components): boolean {
	return a.x === b[0] && a.y === b[1] && a.z === b[2] && a.w === b[3];
}

function extractComponents(a: ValueType): Components {
	return [a.x, a.y, a.z, a.w];
}

function vectorFn(x: number, y: number, z: number): Components {
	return [x, y, z, 0]
}

function pointFn(x: number, y: number, z: number): Components {
	return [x, y, z, 1]
}

function tupleFn(x: number, y: number, z: number, w: number): Components {
	return [x, y, z, w]
}

function correctResultAndType(result: ValueType, expected: Components, expectedType: any) {
	expect(extractComponents(result)).toStrictEqual(expected);
	expect(result).toBeInstanceOf(expectedType);
}

function closeResultAndCorrectType(result: ValueType, expected: Components, expectedType: any, precision: number) {
	expect(extractComponents(result)).toBeDeepCloseTo(expected, precision);
	expect(result).toBeInstanceOf(expectedType);
}

describe("Tuple Tests", () => {

    test("A tuple with w=1.0 is a point", () => {
        const tuple = Tuple.fromXYZW(4.3, -4.2, 3.1, 1.0);
        const isPoint = Point.isPoint(tuple);
        expect(isPoint).toBe(true);
    });

    test("A tuple with w=1.0 is not a vector", () => {
        const tuple = Tuple.fromXYZW(4.3, -4.2, 3.1, 1.0);
        const isVector = Vector.isVector(tuple);
        expect(isVector).toBe(false);
    });    

    test("A tuple with w=0.0 is not a point", () => {
        const tuple = Tuple.fromXYZW(4.3, -4.2, 3.1, 0.0);
        const isPoint = Point.isPoint(tuple);
        expect(isPoint).toBe(false);
    });

    test("A tuple with w=0.0 is a vector", () => {
        const tuple = Tuple.fromXYZW(4.3, -4.2, 3.1, 0.0);
        const isVector = Vector.isVector(tuple);
        expect(isVector).toBe(true);
    });

    test("Point sets w to 1", () => {
        const point = Point.fromXYZ(4, -4, 3);
	expect(point.w).toStrictEqual(1.0);
    });

    test("Vector sets w to 0", () => {
        const vector = Vector.fromXYZ(4, -4, 3);
	expect(vector.w).toStrictEqual(0.0);
    });
    
    test("Adding two tuples returns correct result of type tuple", () => {
        const tuple1 = Tuple.fromXYZW(3, -2, 5, 1);
        const tuple2 = Tuple.fromXYZW(-2, 3, 1, 0);
	const result = tuple1.add(tuple2);
	correctResultAndType(result, tupleFn(1,1,6,1), Tuple);
    });

    test("Subtracting two tuples returns correct result of type Tuple", () => {
        const tuple1  = Tuple.fromXYZW(3, 6, 7, 2);
        const tuple2  = Tuple.fromXYZW(5, 2, 7, -4);
	const result = tuple1.subtract(tuple2);
	correctResultAndType(result, tupleFn(-2, 4, 0, 6), Tuple);
    });

    test("Adding a point to a vector returns correct result of type Point", () => {
        const vector = Vector.fromXYZ(-2, 3, 1);
        const point  = Point.fromXYZ(3, -2, 5 );
	const result = vector.addPoint(point);
	correctResultAndType(result, pointFn(1, 1, 6), Point);
    });

    test("Adding a vector to a point returns correct result of type Point", () => {
        const point  = Point.fromXYZ(3, -2, 5 );
        const vector = Vector.fromXYZ(-2, 3, 1);
	const result = point.addVector(vector);
	correctResultAndType(result, pointFn(1, 1, 6), Point);
    });

    test("Subtracting two points returns correct result of type vector", () => {
        const point1  = Point.fromXYZ(3, 2, 1);
        const point2  = Point.fromXYZ(5, 6, 7);
	const result = point1.subPoint(point2);
	correctResultAndType(result,vectorFn(-2, -4, -6), Vector);
    });

    test("Subtracting a vector from a point returns correct result of type Point", () => {
        const point  = Point.fromXYZ(3, 2, 1);
        const vector  = Vector.fromXYZ(5, 6, 7);
	const result = point.subVector(vector);
	correctResultAndType(result, pointFn(-2, -4, -6), Point);
    });

    test("Adding two vectors returns correct result of type Vector", () => {
	const vector1 = Vector.fromXYZ(3, 2, 1);
	const vector2 = Vector.fromXYZ(5, 6, 7);
	const result = vector1.addVector(vector2);
	correctResultAndType(result, vectorFn(8, 8, 8), Vector);
    });

    test("Subtracting two vectors returns correct result of type Vector", () => {
	const vector1 = Vector.fromXYZ(3, 2, 1);
	const vector2 = Vector.fromXYZ(5, 6, 7);
	const result = vector1.subVector(vector2);
	correctResultAndType(result, vectorFn(-2, -4, -6), Vector);
    });
    
    test("Subtracting a vector from the zero vector returns a negated vector", () => {
	    const vector = Vector.fromXYZ(1, -2, 3);
	    const zeroVector = Vector.zero();
	    const result = zeroVector.subVector(vector);
	    correctResultAndType(result, vectorFn(-1, 2, -3), Vector);
    });
    
    test("Negating a tuple returns a tuple with values negated", () => {
	    const tuple = Tuple.fromXYZW(1, -2, 3, -4);
	    const result = tuple.negate();
	    correctResultAndType(result, tupleFn(-1, 2, -3, 4), Tuple);
    });

    test("Negating a vector returns a vector with values negated", () => {
	    const vector = Vector.fromXYZ(1, -2, 3);
	    const result = vector.negate();
	    correctResultAndType(result, vectorFn(-1, 2, -3), Vector);
    });

    test("Multiplying a Tuple by a scalar returns correct result of type Tuple", () => {
    	const tuple = Tuple.fromXYZW(1, -2, 3, -4);
	const scalar = 3.5
	const result = tuple.scalarMultiply(scalar);
	correctResultAndType(result, tupleFn(3.5, -7, 10.5, -14), Tuple);
    });

    test("Dividing a Tuple by a scalar returns correct result of type Tuple", () => {
    	const tuple = Tuple.fromXYZW(1, -2, 3, -4);
	const scalar = 2;
	const result = tuple.scalarDivide(scalar);
	correctResultAndType(result, tupleFn(0.5, -1, 1.5, -2), Tuple);
    });

    test("Multiplying a Point by a scalar returns correct result of type Point", () => {
    	const point = Point.fromXYZ(1, -2, 3);
	const scalar = 3.5
	const result = point.scalarMultiply(scalar);
	correctResultAndType(result, pointFn(3.5, -7, 10.5), Point);
    });

    test("Dividing a Point by a scalar returns correct result of type Point", () => {
    	const point = Point.fromXYZ(1, -2, 3);
	const scalar = 2;
	const result = point.scalarDivide(scalar);
	correctResultAndType(result, pointFn(0.5, -1, 1.5), Point);
    });

    test("Multiplying a Vector by a scalar returns correct result of type Vector", () => {
    	const vector = Vector.fromXYZ(1, -2, 3);
	const scalar = 3.5
	const result = vector.scalarMultiply(scalar);
	correctResultAndType(result, vectorFn(3.5, -7, 10.5), Vector);
    });

    test("Dividing a Vector by a scalar returns correct result of type Vector", () => {
    	const vector = Vector.fromXYZ(1, -2, 3);
	const scalar = 2;
	const result = vector.scalarDivide(scalar);
	correctResultAndType(result, vectorFn(0.5, -1, 1.5), Vector);
    });

    test("Computing the magnitude of vector (1, 0, 0)", () => {
    	const vector = Vector.fromXYZ(1, 0, 0);
	expect(vector.magnitude()).toStrictEqual(1);
    });

    test("Computing the magnitude of vector (0, 1, 0)", () => {
    	const vector = Vector.fromXYZ(0, 1, 0);
	expect(vector.magnitude()).toStrictEqual(1);
    });

    test("Computing the magnitude of vector (0, 0, 1)", () => {
    	const vector = Vector.fromXYZ(0, 0, 1);
	expect(vector.magnitude()).toStrictEqual(1);
    });

    test("Computing the magnitude of vector (1, 2, 3)", () => {
    	const vector = Vector.fromXYZ(1, 2, 3);
	expect(vector.magnitude()).toBeCloseTo(Math.sqrt(14));
    });

    test("Computing the magnitude of vector (-1, -2, -3)", () => {
    	const vector = Vector.fromXYZ(-1, -2, -3);
	expect(vector.magnitude()).toBeCloseTo(Math.sqrt(14));
    });

    test("Normalizing a Vector returns correct result of type Vector", () => {
	const vector = Vector.fromXYZ(4, 0, 0);
	const result = vector.normalize();
	closeResultAndCorrectType(result, vectorFn(1, 0, 0), Vector, PRECISION);

	const vector2 = Vector.fromXYZ(1, 2, 3);
	const result2 = vector2.normalize();
	closeResultAndCorrectType(result2, vectorFn(1 / Math.sqrt(14), 2 / Math.sqrt(14), 3 / Math.sqrt(14)), Vector, PRECISION);
    });

    test("Normalized vector has a magnitude of 1", () => {
	const vector = Vector.fromXYZ(1, 2, 3);
	const result = vector.normalize().magnitude();
    	expect(result).toBeCloseTo(1, PRECISION);
    });


    test("Normalizing a Tuple returns correct result of type Tuple", () => {
	const tuple = Tuple.fromXYZW(1, 2, 3, 4);
	const result = tuple.normalize();
	closeResultAndCorrectType(result, tupleFn(1 / Math.sqrt(30), 2 / Math.sqrt(30), 3 / Math.sqrt(30), 4 / Math.sqrt(30)), Tuple, PRECISION);
    });

    test("Normalized tuple has a magnitude of 1", () => {
	const tuple = Tuple.fromXYZW(1, 2, 3, 4);
	const result = tuple.normalize().magnitude();
    	expect(result).toBeCloseTo(1, PRECISION);
    });

    test("Dot product of two vectors returns the correct result", () => {
    	const vector1 = Vector.fromXYZ(1, 2, 3);
	const vector2 = Vector.fromXYZ(2, 3, 4);
	const result = vector1.dot(vector2);
	expect(result).toBeCloseTo(20, PRECISION);
    });
    
    test("Cross product of two vectors returns the correct result of type Vector", () => {
    	const vector1 = Vector.fromXYZ(1, 2, 3);
	const vector2 = Vector.fromXYZ(2, 3, 4);
	const result = vector1.cross(vector2);
	closeResultAndCorrectType(result, vectorFn(-1, 2, -1), Vector, PRECISION);
	
	const result2 = vector2.cross(vector1);
	closeResultAndCorrectType(result2, vectorFn(1, -2, 1), Vector, PRECISION);
    });
});
