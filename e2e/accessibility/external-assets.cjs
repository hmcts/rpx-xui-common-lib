// Preserve upstream HTML and script order; move its payloads into sibling assets.
function externaliseHtml(input, prefix) {
  if (!/^[a-zA-Z0-9._-]+$/.test(prefix)) throw new Error('Unsafe evidence asset prefix');
  const assets = [];
  let imageIndex = 0;
  let scriptIndex = 0;
  let styleIndex = 0;
  let html = input.replace(/(['"])data:image\/svg\+xml;utf8,(<svg[\s\S]*?<\/svg>)\1/g, (_match, quote, data) => {
    const fileName = `${prefix}-image-${++imageIndex}.svg`;
    assets.push({ fileName, body: decodeURIComponent(data) });
    return `${quote}${fileName}${quote}`;
  });
  html = html.replace(/data:image\/([a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=]+)/g, (_match, type, data) => {
    const extension = type === 'svg+xml' ? 'svg' : type.replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${prefix}-image-${++imageIndex}.${extension}`;
    assets.push({ fileName, body: Buffer.from(data, 'base64') });
    return fileName;
  });
  html = html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (_match, _attrs, body) => {
    const fileName = `${prefix}-style-${++styleIndex}.css`;
    assets.push({ fileName, body });
    return `<link rel="stylesheet" href="${fileName}">`;
  });
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, body) => {
    if (/\bsrc\s*=|\btype\s*=\s*["']application\/json/i.test(attrs) || !body.trim()) return match;
    const fileName = `${prefix}-script-${++scriptIndex}.js`;
    assets.push({ fileName, body });
    return `<script${attrs} src="${fileName}"></script>`;
  });
  return { html, assets };
}
module.exports = { externaliseHtml };
