export function scannerFixture(fault: boolean): string {
  return `<!doctype html><html lang="en"><head><title>Scanner self-check</title></head>
<body class="govuk-template__body"><a href="#main">Skip to main content</a><main id="main"><h1>Scanner self-check</h1><button>${fault ? '' : 'Continue'}</button></main></body></html>`;
}
