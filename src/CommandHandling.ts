import { ContextMenu, DocumentContainer, IContextMenuItem, ServiceContainer } from '@node-projects/web-component-designer';
import { IUiCommandHandler } from '@node-projects/web-component-designer/dist/commandHandling/IUiCommandHandler';
import { DockManager } from 'dock-spawn-ts/lib/js/DockManager';
import { AppShell } from './appShell';
//Command Handling..
// Setup commands

export class CommandHandling {
  dockManager: DockManager;
  appShell: AppShell;

  constructor(dockManager: DockManager, appShell: AppShell, serviceContainer: ServiceContainer) {
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
      let target: any = (<HTMLSlotElement><any>this.dockManager.activeDocument.elementContent).assignedElements()[0];
      if (target.executeCommand) {
        target.executeCommand({ type: commandName, parameter: commandParameter, event: e })
      }
    }
  }

  handleCommandButtonMouseHold(button, e) {
    let commandName = <string>button.dataset['command'];
    let commandParameter = button.dataset['commandParameter'];
    let target: any = (<HTMLSlotElement><any>this.dockManager.activeDocument.elementContent).assignedElements()[0];
    target.executeCommand({ type: <any>('hold' + commandName[0].toUpperCase() + commandName.substring(1)), parameter: commandParameter, event: e })
  }

  handleInputValueChanged(e) {
    let input = e.currentTarget as HTMLInputElement;
    let commandName = input.dataset['command'];
    let commandParameter = input.value;

    if (this.dockManager.activeDocument) {
      let target: any = (<HTMLSlotElement><any>this.dockManager.activeDocument.elementContent).assignedElements()[0];
      if (target.executeCommand) {
        target.executeCommand({ type: commandName, parameter: commandParameter, event: e })
      }
    }
  }

  init(serviceContainer: ServiceContainer) {
    let buttons = Array.from<(HTMLButtonElement | HTMLInputElement)>(document.querySelectorAll('[data-command]'));
    buttons.forEach(b => {
      if (b instanceof HTMLButtonElement) {
        b.onclick = (e) => this.handleCommandButtonClick(e);
        let mouseDownTimer = null;
        b.onmousedown = (e) => {
          mouseDownTimer = setTimeout(() => {
            this.handleCommandButtonMouseHold(b, e);
          }, 300)
        }
        b.onmouseup = (e) => {
          if (mouseDownTimer) {
            clearTimeout(mouseDownTimer);
            mouseDownTimer = null;
          }
        }
      } else {
        b.onchange = (e) => this.handleInputValueChanged(e);
        let commandName = b.dataset['command'];
        if (commandName == 'setStrokeColor')
          serviceContainer.globalContext.onStrokeColorChanged.on(e => b.value = e.newValue);
        if (commandName == 'setFillBrush')
          serviceContainer.globalContext.onFillBrushChanged.on(e => b.value = e.newValue);
      }
    });

    let undoButton = <HTMLButtonElement>document.querySelector('[data-command="undo"]')
    let mouseDownTimer = null;
    undoButton.onmousedown = (e) => {
      mouseDownTimer = setTimeout(() => {
        let target: DocumentContainer = <any>(<HTMLSlotElement><any>this.dockManager.activeDocument.elementContent).assignedElements()[0];
        let entries = target.instanceServiceContainer.undoService.getUndoEntries(20);
        let mnu: IContextMenuItem[] = Array.from(entries).map((x, idx) => ({ title: 'undo: ' + x, action: () => { for (let i = 0; i <= idx; i++) target.instanceServiceContainer.undoService.undo() } }));
        ContextMenu.show(mnu, e, { mode: 'undo' });
      }, 300)
    }
    undoButton.onmouseup = (e) => {
      if (mouseDownTimer) {
        clearTimeout(mouseDownTimer);
        mouseDownTimer = null;
      }
    }

    let redoButton = <HTMLButtonElement>document.querySelector('[data-command="redo"]')
    redoButton.onmousedown = (e) => {
      mouseDownTimer = setTimeout(() => {
        let target: DocumentContainer = <any>(<HTMLSlotElement><any>this.dockManager.activeDocument.elementContent).assignedElements()[0];
        let entries = target.instanceServiceContainer.undoService.getRedoEntries(20);
        let mnu: IContextMenuItem[] = Array.from(entries).map((x, idx) => ({ title: 'redo: ' + x, action: () => { for (let i = 0; i <= idx; i++) target.instanceServiceContainer.undoService.redo() } }));
        ContextMenu.show(mnu, e, { mode: 'undo' })
      }, 300)
    }
    redoButton.onmouseup = (e) => {
      if (mouseDownTimer) {
        clearTimeout(mouseDownTimer);
        mouseDownTimer = null;
      }
    }

    setInterval(() => {
      if (this.dockManager.activeDocument) {
        let target: any = (<HTMLSlotElement><any>this.dockManager.activeDocument.elementContent).assignedElements()[0];
        if (target.canExecuteCommand) {
          this.handleCommand(buttons, target);
        } else {
          this.handleCommand(buttons, null);
        }
      } else {
        this.handleCommand(buttons, null);
      }
    }, 100);
  }

  handleCommand(buttons: (HTMLButtonElement | HTMLInputElement)[], target: IUiCommandHandler) {
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
        b.disabled = !target ? true : !target.canExecuteCommand({ type: <any>command, parameter: commandParameter });
    });
  }
}