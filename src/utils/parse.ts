import { MapItem } from "../consts/MapItem";
import { Level } from "../models/Level";

enum Token {
  MAP = "MAP",
  NAME = "NAME",
}

const SPLIT_LINE_CHAR = "\n";

export function parse(file: string) {
  return [...levels(tokenizer(file))];
}

function* tokenizer(file: string) {
  let state = Token.MAP;
  let buffer = "";

  for (const ch of file) {
    if (state === Token.MAP && ch === ";") {
      yield {
        type: Token.MAP,
        content: buffer,
      };
      state = Token.NAME;
      buffer = "";
      continue;
    } else if (state === Token.NAME && ch === "\n") {
      yield {
        type: Token.NAME,
        content: buffer,
      };
      state = Token.MAP;
      buffer = "";
      continue;
    }

    buffer += ch;
  }

  // After EOL
  if (state === Token.NAME) {
    yield {
      type: Token.NAME,
      content: buffer,
    };
  }
}

function* levels(tokens: IterableIterator<{ type: string; content: string }>) {
  let lastTokenType;
  let level;

  for (let token of tokens) {
    if (token.type === Token.MAP) {
      if (lastTokenType === Token.MAP) {
        throw new Error("You cannot have two maps in a row without level name between them");
      }

      level = parseMap(token.content);
    } else if (token.type === Token.NAME) {
      if (lastTokenType === Token.NAME) {
        throw new Error("You cannot have two levels names in a row without map between them");
      }

      if (lastTokenType == null || level == null) {
        throw new Error("The first element in the map was level name instead of a map");
      }

      const name = parseName(token.content);
      const map = level.map;
      const playerX = level.playerX;
      const playerY = level.playerY;

      yield new Level(name, map, playerX, playerY);
      level = null;
    }

    lastTokenType = token.type;
  }
}

function parseName(text: string): string {
  return text.trim();
}

function parseMap(text: string) {
  let maxLineLength = 0;
  let map: Array<Array<MapItem>> = [];
  let playerX = -1;
  let playerY = -1;

  const lines = text.split(SPLIT_LINE_CHAR);

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];

    maxLineLength = Math.max(maxLineLength, line.length);

    let buffer: Array<MapItem> = [];

    for (let x = 0; x < line.length; x++) {
      let ch = line[x];

      // Player
      if (ch === MapItem.SOKOBAN || ch === MapItem.GOAL_AND_SOKOBAN) {
        playerX = x;
        playerY = y;
      }

      // Map
      switch (ch) {
        case MapItem.WALL:
        case MapItem.PACKAGE:
        case MapItem.SOKOBAN:
        case MapItem.GOAL:
        case MapItem.GOAL_AND_PACKAGE:
        case MapItem.GOAL_AND_SOKOBAN:
          buffer.push(ch);
          break;

        default:
          buffer.push(MapItem.FLOOR);
      }
    }

    map.push(buffer);
  }

  // Fill gaps
  for (let i = 0; i < map.length; i++) {
    const line = map[i];
    while (line.length !== maxLineLength) {
      line.push(MapItem.FLOOR);
    }
  }

  return {
    map,
    playerX,
    playerY,
  };
}
