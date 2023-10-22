import fs from "fs";
import path from "path";
import { Color } from "./color";
//import { BASE_DIR } from "@src/config";
import { BASE_DIR, PPM_OUT_DIR } from "../../config";

export class Canvas {
	
	private readonly w: number;
	private readonly h: number;
	private readonly size: number;
	private readonly canvas: Array<Color>;
	private readonly PPM_HEADER: string;

	private static readonly PPM_LINE_LIMIT: number = 70;
	private static readonly PPM_MAX_COLOR = 255;

	constructor(w: number, h: number) {
		if (w <= 0 || h <= 0) {
			throw new Error(`Invalid width and height ${w}, ${h}.`);
		}
		this.w = w;
		this.h = h;
		this.size = w * h;
		
		this.PPM_HEADER = `P3\n${this.w} ${this.h}\n${Canvas.PPM_MAX_COLOR}\n`;

		this.canvas = this.makeColorArray(this.size);
	}

	private makeColorArray(size: number): Array<Color> {
		const arr = Array<Color>(size);
		for (let index = 0; index < size; index++) {
			arr[index] = Color.fromRGB(0, 0, 0);
		}
		return arr;
	}

	private pos(x: number, y: number): number {
		return y * this.w + x;
	}

	private cord(pos: number): [number, number] {
		return [pos % this.w, Math.floor(pos / this.w)];
	}

	private withinBounds(x: number, y: number): boolean {
		if (x < 0 || x >= this.w) return false;
		if (y < 0 || y >= this.h) return false;
		return true;
	}

	private toPixel(val: number): number {
		return Math.max(0, Math.min(Math.floor(val * Canvas.PPM_MAX_COLOR), Canvas.PPM_MAX_COLOR));
	}

	get numOfPixels(): number {
		return this.size;
	}

	get width(): number {
		return this.w;
	}

	get height(): number {
		return this.h;
	}

	private rejectOutOfBounds(x: number, y: number) {
		if (!this.withinBounds(x, y)) throw new Error(`${x} and ${y} exceed canvas bounds of ${this.w} and ${this.h}.`);
	}

	private rejectNonIntegerIndex(x: number, y: number) {
		if (x % 1 !== 0 || y % 1 !== 0) {
			throw new Error("x and y indexes must be integers");
		}
	}

	writePixel(x: number, y: number, color: Color) {
		this.rejectNonIntegerIndex(x, y);
		this.rejectOutOfBounds(x, y);
		this.canvas[this.pos(x, y)] = color.clone();
	}

	pixelAt(x: number, y: number): Color {
		this.rejectNonIntegerIndex(x, y);
		this.rejectOutOfBounds(x, y);
		return this.canvas[this.pos(x, y)].clone();
	}

	toPPMStr(): string {

		const contentStrArr: Array<string> = [];

		for (let i = 0; i < this.h; i++) {
			const row: Array<string> = [];
			for (let j = 0; j < this.w; j++) {
				const color = this.pixelAt(j, i);
				row.push(`${this.toPixel(color.r)}`)
				row.push(`${this.toPixel(color.g)}`)
				row.push(`${this.toPixel(color.b)}`)
			}

			let xterCount = row[0].length;
			for (let index = 1; index < row.length; index++) {
				const str = row[index];
				if (xterCount + str.length + 1 > Canvas.PPM_LINE_LIMIT) {
					row[index] = `\n${str}`;
					xterCount = str.length;
				} else {
					row[index] = ` ${str}`;
					xterCount += str.length + 1;
				}
			}

			if (i === this.h - 1) row.push("\n");

			contentStrArr.push(row.join(""));
		}

		if (contentStrArr.length === 0) return this.PPM_HEADER;

		contentStrArr[0] = `${this.PPM_HEADER}${contentStrArr[0]}`
		return contentStrArr.join("\n");

	}

	toPPMFile(file_name: string | null | undefined, dir_name?: string | null): string {
		file_name = `${file_name ?? "test"}.ppm`;
		const dir_path: string = dir_name ? path.join(BASE_DIR, dir_name) : PPM_OUT_DIR;

		if (!fs.existsSync(dir_path)) {
			fs.mkdirSync(dir_path, { recursive: true });
		}

		const filePath = path.join(dir_path, file_name);
		const file = fs.openSync(filePath, "w");
		fs.writeFileSync(file, this.toPPMStr(), { encoding: "utf8" });
		fs.closeSync(file);
		return filePath;
	}
}