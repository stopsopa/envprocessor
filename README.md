# Install

```bash

npm install envprocessor

yarn add envprocessor

```

# use from CLI

```bash

npx envprocessor

node node_modules/envprocessor/src/cli.js --help

node node_modules/envprocessor/src/cli.js --mask "^TERM_" --debug --verbose

```

# examples from js module

- [examples](examples) directory
- web example [envprocessor/examples/index.html](envprocessor/examples/index.html)

# using from project

add loading script below before scripts loading transpiled js in your project main html:

```html

<script src="/envprocessed.js"></script>

```

then use env vars in browser using:

```js

// ESM
import { get } from "envprocessor/env";

// CJS
const { get } = require("envprocessor/env");

console.log(`get('USER') >${get("USER")}`);

```

