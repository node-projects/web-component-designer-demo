//Command Handling..
// Setup commands
export class CommandHandling {
    constructor(dockManager, appShell) {
        this.dockManager = dockManager;
        this.appShell = appShell;
        this.init();
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
    init() {
        let buttons = Array.from(document.querySelectorAll('[data-command]'));
        buttons.forEach(b => {
            b.onclick = (e) => this.handleCommandButtonClick(e);
        });
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
            if (command === 'new')
                b.disabled = false;
            else if (command === 'newFixedWidth')
                b.disabled = false;
            else if (command === 'github')
                b.disabled = false;
            else
                b.disabled = !target ? true : !target.canExecuteCommand({ type: command });
        });
    }
}
