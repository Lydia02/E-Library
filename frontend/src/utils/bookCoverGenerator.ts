
export const generateGenericBookCover = (title: string): string => {
  const covers = [
    // Purple gradient
    `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="300" fill="url(#grad1)"/>
        <text x="100" y="130" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white" opacity="0.9">
          <tspan x="100" dy="0"></tspan>
        </text>
        <text x="100" y="170" font-family="Arial, sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="white" opacity="0.95">
          <tspan x="100" dy="0">${title.substring(0, 14)}</tspan>
          ${title.length > 14 ? `<tspan x="100" dy="18">${title.substring(14, 28)}</tspan>` : ''}
        </text>
      </svg>
    `)}`,
    
    // Pink gradient
    `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f093fb;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="300" fill="url(#grad2)"/>
        <text x="100" y="130" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white" opacity="0.9">
          <tspan x="100" dy="0"></tspan>
        </text>
        <text x="100" y="170" font-family="Arial, sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="white" opacity="0.95">
          <tspan x="100" dy="0">${title.substring(0, 14)}</tspan>
          ${title.length > 14 ? `<tspan x="100" dy="18">${title.substring(14, 28)}</tspan>` : ''}
        </text>
      </svg>
    `)}`,
    
    // Blue gradient
    `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="300" fill="url(#grad3)"/>
        <text x="100" y="130" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white" opacity="0.9">
          <tspan x="100" dy="0">📘</tspan>
        </text>
        <text x="100" y="170" font-family="Arial, sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="white" opacity="0.95">
          <tspan x="100" dy="0">${title.substring(0, 14)}</tspan>
          ${title.length > 14 ? `<tspan x="100" dy="18">${title.substring(14, 28)}</tspan>` : ''}
        </text>
      </svg>
    `)}`,
    
    // Green gradient
    `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#43e97b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#38f9d7;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="300" fill="url(#grad4)"/>
        <text x="100" y="130" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white" opacity="0.9">
          <tspan x="100" dy="0">📗</tspan>
        </text>
        <text x="100" y="170" font-family="Arial, sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="white" opacity="0.95">
          <tspan x="100" dy="0">${title.substring(0, 14)}</tspan>
          ${title.length > 14 ? `<tspan x="100" dy="18">${title.substring(14, 28)}</tspan>` : ''}
        </text>
      </svg>
    `)}`,
    
    // Orange gradient
    `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fa709a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#fee140;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="300" fill="url(#grad5)"/>
        <text x="100" y="130" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white" opacity="0.9">
          <tspan x="100" dy="0">📙</tspan>
        </text>
        <text x="100" y="170" font-family="Arial, sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="white" opacity="0.95">
          <tspan x="100" dy="0">${title.substring(0, 14)}</tspan>
          ${title.length > 14 ? `<tspan x="100" dy="18">${title.substring(14, 28)}</tspan>` : ''}
        </text>
      </svg>
    `)}`
  ];
  
  // Use title's first character code to deterministically select a cover
  const index = (title.charCodeAt(0) || 0) % covers.length;
  return covers[index];
};

export default { generateGenericBookCover };