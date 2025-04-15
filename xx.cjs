// https://stopsopa.github.io/viewer.html?file=%2Fpages%2Fbash%2Fxx%2Fxx-example.cjs
// edit: https://github.com/stopsopa/stopsopa.github.io/blob/master/pages/bash/xx/xx-example.cjs

// https://stopsopa.github.io/viewer.html?file=xx.cjs
// edit: https://github.com/stopsopa/stopsopa.github.io/blob/master/xx.cjs
// 🚀 -
// ✅ -
// ⚙️  -
// 🗑️  -
// 🛑 -

const S="\\\\"

module.exports = (setup) => {
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
    [`tsc`]: {
      command: `

cat <<EEE

node node_modules/.bin/tsc --watch
node node_modules/.bin/tsc 

EEE
`,
      description: `tsc`,
      confirm: false,
    },
    [`test`]: {
      command: `

cat <<EEE

node node_modules/.bin/vitest --config vitest.config.ts --coverage run

EEE
`,
      description: `coverage server`,
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
COMMANDS="$(cat <<-EOF

TEST_ONE="one" TEST_TWO="two" node src/cli.js --mask '^TEST_' examples/preprocessed.js --debug      
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
      description: `test server`,
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
    [`style list`]: {
      command: `
set -e
/bin/bash bash/swap-files-v2.sh package.json package.dev.json -- yarn style:list	
`,
      description: `style list`,
      confirm: false,
    },
    [`style check`]: {
      command: `
set -e
/bin/bash bash/swap-files-v2.sh package.json package.dev.json -- yarn style:check	
`,
      description: `style check`,
      confirm: false,
    },
    [`style fix`]: {
      command: `
set -e
/bin/bash bash/swap-files-v2.sh package.json package.dev.json -- yarn style:fix	
`,
      description: `style fix`,
      confirm: false,
    },
    ...setup,
  };
};
