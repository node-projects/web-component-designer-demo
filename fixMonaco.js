import fs from 'fs';

//fix for monaco editor (issue https://github.com/microsoft/monaco-editor/issues/3409)
console.log("fix ./node_modules/monaco-editor/min/vs/editor/editor.main.js");
fs.readFile("./node_modules/monaco-editor/min/vs/editor/editor.main.js", function (err, buf) {
    let code = buf.toString();
    let rgx = /(.)=>{this\.viewHelper\.viewDomNode\.contains\((.)\.target\)/;
    let newcode = code.replace(rgx, '$1=>{this.viewHelper.viewDomNode.contains($1.composedPath()[0])');
    if (code != newcode) {
        console.log("monaco was fixed!!");
        fs.writeFile("./node_modules/monaco-editor/min/vs/editor/editor.main.js", newcode, (err) => {
            if (err) console.log(err);
        });
    }
});