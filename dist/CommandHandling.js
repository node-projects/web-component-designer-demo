import { ContextMenu } from '/web-component-designer-demo/node_modules/@node-projects/web-component-designer/./dist/index.js';
//Command Handling..
// Setup commands
export class CommandHandling {
    constructor(dockManager, appShell, serviceContainer) {
        this.dockManager = dockManager;
        this.appShell = appShell;
        this.init(serviceContainer);
    }
    handleCommandButtonClick(e) {
        let button = e.currentTarget;
        let commandName = button.dataset['command'];
        let commandParameter = button.dataset['commandParameter'];
        if (commandName === 'new')
            this.appShell.newDocument(false);
        else if (commandName === 'newFixedWidth')
            this.appShell.newDocument(true);
        else if (commandName === 'github')
            window.location.href = 'https://github.com/node-projects/web-component-designer';
        else if (this.dockManager.activeDocument) {
            let target = this.dockManager.activeDocument.elementContent.assignedElements()[0];
            if (target.executeCommand) {
                target.executeCommand({ type: commandName, parameter: commandParameter });
            }
        }
    }
    handleInputValueChanged(e) {
        let input = e.currentTarget;
        let commandName = input.dataset['command'];
        let commandParameter = input.value;
        if (this.dockManager.activeDocument) {
            let target = this.dockManager.activeDocument.elementContent.assignedElements()[0];
            if (target.executeCommand) {
                target.executeCommand({ type: commandName, parameter: commandParameter });
            }
        }
    }
    init(serviceContainer) {
        let buttons = Array.from(document.querySelectorAll('[data-command]'));
        buttons.forEach(b => {
            if (b instanceof HTMLButtonElement) {
                b.onclick = (e) => this.handleCommandButtonClick(e);
            }
            else {
                b.onchange = (e) => this.handleInputValueChanged(e);
                let commandName = b.dataset['command'];
                if (commandName == 'setStrokeColor')
                    serviceContainer.globalContext.onStrokeColorChanged.on(e => b.value = e.newValue);
                if (commandName == 'setFillBrush')
                    serviceContainer.globalContext.onFillBrushChanged.on(e => b.value = e.newValue);
            }
        });
        let undoButton = document.querySelector('[data-command="undo"]');
        let mouseDownTimer = null;
        undoButton.onmousedown = (e) => {
            mouseDownTimer = setTimeout(() => {
                let target = this.dockManager.activeDocument.elementContent.assignedElements()[0];
                let entries = target.instanceServiceContainer.undoService.getUndoEntries();
                let mnu = Array.from(entries).map(x => ({ title: 'undo: ' + x }));
                ContextMenu.show(mnu, e);
            }, 300);
        };
        undoButton.onmouseup = (e) => {
            if (mouseDownTimer) {
                clearTimeout(mouseDownTimer);
                mouseDownTimer = null;
            }
        };
        let redoButton = document.querySelector('[data-command="redo"]');
        redoButton.onmousedown = (e) => {
            mouseDownTimer = setTimeout(() => {
                let target = this.dockManager.activeDocument.elementContent.assignedElements()[0];
                let entries = target.instanceServiceContainer.undoService.getRedoEntries();
                let mnu = Array.from(entries).map(x => ({ title: 'redo: ' + x }));
                ContextMenu.show(mnu, e);
            }, 300);
        };
        redoButton.onmouseup = (e) => {
            if (mouseDownTimer) {
                clearTimeout(mouseDownTimer);
                mouseDownTimer = null;
            }
        };
        setInterval(() => {
            if (this.dockManager.activeDocument) {
                let target = this.dockManager.activeDocument.elementContent.assignedElements()[0];
                if (target.canExecuteCommand) {
                    this.handleCommand(buttons, target);
                }
                else {
                    this.handleCommand(buttons, null);
                }
            }
            else {
                this.handleCommand(buttons, null);
            }
        }, 100);
    }
    handleCommand(buttons, target) {
        buttons.forEach(b => {
            let command = b.dataset['command'];
            let commandParameter = b.dataset['commandParameter'];
            if (command === 'new')
                b.disabled = false;
            else if (command === 'newFixedWidth')
                b.disabled = false;
            else if (command === 'github')
                b.disabled = false;
            else
                b.disabled = !target ? true : !target.canExecuteCommand({ type: command, parameter: commandParameter });
        });
    }
}
