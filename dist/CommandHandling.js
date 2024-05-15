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
            this.appShell.newDocument(null, null, false);
        if (commandName === 'newIframe')
            this.appShell.newDocument(null, null, true);
        else if (commandName === 'github')
            window.location.href = 'https://github.com/node-projects/web-component-designer';
        else if (this.dockManager.activeDocument) {
            let target = this.dockManager.activeDocument.resolvedElementContent;
            if (target.executeCommand) {
                target.executeCommand({ type: commandName, parameter: commandParameter, event: e });
            }
        }
    }
    handleCommandButtonMouseHold(button, e) {
        let commandName = button.dataset['command'];
        let commandParameter = button.dataset['commandParameter'];
        let target = this.dockManager.activeDocument.resolvedElementContent;
        target.executeCommand({ type: ('hold' + commandName[0].toUpperCase() + commandName.substring(1)), parameter: commandParameter, event: e });
    }
    handleInputValueChanged(e) {
        let input = e.currentTarget;
        let commandName = input.dataset['command'];
        let commandParameter = input.value;
        if (this.dockManager.activeDocument) {
            let target = this.dockManager.activeDocument.resolvedElementContent;
            if (target.executeCommand) {
                target.executeCommand({ type: commandName, parameter: commandParameter, event: e });
            }
        }
    }
    init(serviceContainer) {
        let buttons = Array.from(document.querySelectorAll('[data-command]'));
        buttons.forEach(b => {
            let mouseDownTimer = null;
            b.addEventListener('mousedown', (e) => {
                mouseDownTimer = setTimeout(() => {
                    this.handleCommandButtonMouseHold(b, e);
                    mouseDownTimer = false;
                }, 300);
            });
            b.addEventListener('click', (e) => {
                if (mouseDownTimer !== false)
                    this.handleCommandButtonClick(e);
            });
            b.addEventListener('mouseup', (e) => {
                if (mouseDownTimer) {
                    clearTimeout(mouseDownTimer);
                    mouseDownTimer = null;
                }
            });
        });
        setInterval(() => {
            if (this.dockManager.activeDocument) {
                let target = this.dockManager.activeDocument.resolvedElementContent;
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
            const target = this.dockManager.activeDocument.resolvedElementContent;
            if (target) {
                const undoCount = target.instanceServiceContainer.undoService.undoCount;
                const redoCount = target.instanceServiceContainer.undoService.redoCount;
                document.getElementById('undoCount').innerText = '(' + undoCount + '/' + (undoCount + redoCount) + ')';
                document.getElementById('redoCount').innerText = '(' + redoCount + '/' + (undoCount + redoCount) + ')';
            }
        }, 100);
    }
    handleCommand(buttons, target) {
        buttons.forEach(b => {
            let command = b.dataset['command'];
            let commandParameter = b.dataset['commandParameter'];
            if (command === 'new')
                b.removeAttribute('disabled');
            else if (command === 'github')
                b.removeAttribute('disabled');
            else if (!target ? true : !target.canExecuteCommand({ type: command, parameter: commandParameter }))
                b.setAttribute('disabled', '');
            else
                b.removeAttribute('disabled');
        });
    }
}
