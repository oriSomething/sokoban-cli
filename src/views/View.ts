import blessed = require("blessed");
import Events = require("events");

type IKeyEventArg = blessed.Widgets.Events.IKeyEventArg;

export class View extends Events {
  static keyListeners: Map<string, Array<(key: string) => void>> = new Map();

  private static handleKey(__: any, key: IKeyEventArg) {
    const listeners = View.keyListeners.get(key.name);

    if (listeners != null && listeners.length > 0) {
      const cb = listeners[listeners.length - 1];
      cb(key.name);
    }
  }

  readonly $view: blessed.Widgets.BoxElement;

  constructor() {
    super();
    this.$view = blessed.box();
  }

  initialize() {}

  destroy() {
    this.removeAllListeners();
    this.$view.destroy();
  }

  key(keys: string[], listener: (key: string) => void) {
    keys.forEach(key => {
      const listeners = View.keyListeners.get(key);
      if (listeners != null) {
        listeners.push(listener);
      } else {
        const listeners = [listener];
        View.keyListeners.set(key, listeners);
        this.$view.screen.key(key, View.handleKey);
      }
    });
  }

  unkey(keys: string[], listener: (key: string) => void) {
    keys.forEach(key => {
      const listeners = View.keyListeners.get(key);

      if (listeners != null) {
        const index = listeners.indexOf(listener);

        if (index !== -1) {
          listeners.splice(index, 1);
          if (listeners.length === 0) {
            View.keyListeners.delete(key);
            this.$view.screen.unkey(key, View.handleKey);
          }
        }
      }
    });
  }
}
