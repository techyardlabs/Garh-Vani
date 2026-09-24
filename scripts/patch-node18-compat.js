import fs from 'fs';
import path from 'path';

try {
  const rolldownSharedDir = path.resolve('node_modules', 'rolldown', 'dist', 'shared');
  if (fs.existsSync(rolldownSharedDir)) {
    const files = fs.readdirSync(rolldownSharedDir);
    for (const file of files) {
      if (file.startsWith('create-bundler-option-') && file.endsWith('.mjs')) {
        const fullPath = path.join(rolldownSharedDir, file);
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('import { formatWithOptions, styleText } from "node:util";')) {
          content = content.replace(
            'import { formatWithOptions, styleText } from "node:util";',
            'import { formatWithOptions } from "node:util";\nconst styleText = (format, text) => (typeof text === "undefined" ? (typeof format === "string" ? format : "") : text);'
          );
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`[Compatibility Patch] Applied Node 18 styleText polyfill to ${file}`);
        }
      }
    }
  }
} catch (err) {
  // If patching fails, do not block the build
  console.warn('[Compatibility Patch] Notice:', err && err.message ? err.message : err);
}
