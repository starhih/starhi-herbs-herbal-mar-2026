/**
 * Postinstall patch: makes Payload's ListView re-throw errors instead of
 * silently returning undefined (which causes a blank screen in the browser).
 *
 * Without this patch, any server-side error in the admin list view is swallowed
 * by ListView's catch block, logged only to the server terminal, and the browser
 * receives an empty React tree — a blank page with no visible error.
 *
 * With this patch, the error propagates to the Next.js error boundary
 * (src/app/(payload)/admin/[[...segments]]/error.tsx) which displays the actual
 * error message in the browser.
 */

const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  'node_modules/@payloadcms/next/dist/views/List/index.js',
);

if (!fs.existsSync(target)) {
  console.warn('[postinstall] Skipping ListView patch — file not found:', target);
  process.exit(0);
}

let src = fs.readFileSync(target, 'utf8');

const ALREADY_PATCHED = 'throw error; // Re-throw so Next.js error boundary';
if (src.includes(ALREADY_PATCHED)) {
  console.log('[postinstall] ListView patch already applied — skipping.');
  process.exit(0);
}

const ORIGINAL = `    } else {
      console.error(error); // eslint-disable-line no-console
    }
  }
};`;

const PATCHED = `    } else {
      console.error(error); // eslint-disable-line no-console
      throw error; // Re-throw so Next.js error boundary shows the actual error
    }
  }
};`;

if (!src.includes(ORIGINAL)) {
  console.warn(
    '[postinstall] ListView patch: expected pattern not found — ' +
      '@payloadcms/next may have been updated. Patch skipped.',
  );
  process.exit(0);
}

src = src.replace(ORIGINAL, PATCHED);
fs.writeFileSync(target, src, 'utf8');
console.log('[postinstall] ✓ ListView patch applied successfully.');
