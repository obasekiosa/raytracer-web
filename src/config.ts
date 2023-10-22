import path from "path";

const BASE_DIR = path.dirname(__dirname);
const PPM_OUT_DIR = path.join(BASE_DIR, "generated");

export {
    BASE_DIR,
    PPM_OUT_DIR
};