// Adapted from WebApp origin/master 78d39ffb5097af5774d87f986e1b6ab11373e542.
import { escapeAttribute, escapeHtml } from './accessibilityEvidencePublisher';

export function buildLighthouseSummaryHtml(
  context: {
    feature: string;
    pageState: string;
    url: string;
    message: string;
  },
  reportFileName: string
): string {
  return `
    <html lang="en">
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
        <title>Lighthouse Accessibility Evidence</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; color: #0b0c0c; background: #f3f2f1; }
          .layout { display: grid; grid-template-columns: minmax(280px, 360px) 1fr; min-height: 100vh; }
          .panel { background: #e6f0f7; border-right: 1px solid #b1b4b6; padding: 16px; }
          .panel h1 { margin-top: 0; font-size: 24px; }
          .metric { background: #fff; border-left: 6px solid #00703c; padding: 12px; margin-bottom: 12px; }
          .metric strong { display: block; font-size: 28px; }
          .content { background: #fff; padding: 24px; }
          .banner { background: #1d70b8; color: #fff; padding: 16px; margin-bottom: 24px; }
          .card { border: 1px solid #b1b4b6; padding: 16px; margin-bottom: 16px; }
          .cta { display: inline-block; background: #00703c; color: #fff; padding: 10px 16px; font-weight: bold; text-decoration: none; }
          code { background: #f3f2f1; padding: 2px 4px; }
        </style>
      </head>
      <body>
        <div class="layout">
          <aside class="panel">
            <h1>Lighthouse</h1>
            <div class="metric"><strong>90</strong>Accessibility threshold</div>
            <div class="metric"><strong>Advisory findings</strong>Scanner/report errors block</div>
            <div class="metric"><strong>Scoped</strong>Representative states</div>
          </aside>
          <main class="content">
            <div class="banner">
              <h1>Lighthouse accessibility evidence</h1>
              <p>${escapeHtml(context.feature)} / ${escapeHtml(context.pageState)}</p>
            </div>
            <div class="card">
              <p>${escapeHtml(context.message)}</p><p><strong>URL:</strong> <code>${escapeHtml(context.url)}</code></p>
              <p>Lighthouse is intentionally scoped to stable representative pages in this pack. Axe and WAVE-like checks provide the broader page-state sweep.</p>
              <p><a class="cta" href="./${escapeAttribute(reportFileName)}">Open full Lighthouse HTML report</a></p>
            </div>
          <img alt="Audited page screenshot" src="__SCREENSHOT__"></main>
        </div>
      </body>
    </html>
  `;
}
