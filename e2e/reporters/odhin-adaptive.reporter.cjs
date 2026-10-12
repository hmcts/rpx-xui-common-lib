/* Keep Odhín's report index lightweight; browser attachments remain external files. */
const odhinModule = require('odhin-reports-playwright');

const OdhinReporter = odhinModule.default ?? odhinModule;

class OdhinAdaptiveReporter {
  constructor(options = {}) {
    this.inner = new OdhinReporter({
      ...options,
      embedAssets: false,
      embedAttachments: false,
    });
  }

  onBegin(config, suite) {
    return this.inner.onBegin?.(config, suite);
  }

  onTestEnd(test, result) {
    const nextResult = { ...result };
    if (nextResult.status === 'passed' || nextResult.status === 'skipped') {
      nextResult.stdout = [];
      nextResult.stderr = [];
    }
    return this.inner.onTestEnd?.(test, nextResult);
  }

  onEnd(result) {
    return this.inner.onEnd?.(result);
  }

  onStdOut(chunk, test, result) {
    return this.inner.onStdOut?.(chunk, test, result);
  }

  onStdErr(chunk, test, result) {
    return this.inner.onStdErr?.(chunk, test, result);
  }
}

module.exports = OdhinAdaptiveReporter;
