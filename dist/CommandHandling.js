import { ContextMenu } from '@node-projects/web-component-designer';
//Command Handling..
// Setup commands
export class CommandHandling {
    dockManager;
    appShell;
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
                target.executeCommand({ type: commandName, parameter: commandParameter, event: e });
            }
        }
    }
    handleCommandButtonMouseHold(button, e) {
        let commandName = button.dataset['command'];
        let commandParameter = button.dataset['commandParameter'];
        let target = this.dockManager.activeDocument.elementContent.assignedElements()[0];
        target.executeCommand({ type: ('hold' + commandName[0].toUpperCase() + commandName.substring(1)), parameter: commandParameter, event: e });
    }
    handleInputValueChanged(e) {
        let input = e.currentTarget;
        let commandName = input.dataset['command'];
        let commandParameter = input.value;
        if (this.dockManager.activeDocument) {
            let target = this.dockManager.activeDocument.elementContent.assignedElements()[0];
            if (target.executeCommand) {
                target.executeCommand({ type: commandName, parameter: commandParameter, event: e });
            }
        }
    }
    init(serviceContainer) {
        let buttons = Array.from(document.querySelectorAll('[data-command]'));
        buttons.forEach(b => {
            if (b instanceof HTMLButtonElement) {
                b.onclick = (e) => this.handleCommandButtonClick(e);
                let mouseDownTimer = null;
                b.onmousedown = (e) => {
                    mouseDownTimer = setTimeout(() => {
                        this.handleCommandButtonMouseHold(b, e);
                    }, 300);
                };
                b.onmouseup = (e) => {
                    if (mouseDownTimer) {
                        clearTimeout(mouseDownTimer);
                        mouseDownTimer = null;
                    }
                };
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
                let entries = target.instanceServiceContainer.undoService.getUndoEntries(20);
                let mnu = Array.from(entries).map((x, idx) => ({ title: 'undo: ' + x, action: () => { for (let i = 0; i <= idx; i++)
                        target.instanceServiceContainer.undoService.undo(); } }));
                ContextMenu.show(mnu, e, { mode: 'undo' });
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
                let entries = target.instanceServiceContainer.undoService.getRedoEntries(20);
                let mnu = Array.from(entries).map((x, idx) => ({ title: 'redo: ' + x, action: () => { for (let i = 0; i <= idx; i++)
                        target.instanceServiceContainer.undoService.redo(); } }));
                ContextMenu.show(mnu, e, { mode: 'undo' });
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
