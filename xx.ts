// generated from template: https://stopsopa.github.io/xx/templates/xx.ts
// github edit  : https://github.com/stopsopa/xx/edit/main/templates/xx.ts

// 🚀 -
// ✅ -
// ⚙️  -
// 🗑️  -
// 🛑 -
// to call other xx commands from inside any xx command use:
//    shopt -s expand_aliases && source ~/.bashrc
// after that just do:
//   xx <command_name>

type Command = {
  // shell script, written to xx_generated.sh and executed with /bin/bash
  command: string;
  // shown under the menu for selected row. Default: name of the command
  description?: string;
  // default true: ask "Run command?" before running
  confirm?: boolean;
  // default false. true = run in the current shell (source) instead of /bin/bash
  source?: boolean;
  // lower goes first. Missing means 0, so negative = top, positive = bottom
  order?: number;
};

type Commands = Record<string, Command>;

type Ctx = {
  // arguments given after the name of the command: xx <name> [args]
  args: string[];
  // directory xx was called in
  cwd: string;
  // path of this file
  configPath: string;
};

export default (setup: Commands, ctx: Ctx): Commands => {
  return {
    help: {
      command: `
source .env

cat <<EEE

  🐙 GitHub: $(git ls-remote --get-url origin | awk '{\$1=\$1};1' | tr -d '\\n' | sed -E 's/git@github\\.com:([^/]+)\\/(.+)\\.git/https:\\/\\/github.com\\/\\1\\/\\2/g')

  test server http://0.0.0.0:\${NODE_API_PORT}
      # uncomment JEST_JUST_TESTS=true for testing without servers

  coverage server http://0.0.0.0:\${JEST_COVERAGE_PORT}

EEE

      `,
      description: "Status of all things",
      confirm: false,
    },
    [`build`]: {
      command: `
set -e
cat <<EEE

npm run build

EEE
read -p "\n      Press enter to continue\n"
npm run build
`,
      description: `npm run build`,
      confirm: false,
    },
    [`tsc`]: {
      command: `
set -e
cat <<EEE

node node_modules/.bin/tsc -p tsconfig.json --noEmit --watch
node node_modules/.bin/tsc -p tsconfig.json --noEmit

EEE
node node_modules/.bin/tsc -p tsconfig.json --noEmit --watch
`,
      description: `tsc --watch`,
      confirm: false,
    },
    [`test`]: {
      command: `

cat <<EEE

node node_modules/.bin/vitest --config vitest.config.ts --coverage run

EEE
`,
      description: `print command to run tests`,
      confirm: false,
    },
    [`coverage`]: {
      command: `
cat <<EEE

    open "file://$(realpath "coverage/index.html")"

EEE
read -p "\n      Press enter to continue\n"
open "file://$(realpath "coverage/index.html")"
`,
      confirm: false,
    },
    [`test server`]: {
      command: `
shopt -s expand_aliases && source ~/.bashrc
COMMANDS="$(cat <<-EOF

xx build
TEST_ONE="one" TEST_TWO="two" node dist/cjs/cli.cjs --mask '^TEST_' examples/preprocessed.js --debug
HOST="0.0.0.0" PORT="8433" node server.js

EOF
)"
echo "\$COMMANDS"

read -p "\n      Press enter to continue\n"
set -e
eval "\$COMMANDS"

`,
      confirm: false,
    },
    [`npm install`]: {
      command: `
set -e
cat <<EEE

/bin/bash bash/swap-files-v2.sh package.json package.dev.json package-lock.json package-lock.dev.json -- npm install

/bin/bash bash/swap-files-v2.sh package.json package.dev.json -- npm install

EEE
read -p "\n      Press enter to continue\n"

/bin/bash bash/swap-files-v2.sh package.json package.dev.json package-lock.json package-lock.dev.json -- npm install

`,
      description: `npm install (with package.dev.json swapped in)`,
      confirm: false,
    },
    [`npm pack`]: {
      command: `
set -e
npm pack
`,
      description: `npm pack`,
      confirm: false,
    },
    [`style:check`]: {
      command: `
set -e
NODE_OPTIONS="" node node_modules/.bin/prettier --config prettier.config.cjs --check .
`,
      description: `prettier --check`,
      confirm: false,
    },
    [`style:fix`]: {
      command: `
set -e
NODE_OPTIONS="" node node_modules/.bin/prettier --config prettier.config.cjs --write .
`,
      description: `prettier --write`,
      confirm: false,
    },
    [`style:list`]: {
      command: `
set -e
NODE_OPTIONS="" node node_modules/.bin/prettier --config prettier.config.cjs --list-different .
`,
      description: `prettier --list-different`,
      confirm: false,
    },
    ...setup,
  };
};
