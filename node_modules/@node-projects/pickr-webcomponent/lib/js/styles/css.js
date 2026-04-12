/**
 * Tagged template helper: builds a constructable CSSStyleSheet from a CSS string.
 * Usage: const sheet = css`:host { color: red; }`;
 */
export const css = (strings, ...values) => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssString(strings, ...values));
    return sheet;
};

export const cssString = (s, ...v) => s[0] + v.map((val, i) => (val ?? '') + s[i + 1]).join('');

export const TRANSPARENCY_BG = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>')`;

export const rainbow = (dir = 'to bottom') =>
    `linear-gradient(${dir}, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))`;
