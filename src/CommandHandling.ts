import { DocumentContainer, ServiceContainer } from '@node-projects/web-component-designer';
import { IUiCommandHandler } from '@node-projects/web-component-designer/dist/commandHandling/IUiCommandHandler';
import { DockManager } from 'dock-spawn-ts/lib/js/DockManager.js';
import { AppShell } from './appShell.js';
import { WebRtcMultiplayerServer } from '@node-projects/web-component-designer-webrtc-multiplayer';
import { UndoRedoGraph } from './UndoRedoGraph.js';

let multiplayer: WebRtcMultiplayerServer = null;;

export class CommandHandling {
  dockManager: DockManager;
  appShell: AppShell;

  constructor(dockManager: DockManager, appShell: AppShell, serviceContainer: ServiceContainer) {
    this.dockManager = dockManager;
    this.appShell = appShell;
    this.init(serviceContainer);
  }

  handleCommandButtonClick(e: MouseEvent) {
    let button = <HTMLElement>e.currentTarget;
    let commandName = button.dataset['command'];
    let commandParameter = button.dataset['commandParameter'];

    if (commandName === 'new')
      this.appShell.newDocument(null, null, false);
    else if (commandName === 'newIframe')
      this.appShell.newDocument(null, null, true);
    else if (commandName === 'github')
      window.location.href = 'https://github.com/node-projects/web-component-designer';
    else if (commandName === 'startServer') {
      if (!multiplayer) {
        multiplayer = new WebRtcMultiplayerServer();
        multiplayer.useBroadcast();
        multiplayer.startServer()
      }
    } else if (commandName === 'connectClient') {
      if (!multiplayer) {
        multiplayer = new WebRtcMultiplayerServer();
        multiplayer.useBroadcast();
        //multiplayer.startClient();
      }
    } else if (commandName === 'redo' && e.shiftKey) {
      const target: DocumentContainer = <DocumentContainer>this.dockManager.activeDocument.resolvedElementContent;
      if (target) {
        const redos = Array.from(target.instanceServiceContainer.undoService.getRedoEntries());
        let undoRedoGraph = new UndoRedoGraph(target.instanceServiceContainer.undoService);
        undoRedoGraph.render(redos);
        undoRedoGraph.style.left = e.x + 'px';
        undoRedoGraph.style.top = e.y + 'px';
        undoRedoGraph.style.width = 'auto';
        undoRedoGraph.style.height = 'auto';
        undoRedoGraph.style.zIndex = '9';
        undoRedoGraph.style.position = 'absolute';
        document.body.appendChild(undoRedoGraph);
      }

    } else if (this.dockManager.activeDocument) {
      let target: any = this.dockManager.activeDocument.resolvedElementContent;
      if (target.executeCommand) {
        target.executeCommand({ type: commandName, parameter: commandParameter, event: e });
      }
    }
  }

  handleCommandButtonMouseHold(button, e) {
    let commandName = <string>button.dataset['command'];
    let commandParameter = button.dataset['commandParameter'];
    let target: any = this.dockManager.activeDocument?.resolvedElementContent;
    target.executeCommand({ type: <any>('hold' + commandName[0].toUpperCase() + commandName.substring(1)), parameter: commandParameter, event: e });
  }

  handleInputValueChanged(e) {
    let input = e.currentTarget as HTMLInputElement;
    let commandName = input.dataset['command'];
    let commandParameter = input.value;

    if (this.dockManager.activeDocument) {
      let target: any = this.dockManager.activeDocument.resolvedElementContent;
      if (target.executeCommand) {
        target.executeCommand({ type: commandName, parameter: commandParameter, event: e });
      }
    }
  }

  init(serviceContainer: ServiceContainer) {
    let buttons = Array.from<HTMLElement>(document.querySelectorAll('[data-command]'));
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
        let target: any = this.dockManager.activeDocument.resolvedElementContent;
        if (target.canExecuteCommand) {
          this.handleCommand(buttons, target);
        } else {
          this.handleCommand(buttons, null);
        }
      } else {
        this.handleCommand(buttons, null);
      }
      const target: DocumentContainer = <DocumentContainer>this.dockManager.activeDocument?.resolvedElementContent;
      if (target) {
        const undoCount = target.instanceServiceContainer.undoService.undoCount;
        const redoCount = target.instanceServiceContainer.undoService.redoCount;
        document.getElementById('undoCount').innerText = '(' + undoCount + '/' + (undoCount + redoCount) + ')';
        document.getElementById('redoCount').innerText = '(' + redoCount + '/' + (undoCount + redoCount) + ')';
      }
    }, 100);
  }

  handleCommand(buttons: (HTMLElement)[], target: IUiCommandHandler) {
    buttons.forEach(b => {
      let command = b.dataset['command'];
      let commandParameter = b.dataset['commandParameter'];
      if (command === 'new')
        b.removeAttribute('disabled');
      else if (command === 'newIframe')
        b.removeAttribute('disabled');
      else if (command === 'github')
        b.removeAttribute('disabled');
      else if (command === 'startServer')
        if (!multiplayer)
          b.removeAttribute('disabled');
        else
          b.setAttribute('disabled', '');
      else if (command === 'connectClient')
        if (!multiplayer)
          b.removeAttribute('disabled');
        else
          b.setAttribute('disabled', '');
      else
        if (!target ? true : !target.canExecuteCommand({ type: <any>command, parameter: commandParameter }))
          b.setAttribute('disabled', '');
        else
          b.removeAttribute('disabled');
    });
  }
}