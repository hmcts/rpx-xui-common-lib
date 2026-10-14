export function scannerFixture(fault: boolean): string {
  return `<!doctype html><html lang="en"><head><title>Scanner self-check</title></head>
<body class="govuk-template__body"><a href="#main">Skip to main content</a><main id="main"><h1>Scanner self-check</h1><button>${fault ? '' : 'Continue'}</button></main></body></html>`;
}

export function descriptionFixture(state: 'initial' | 'errors' | 'cleared', fault = ''): string {
  const error = state === 'errors';
  return `<!doctype html><html lang="en"><head><title>Description self-check</title></head>
<body class="govuk-template__body"><a href="#main">Skip to main content</a><main id="main"><h1>Description self-check</h1>
<label for="notes">Notes</label><span id="${fault === 'missing' ? 'wrong-hint' : 'notes-hint'}">${fault === 'text' ? 'Wrong hint' : 'Synthetic hint.'}</span>
${error || fault === 'stale' ? '<span id="notes-error">Error:Enter notes</span>' : ''}
<textarea id="notes" aria-describedby="${fault === 'attribute' ? '' : `notes-hint${error ? ' notes-error' : ''}`}"></textarea>
</main></body></html>`;
}
