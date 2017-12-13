import blessed = require("blessed");

export function removeChildren($node: blessed.Widgets.Node): void {
  while ($node.children.length > 0) {
    $node.remove($node.children[0]);
  }
}
