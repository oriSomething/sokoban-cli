import glob = require("glob");
import os = require("os");
import path = require("path");
import { getLevelsFromFile } from "./getLevelsFromFile";
import { Level } from "../models/Level";

const COMMON_DIR = ".sokoban-cli";

export async function getLevelsFromCommonStorage(): Promise<Array<Level>> {
  const dir = path.resolve(os.homedir(), COMMON_DIR, "*.txt");

  return getGlob(dir)
    .then(files => Promise.all(files.map(getLevelsFromFile)))
    .then(allLevels => {
      const levelsMap: Map<string, Level> = new Map();

      for (let levels of allLevels) {
        for (let level of levels) {
          levelsMap.set(level.name, level);
        }
      }

      return [...levelsMap.values()];
    })
    .then(levels => levels.sort((a, b) => a.name.localeCompare(b.name)));
}

function getGlob(dir: string): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    glob(dir, (err, matches) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
}
