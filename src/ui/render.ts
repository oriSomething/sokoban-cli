import blessed = require("blessed");
import { MapItem } from "../consts/MapItem";
import { Level } from "../models/Level";

const CELL_SIZE_X = 4;
const CELL_SIZE_Y = 2;

export function render($level: blessed.Widgets.Node, level: Level) {
  removeChildren($level);

  for (let y = 0; y < level.map.length; y++) {
    for (let x = 0; x < level.map.length; x++) {
      const item = level.map[y][x];

      const bg =
        item === MapItem.GOAL_AND_SOKOBAN || item === MapItem.GOAL_AND_PACKAGE || item === MapItem.GOAL
          ? "#333"
          : undefined;

      switch (item) {
        case MapItem.WALL:
          $level.append(
            blessed.box({
              ...getPositionStyles(x, y),
              content: ["····", "····"].join("\n"),
              style: {
                fg: "#555555",
                bg: "#775500",
              },
            }),
          );
          break;

        case MapItem.PACKAGE:
        case MapItem.GOAL_AND_PACKAGE:
          $level.append(
            blessed.box({
              ...getPositionStyles(x, y),
              content: ["╔══╗", "╚══╝"].join("\n"),
              style: {
                bg,
                fg: "yellow",
              },
            }),
          );
          break;

        case MapItem.SOKOBAN:
        case MapItem.GOAL_AND_SOKOBAN:
          $level.append(
            blessed.box({
              ...getPositionStyles(level.x, level.y),
              content: ["(••)", "╔╗╔╗"].join("\n"),
              style: {
                bg,
                fg: "#FF00FF",
              },
            }),
          );
          break;

        case MapItem.GOAL:
          $level.append(
            blessed.box({
              ...getPositionStyles(x, y),
              style: {
                bg,
              },
            }),
          );
          break;

        default:
          $level.append(
            blessed.box({
              ...getPositionStyles(x, y),
              style: {
                bg,
              },
            }),
          );
      }
    }
  }
}

function getPositionStyles(x: number, y: number) {
  return {
    top: y * CELL_SIZE_Y,
    left: x * CELL_SIZE_X,
    width: CELL_SIZE_X,
    height: CELL_SIZE_Y,
  };
}

function removeChildren($node: blessed.Widgets.Node): void {
  while ($node.children.length > 0) {
    $node.remove($node.children[0]);
  }
}
