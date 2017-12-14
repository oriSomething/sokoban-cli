import blessed = require("blessed");
import { View } from "./View";
import { Level } from "../models/Level";
import { removeChildren } from "../utils/removeChildren";
import { LOGO } from "../consts/LOGO";

export class SelectionView extends View {
  private $levels: blessed.Widgets.ListElement | undefined;
  private levels: Array<Level>;

  constructor(levels: Array<Level>) {
    super();
    this.levels = levels;
  }

  initialize() {
    super.initialize();
    this.render();
    if (this.$levels) {
      this.$levels.addListener("select", this.handleLevelSelect);
      this.$levels.focus();
    }
  }

  destroy() {
    super.destroy();
    if (this.$levels) {
      this.$levels.removeAllListeners();
    }
  }

  /**
   * Events
   */

  private handleLevelSelect = (__: any, index: number) => {
    this.emit("select", this.levels[index]);
  };

  /**
   * Render
   */

  private render() {
    removeChildren(this.$view);

    const $logo = blessed.box({
      top: 1,
      align: "center",
      content: LOGO,
    });

    this.$levels = blessed.list({
      items: this.levels.map(level => level.name),
      left: 2,
      right: 2,
      top: 8,
      bottom: 2,
      tags: true,
      keys: true,
      mouse: true,
      border: "line",
      scrollbar: {
        ch: "█︎",
      },
      style: {
        selected: {
          fg: "yellow",
          inverse: true,
          bold: true,
        },
      },
    });

    this.$view.append($logo);
    this.$view.append(this.$levels);
    this.$view.screen.render();
  }
}
