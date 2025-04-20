# Install

```bash

npm install envprocessor

yarn add envprocessor

# first properly working version is 1.8.11
# that version also exports types properly for CJS and ESM
# and works with CJS and ESM mode on consumer side

```

# use from CLI

```bash

npx envprocessor --mask "^TERM_" --verbose --enrichModule node_modules/envprocessor/enrich.js var/preprocessed.js var/dist/prep.js

# can be launched also

node node_modules/.bin/envprocessor

node node_modules/envprocessor/dist/cjs/cli.cjs

node node_modules/envprocessor/dist/esm/cli.js

```

# examples from js module

- [examples](examples) directory
- web example [/envprocessor/examples/index.html](https://stopsopa.github.io/envprocessor/examples/index.html)

# using from project

add loading script below before scripts loading transpiled js in your project main html:

```html

<script src="/envprocessed.js"></script>

```

then use env vars in browser using:

```js

// ESM
import { get } from "envprocessor";

// CJS
const { get } = require("envprocessor");

console.log(`get('USER') >${get("USER")}`);

```

