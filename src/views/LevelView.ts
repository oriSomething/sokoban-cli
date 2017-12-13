import blessed = require("blessed");
import { View } from "./View";
import { Level } from "../models/Level";
import { MapItem } from "../consts/MapItem";
import { removeChildren } from "../utils/removeChildren";

const CELL_SIZE_X = 4;
const CELL_SIZE_Y = 2;

function getLastMove(moves: Array<Level>): Level {
  return moves[moves.length - 1];
}

function countMoves(moves: Array<Level>): number {
  return moves.length - 1;
}

function getPositionStyles(x: number, y: number) {
  return {
    top: y * CELL_SIZE_Y,
    left: x * CELL_SIZE_X,
    width: CELL_SIZE_X,
    height: CELL_SIZE_Y,
  };
}

export class LevelView extends View {
  private level: Level;
  private moves: Array<Level>;
  private $info: blessed.Widgets.BoxElement;
  private $level: blessed.Widgets.BoxElement;

  constructor(level: Level) {
    super();
    this.level = level;
    this.moves = [level];
  }

  initalize() {
    super.initialize();
    this.key(["escape", "q", "Q", "C-c"], this.handleQuit);
    this.key(["up", "right", "down", "left"], this.handleArrowKeyPressed);
    this.key(["r"], this.handleRefreshKeyPressed);
    this.key(["u"], this.handleUndoKeyPressed);
    this.render();
  }

  destroy() {
    super.destroy();
    this.unkey(["escape", "q", "Q", "C-c"], this.handleQuit);
    this.unkey(["up", "right", "down", "left"], this.handleArrowKeyPressed);
    this.unkey(["r"], this.handleRefreshKeyPressed);
    this.unkey(["u"], this.handleUndoKeyPressed);
  }

  isGameOver(): boolean {
    return getLastMove(this.moves).isGameOver;
  }

  /**
   * Events
   */

  private handleQuit = () => {
    this.emit("quit");
    return false;
  };

  private handleUndoKeyPressed = () => {
    if (!this.isGameOver() && this.moves.length > 1) {
      this.moves.pop();
      this.level = this.moves[this.moves.length - 1];
      this.update();
    }
  };

  private handleRefreshKeyPressed = () => {
    if (this.isGameOver()) return;

    this.level = this.moves[0];
    this.moves = [this.level];
    this.update();
  };

  private handleArrowKeyPressed = (key: string) => {
    let level: Level;

    switch (key) {
      case "up":
        level = this.level.move(0, -1);
        break;
      case "right":
        level = this.level.move(1, 0);
        break;
      case "down":
        level = this.level.move(0, 1);
        break;
      case "left":
        level = this.level.move(-1, 0);
        break;
    }

    if (!this.isGameOver() && level! !== this.moves[this.moves.length - 1]) {
      this.level = level!;
      this.moves.push(this.level);
      this.update();
    }
  };

  /**
   * Render
   */

  private render() {
    const lastMove = getLastMove(this.moves);

    // Info
    const $info = blessed.box({
      top: 0,
      left: 0,
      width: "100%",
      height: 3,
    });

    // Map
    const $level = blessed.box({
      top: 3,
      scrollable: true,
      mouse: true,
      border: "line",
    });

    for (let y = 0; y < lastMove.map.length; y++) {
      for (let x = 0; x < lastMove.map.length; x++) {
        $level.append(blessed.box(getPositionStyles(x, y)));
      }
    }

    this.$info = $info;
    this.$level = $level;
    this.$view.append($level);
    this.$view.append($info);
    this.update();
  }

  private updateInfo() {
    const levelName = this.level.name;
    const movesCount = countMoves(this.moves);
    const $info = this.$info!;

    removeChildren($info);

    const $levelName = blessed.box({
      left: 1,
      top: 1,
      height: 1,
      content: levelName,
      style: {
        bold: true,
      },
    });

    const $moves = blessed.box({
      left: "center",
      top: 1,
      height: 1,
      content: `{center}MOVES: {bold}${movesCount}{/bold}{/center}`,
      tags: true,
    });

    $info.append($levelName);
    $info.append($moves);
  }

  private updateLevel() {
    const level = getLastMove(this.moves);
    const $level = this.$level!;

    for (let i = 0; i < $level.children.length; i++) {
      const element = $level.children[i] as blessed.Widgets.BoxElement;
      const y = Math.floor(i / level.map.length);
      const x = i % level.map.length;
      const item = level.map[y][x];

      const bg =
        item === MapItem.GOAL_AND_SOKOBAN || item === MapItem.GOAL_AND_PACKAGE || item === MapItem.GOAL
          ? "#333"
          : undefined;

      switch (item) {
        case MapItem.WALL:
          element.setContent(["····", "····"].join("\n"));
          element.style = {
            bg: "#775500",
            fg: "#555555",
          };
          break;

        case MapItem.PACKAGE:
        case MapItem.GOAL_AND_PACKAGE:
          element.setContent(["╔══╗", "╚══╝"].join("\n"));
          element.style = {
            bg,
            fg: "yellow",
          };
          break;

        case MapItem.SOKOBAN:
        case MapItem.GOAL_AND_SOKOBAN:
          element.setContent(["(••)", "╔╗╔╗"].join("\n"));
          element.style = {
            bg,
            fg: "#FF00FF",
          };
          break;

        case MapItem.GOAL:
          element.setContent("");
          element.style = {
            bg,
          };
          break;

        default:
          element.setContent("");
          element.style = {
            bg,
          };
      }
    }
  }

  private update() {
    this.updateInfo();
    this.updateLevel();

    if (this.isGameOver()) {
      const movesCount = countMoves(this.moves);

      const $gameOver = blessed.box({
        left: "center",
        top: "center",
        height: 7,
        width: 17,
        content: `\n{center}GAME OVER{/center}\n\n{center}Moves: ${movesCount}{/center}`,
        tags: true,
        border: "line",
        style: {
          bold: true,
        },
      });

      this.$view.append($gameOver);
    }

    this.$view.screen.render();
  }
}
