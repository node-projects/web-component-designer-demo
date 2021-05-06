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
    if (commandName === 'new') this.appShell.newDocument(false);else if (this.dockManager.activeDocument) {
      let target = this.dockManager.activeDocument.elementContent.assignedElements()[0];

      if (target.executeCommand) {
        target.executeCommand({
          type: commandName
        });
      }
    }
  }

  init() {
    let buttons = Array.from(document.querySelectorAll('[data-command]'));
    buttons.forEach(b => {
      b.onclick = e => this.handleCommandButtonClick(e);
    });
    setInterval(() => {
      if (this.dockManager.activeDocument) {
        let target = this.dockManager.activeDocument.elementContent.assignedElements()[0];

        if (target.canExecuteCommand) {
          buttons.forEach(b => {
            let command = b.dataset['command'];
            if (command === 'new') b.disabled = false;else b.disabled = !target.canExecuteCommand({
              type: command
            });
          });
        } else {
          buttons.forEach(b => {
            let command = b.dataset['command'];
            if (command === 'new') b.disabled = false;else b.disabled = true;
          });
        }
      } else {
        buttons.forEach(b => {
          let command = b.dataset['command'];
          if (command === 'new') b.disabled = false;else b.disabled = true;
        });
      }
    }, 100);
  }

}