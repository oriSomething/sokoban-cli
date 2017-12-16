# Sokoban CLI

Play Sokoban from the CLI with custom maps.

![Screen shot from level](https://raw.githubusercontent.com/orisomething/sokoban-cli/master/assets/screenshot-1.png)

## Install

```sh
npm i -g sokoban-cli
```

## Play

You can play maps from files:

```sh
sokoban-cli map.txt
```

Or you can play maps from the web:

```sh
sokoban-cli https://raw.githubusercontent.com/orisomething/sokoban-cli/master/maps/test-maps.txt
```

And finally, you can put multiple maps files (`txt`) inside `~/.sokoban-cli` folder and play them by running the command
without arguments:

```sh
sokoban-cli
```

### keys

* Arrows keys for moving
* <kbd>Q</kbd> - Quit level/game
* <kbd>R</kbd> - Start from the beginning
* <kbd>U</kbd> - Undo

In case you need to scroll you can use the mouse
