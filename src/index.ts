import blessed = require("blessed");
import { MainView } from "./views/MainView";

export default function main(uri?: string) {
  const $screen = blessed.screen({
    smartCSR: true,
  });

  const mainView = new MainView(uri);

  mainView.once("quit", function() {
    mainView.destroy();
    process.exit(0);
  });

  $screen.append(mainView.$view);
  mainView.initialize();
}

if (require.main === module) {
  main();
}
