const fs = require('fs');
const path = require('path');

// Check for node_modules directory
const nodeModulesPath = path.join(__dirname, 'node_modules');

fs.access(nodeModulesPath, fs.constants.F_OK, (err) => {
    if (err) {
        console.log();
        console.error(`Error: node_modules directory not found.\nPlease run \`pnpm install\` before proceeding.`);
        console.log();
        process.exit(1); // Exit with error
    } else {
        process.exit(0); // Success
    }
});
