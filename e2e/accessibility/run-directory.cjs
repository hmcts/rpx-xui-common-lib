const { mkdirSync, mkdtempSync } = require('node:fs');
const { resolve, join, dirname } = require('node:path');

function createRunDirectory(parent) {
  // Playwright reloads configuration in workers; inherit the parent reservation.
  if (process.env.COMMONLIB_A11Y_ACTIVE_RUN_DIR) return process.env.COMMONLIB_A11Y_ACTIVE_RUN_DIR;
  const configuredDir = process.env.COMMONLIB_A11Y_RUN_DIR;
  mkdirSync(parent, { recursive: true });
  const runDir = configuredDir ? resolve(configuredDir) : mkdtempSync(join(resolve(parent), 'run-'));
  if (configuredDir) {
    mkdirSync(dirname(runDir), { recursive: true });
    // Exclusive creation rejects stale output and concurrent invocations.
    mkdirSync(runDir);
  }
  process.env.COMMONLIB_A11Y_ACTIVE_RUN_DIR = runDir;
  return runDir;
}

module.exports = { createRunDirectory };
