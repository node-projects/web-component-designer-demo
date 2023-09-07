type hacktype = {
    html?: string // html to be inserted when using the package
    script?: string // javascript wich needs to be run when using the package, it will be run before the component detection runs
}

function getAdditionalInfo(baseUrl: string) {
    let hacks = {
        "@shoelace-style/shoelace": {
            "html": `<link rel="stylesheet" media="(prefers-color-scheme:light)" href="${baseUrl}/dist/themes/light.css">
<link rel="stylesheet" media="(prefers-color-scheme:dark)" href="${baseUrl}/dist/themes/dark.css" onload="document.documentElement.classList.add('sl-theme-dark');">`
        },
        "@microsoft/fast-components": {
            "script": `let res = await import('@microsoft/fast-components');
res.provideFASTDesignSystem().register(res.allComponents);`
        }
    }
    return hacks[baseUrl];
}