import { BaseCustomWebComponentConstructorAppend, html, css } from '@node-projects/base-custom-webcomponent';
import { ITransactionItem, IUndoService } from '@node-projects/web-component-designer';
import { Mode, Orientation, TemplateName, createGitgraph, templateExtend } from '@node-projects/gitgraph-js';
import { createG, createText, createPath, } from '@node-projects/gitgraph-js/lib/svg-elements.js';
import { BranchUserApi, Commit, GitgraphUserApi } from '@node-projects/gitgraph-core';

const PADDING = 10;
const OFFSET = 10;

export class UndoRedoGraph extends BaseCustomWebComponentConstructorAppend {

    static readonly template = html`
        <div id="root"></div>
    `;

    static readonly style = css`
        :host {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
        }
        div {
            width: 100%;
            height: 100%;
            background: black;
            border: solid 1px white;
            scale: 0.5;
            transform-origin: 0 0;
        }`;

    static readonly is = 'undo-redo-graph';

    static readonly properties = {

    }

    undoRedoService: IUndoService;

    constructor(undoRedoService: IUndoService) {
        super();
        super._restoreCachedInititalValues();

        this.undoRedoService = undoRedoService;
        this.pointerDown = this.pointerDown.bind(this);
    }

    ready() {
        this._parseAttributesToProperties();
        this._assignEvents();
    }

    render(items: ITransactionItem[]) {
        const graphContainer = this._getDomElement<HTMLDivElement>('root');


        const withoutBranchLabels = templateExtend(TemplateName.Metro, {
            branch: { label: { display: false } },
            commit: {
                message: {
                    displayHash: false,
                }
            }
        });

        const gitgraph = createGitgraph(graphContainer, { orientation: Orientation.Horizontal, mode: Mode.Linear, template: withoutBranchLabels });

        const master = gitgraph.branch('' + this.#i++);
        master.commit({ subject: 'start', renderTooltip: (c) => this.createTooltip(c) });

        this.printItems(items, master, gitgraph, []);

        window.addEventListener('pointerdown', this.pointerDown);
    }

    pointerDown(e: PointerEvent) {
        let p = e.composedPath();
        if (!p.includes(this)) {
            window.removeEventListener('pointerdown', this.pointerDown);
            this.remove();
        }
    }

    #i = 0;

    printItems(items: ITransactionItem[], branch: BranchUserApi<SVGElement>, gitgraph: GitgraphUserApi<SVGElement>, parent: ITransactionItem[]) {
        const current= []
        for (const i of items) {
            let ak = [...parent,...current];
            if (i.redoBranches) {
                let a = [];
                for (let ii of i.redoBranches) {
                    const f = gitgraph.branch('' + this.#i++);
                    a.push(() => this.printItems(ii.toReversed(), f, gitgraph, ak));
                }
                for (let u of a) {
                    u();
                }
            }
            current.push(i);
            ak = [...parent,...current];
            branch.commit({
                subject: i.title.replace("&lt;", "<").replace("&gt;", ">"),
                renderTooltip: (c) => this.createTooltip(c),
                onClick: () => {
                    console.log(ak);
                    //TODO
                    this.undoRedoService.redoTo(ak);
                }
            });
            
        }
    }

    createTooltip(commit: Commit): SVGElement {
        const path = createPath({ d: "", fill: "#EEE" });
        const text = createText({
            translate: { x: OFFSET + PADDING, y: 0 },
            content: `${commit.subject}`,
            fill: "#333",
        });

        const commitSize = commit.style.dot.size * 2;
        const tooltip = createG({
            translate: { x: commitSize, y: commitSize / 2 },
            children: [path],
        });

        const observer = new MutationObserver(() => {
            const { width } = text.getBBox();

            const radius = 5;
            const boxHeight = 50;
            const boxWidth = OFFSET + width + 2 * PADDING;

            const pathD = [
                "M 0,0",
                `L ${OFFSET},${OFFSET}`,
                `V ${boxHeight / 2 - radius}`,
                `Q ${OFFSET},${boxHeight / 2} ${OFFSET + radius},${boxHeight / 2}`,
                `H ${boxWidth - radius}`,
                `Q ${boxWidth},${boxHeight / 2} ${boxWidth},${boxHeight / 2 - radius}`,
                `V -${boxHeight / 2 - radius}`,
                `Q ${boxWidth},-${boxHeight / 2} ${boxWidth - radius},-${boxHeight / 2}`,
                `H ${OFFSET + radius}`,
                `Q ${OFFSET},-${boxHeight / 2} ${OFFSET},-${boxHeight / 2 - radius}`,
                `V -${OFFSET}`,
                "z",
            ].join(" ");

            // Ideally, it would be great to refactor these behavior into SVG elements.
            // rect.setAttribute("width", boxWidth.toString());
            path.setAttribute("d", pathD.toString());
        });

        observer.observe(tooltip, {
            attributes: false,
            subtree: false,
            childList: true,
        });

        tooltip.appendChild(text);

        return tooltip;
    }
}
customElements.define(UndoRedoGraph.is, UndoRedoGraph)