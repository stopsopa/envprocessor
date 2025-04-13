# Install

```bash

npm install envprocessor

yarn add envprocessor

```

# use from CLI

```bash

node node_modules/envprocessor/src/cli.js --help

node node_modules/envprocessor/src/cli.js --mask "^TERM_" --debug --verbose

```

# examples from js module

visit: [examples](examples)

# using from project

add loading script below before scripts loading transpiled js in your project main html:

```html

<script src="/envprocessed.js"></script>

```

then use env vars in browser using:

```js

