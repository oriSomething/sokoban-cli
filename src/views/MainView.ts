import blessed = require("blessed");
import { View } from "./View";
import { SelectionView } from "./SelectionView";
import { LevelView } from "./LevelView";
import { Level } from "../models/Level";
import { removeChildren } from "../utils/removeChildren";
import { getLevelsFromFile } from "../utils/getLevelsFromFile";
import { getLevelsFromUrl } from "../utils/getLevelsFromUrl";
import { getLevelsFromCommonStorage } from "../utils/getLevelsFromCommonStorage";

export class MainView extends View {
  private readonly uri: string | undefined;
  private selectionView: SelectionView | null | undefined;
  private levelView: LevelView | null | undefined;
  private levels: Array<Level> | null | undefined;

  constructor(uri?: string) {
    super();
    this.uri = uri;
  }

  initialize() {
    super.initialize();
    this.key(["escape", "q", "Q", "C-c"], this.handleQuit);
    this.renderLoading();

    const { uri } = this;
    if (uri !== undefined) {
      const levelsPromise = /^https?:\/\//.test(uri) ? getLevelsFromUrl(uri) : getLevelsFromFile(uri);
      levelsPromise.then(levels => this.handleLevelsLoaded(levels), error => this.renderError(error));
    } else {
      getLevelsFromCommonStorage().then(levels => this.handleLevelsLoaded(levels), error => this.renderError(error));
    }
  }

  destroy() {
    super.destroy();
    this.unkey(["escape", "q", "Q", "C-c"], this.handleQuit);
  }

  private unbindViewContent() {
    if (this.selectionView != null) {
      this.selectionView.destroy();
    }

    if (this.levelView != null) {
      this.levelView.destroy();
    }

    removeChildren(this.$view);
  }

  /**
   * Events
   */

  handleQuit = () => {
    this.emit("quit");
  };

  handleLevelsLoaded = (levels: Array<Level>): void => {
    this.levels = levels;

    switch (levels.length) {
      case 0:
        return this.renderError(new Error("No level exists"));
      case 1:
        return this.renderLevel(levels[0]);
      default:
        return this.renderSelection(levels);
    }
  };

  handleLevelSelect = (level: Level) => {
    this.renderLevel(level);
  };

  handleLevelQuit = () => {
    const levels = this.levels;

    if (levels == null || levels.length <= 1) {
      this.emit("quit");
    } else {
      this.renderSelection(levels);
    }
  };

  /**
   * Render
   */

  private renderLoading() {
    this.unbindViewContent();
    const $loading = blessed.box({
      content: "Loading...",
    });
    this.$view.append($loading);
    this.$view.screen.render();
  }

  private renderError(error: Error) {
    this.unbindViewContent();
    const $error = blessed.box({
      content: `${error.message}\n${error.stack}`,
    });
    this.$view.append($error);
    this.$view.screen.render();
  }

  private renderSelection(levels: Array<Level>) {
    this.unbindViewContent();
    const selectionView = new SelectionView(levels);
    this.selectionView = selectionView;
    selectionView.addListener("select", this.handleLevelSelect);
    selectionView.initialize();
    this.$view.append(selectionView.$view);
    this.$view.screen.render();
  }

  private renderLevel(level: Level) {
    this.unbindViewContent();
    const levelView = new LevelView(level);
    this.levelView = levelView;
    levelView.once("quit", this.handleLevelQuit);
    levelView.initialize();
    this.$view.append(levelView.$view);
    this.$view.screen.render();
  }
}
