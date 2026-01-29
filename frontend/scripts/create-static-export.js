/**
 * Script to create static export from Next.js build
 * This copies files from .next to out folder for deployment
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../out');
const nextDir = path.join(__dirname, '../.next');

// Clean out directory
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Copy static assets (_next folder)
const staticDir = path.join(nextDir, 'static');
const outNextDir = path.join(outDir, '_next/static');
if (fs.existsSync(staticDir)) {
  fs.mkdirSync(path.dirname(outNextDir), { recursive: true });
  copyDir(staticDir, outNextDir);
}

// Copy HTML files from server/app
const serverAppDir = path.join(nextDir, 'server/app');
if (fs.existsSync(serverAppDir)) {
  copyHtmlFiles(serverAppDir, outDir);
}

// Copy public files
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, outDir);
}

// Copy staticwebapp.config.json for Azure SWA
const swaConfig = path.join(__dirname, '../staticwebapp.config.json');
if (fs.existsSync(swaConfig)) {
  fs.copyFileSync(swaConfig, path.join(outDir, 'staticwebapp.config.json'));
}

console.log('Static export created in out/ directory');

// Helper functions
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyHtmlFiles(src, dest, basePath = '') {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    
    if (entry.isDirectory()) {
      const newBasePath = path.join(basePath, entry.name);
      copyHtmlFiles(srcPath, dest, newBasePath);
    } else if (entry.name.endsWith('.html')) {
      let destPath;
      if (entry.name === 'index.html') {
        destPath = path.join(dest, basePath, 'index.html');
      } else {
        // Remove .html extension and add index.html
        const name = entry.name.replace('.html', '');
        destPath = path.join(dest, basePath, name, 'index.html');
      }
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
