const sandboxVals = [
  'allow-same-origin',
  'allow-top-navigation',
  'allow-popups-to-escape-sandbox',
  'allow-forms',
].join(' ');

const cspContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv=Content-Security-Policy content="
      img-src *;
      media-src *;
      script-src 'none'; 
      object-src 'none'; 
      child-src 'none'; 
      default-src 'none'; 
      style-src  
      https://cdn.ampproject.org/rtv/ 
      https://cdn.materialdesignicons.com 
      https://cloud.typography.com 
      https://fast.fonts.net
      https://fonts.googleapis.com 
      https://maxcdn.bootstrapcdn.com 
      https://p.typekit.net 
      https://pro.fontawesome.com 
      https://use.fontawesome.com 
      https://use.typekit.net
      'unsafe-inline';
  ">
  </head>
  <body></body>
  </html>`;

export function createIframe() {
  const fie = document.createElement('iframe');
  fie.setAttribute('sandbox', sandboxVals);
  fie.height = '500px';
  fie.srcdoc = cspContent;
  return fie;
}
