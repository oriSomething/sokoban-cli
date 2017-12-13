#!/usr/bin/env node

import main from "./index";

const filename = process.argv[2];

if (filename === undefined) {
  throw new ReferenceError("No given filename");
}

main(filename);
