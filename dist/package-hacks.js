"use strict";
function getAdditionalInfo(baseUrl) {
    let hacks = {
        "@shoelace-style/shoelace": {
            "html": `<link rel="stylesheet" media="(prefers-color-scheme:light)" href="${baseUrl}/dist/themes/light.css">
<link rel="stylesheet" media="(prefers-color-scheme:dark)" href="${baseUrl}/dist/themes/dark.css" onload="document.documentElement.classList.add('sl-theme-dark');">`
        },
        "@microsoft/fast-components": {
            "script": `let res = await import('@microsoft/fast-components');
res.provideFASTDesignSystem().register(res.allComponents);`
        }
    };
    return hacks[baseUrl];
}
