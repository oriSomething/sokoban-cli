import { MapItem } from "../consts/MapItem";

type MapT = Array<Array<MapItem>>;

export class Level {
  name: string;
  map: MapT;
  x: number;
  y: number;
  isGameOver: boolean;

  constructor(name: string, map: MapT, playerX: number, playerY: number) {
    this.name = name;
    this.map = map;
    this.x = playerX;
    this.y = playerY;
    this.isGameOver = isGameOver(this.map);
  }

  move(offsetX: -1 | 0 | 1, offsetY: -1 | 0 | 1): Level {
    const item = get(this.map, this.x, this.y);
    const nextItem = get(this.map, this.x + offsetX, this.y + offsetY);
    const afterNextItem = get(this.map, this.x + offsetX * 2, this.y + offsetY * 2);
    let { map } = this;

    switch (nextItem) {
      case MapItem.FLOOR:
      case MapItem.GOAL:
        map = set(
          map,
          this.x + offsetX,
          this.y + offsetY,
          nextItem === MapItem.GOAL ? MapItem.GOAL_AND_SOKOBAN : MapItem.SOKOBAN,
        );
        break;

      case MapItem.PACKAGE:
      case MapItem.GOAL_AND_PACKAGE:
        switch (afterNextItem) {
          case MapItem.FLOOR:
          case MapItem.GOAL:
            map = set(
              map,
              this.x + offsetX * 2,
              this.y + offsetY * 2,
              afterNextItem === MapItem.GOAL ? MapItem.GOAL_AND_PACKAGE : MapItem.PACKAGE,
            );
            map = set(
              map,
              this.x + offsetX,
              this.y + offsetY,
              nextItem === MapItem.GOAL_AND_PACKAGE ? MapItem.GOAL_AND_SOKOBAN : MapItem.SOKOBAN,
            );
            break;
        }
    }

    if (map === this.map) {
      return this;
    } else {
      map = set(map, this.x, this.y, item === MapItem.GOAL_AND_SOKOBAN ? MapItem.GOAL : MapItem.FLOOR);
      return new Level(this.name, map, this.x + offsetX, this.y + offsetY);
    }
  }
}

/**
 * Helpers
 */

function isGameOver(map: MapT): boolean {
  return map.every(line => {
    return !line.some(item => item === MapItem.GOAL || item === MapItem.PACKAGE);
  });
}

function get(map: MapT, x: number, y: number): MapItem | null {
  if (x < 0 || y < 0) {
    return null;
  }

  if (y >= map.length) {
    return null;
  }

  const line = map[y];

  if (x >= line.length) {
    return null;
  }

  return line[x];
}

function set(map_: MapT, x: number, y: number, item: MapItem): MapT {
  let map = [...map_];
  map[y] = [...map[y]];
  map[y][x] = item;
  return map;
}
