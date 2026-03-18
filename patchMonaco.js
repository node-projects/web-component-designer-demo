import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(fullPath, callback);
        } else if (entry.isFile() && fullPath.endsWith('.js')) {
            callback(fullPath);
        }
    }
}

function removeCssImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Remove lines like:
    // import './file.css';
    // import x from './file.css';
    // import * as y from "./styles.css";
    content = content.replace(/^\s*import\s+[^;]*['"]([^'"]+\.css)['"]\s*;?\s*$/gm, '');
    // Fix dompurify import paths
    // content = content.replace(/\.\/dompurify\/dompurify\.js/gm, 'dompurify');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Cleaned:', filePath);
    }
}

// Run the script
const targetDir = './node_modules/monaco-editor/esm'
walkDir(path.resolve(targetDir), removeCssImports);
fs.rmSync('./node_modules/monaco-editor/dev', { recursive: true, force: true });

fs.readFile("./node_modules/monaco-editor/esm/vs/editor/browser/controller/mouseHandler.js", function (err, buf) {
    let code = buf.toString();
    let rgx = /this\.viewHelper\.viewDomNode\.contains\(e\.target\)/;
    let newcode = code.replace(rgx, 'this.viewHelper.viewDomNode.contains(e.composedPath()[0])');
    if (code != newcode) {
        console.log("patched monaco editor mouseHandler");
        fs.writeFile("./node_modules/monaco-editor/esm/vs/editor/browser/controller/mouseHandler.js", newcode, (err) => {
            if (err) console.log(err);
        });
    }
});