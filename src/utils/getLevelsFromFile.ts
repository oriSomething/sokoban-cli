import fs = require("fs");
import path = require("path");
import util = require("util");
import { parse } from "./parse";

const readFile = util.promisify(fs.readFile);

export async function getLevelsFromFile(filename: string) {
  const uri = path.resolve(process.cwd(), filename);
  const buffer = await readFile(uri);
  return parse(buffer.toString());
}
