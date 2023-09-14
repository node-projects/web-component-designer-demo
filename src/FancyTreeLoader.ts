//Needed, cause Fancy Tree checks for "define" wich is set by monaco
//Will be fixed when we switch to wunderbaum
//@ts-ignore
let d = window.define;
//@ts-ignore
window.define = null;
await import('@node-projects/web-component-designer-widgets-fancytree/dist/loadJqueryAndFancytree.js');
//@ts-ignore
window.define = d;
export {}