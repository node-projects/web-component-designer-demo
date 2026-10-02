import { BindingMode, BindingTarget, IBinding, ServiceContainer } from '@node-projects/web-component-designer';
import { BindableObjectsBrowser } from '@node-projects/web-component-designer-widgets-wunderbaum';
import { BindingsHelper } from '@node-projects/web-component-designer-visualization-addons/dist/helpers/BindingsHelper.js';
import { VisualizationBindingsService } from '@node-projects/web-component-designer-visualization-addons/dist/services/VisualizationBindingsService.js';
import { ClassBindingsPropertyGridExtensionProvider } from '@node-projects/web-component-designer-visualization-addons/dist/components/ClassBindingsPropertyGridExtensionProvider.js';
import { BindingsEditor } from '@node-projects/web-component-designer-visualization-addons/dist/components/BindingsEditor.js';
import type { VisualizationShell } from '@node-projects/web-component-designer-visualization-addons/dist/interfaces/VisualizationShell.js';
import type { State, Signal, VisualizationHandler } from '@node-projects/web-component-designer-visualization-addons/dist/interfaces/VisualizationHandler.js';

// An in-memory signal source keeps the demo independent of a visualization server.
class DemoVisualizationHandler implements VisualizationHandler {
  private values = new Map<string, State>([
    ['DemoData.value1', { val: 42 }], ['DemoData.value2', { val: 'Ready' }],
    ['DemoData.isActive', { val: true }], ['DemoData.hasError', { val: false }]
  ]);
  private listeners = new Map<string, Set<(id: string, state: State) => void>>();
  getNormalizedSignalName(id: string) { return id; }
  async getState(id: string) { return this.values.get(id) ?? { val: null }; }
  async setState(id: string, value: State | State['val']) {
    const state: State = value !== null && typeof value === 'object' ? value : { val: value as State['val'] };
    this.values.set(id, state);
    this.listeners.get(id)?.forEach(callback => callback(id, state));
  }
  subscribeState(id: string, callback: (id: string, state: State) => void) {
    if (!this.listeners.has(id)) this.listeners.set(id, new Set());
    this.listeners.get(id).add(callback);
    return callback;
  }
  unsubscribeState(id: string, callback: (id: string, state: State) => void) { this.listeners.get(id)?.delete(callback); }
  async getHistoricData() { return []; }
  async getObject(id: string): Promise<Signal> { return { $type: 'Signal', id } as Signal; }
  getAllNames() { return [...this.values.keys()]; }
  getSignalInformation(signal: Signal) {
    return { type: typeof this.values.get((signal as Signal & { id: string }).id)?.val as 'string' | 'number' | 'boolean', role: undefined, writeable: true };
  }
}

function showDialog(element: HTMLElement, options: { title?: string, width?: number, height?: number, confirmText?: string, cancelText?: string, abortSignal?: AbortSignal }, confirmation: boolean): Promise<boolean> {
  return new Promise(resolve => {
    const dialog = document.createElement('dialog');
    dialog.style.cssText = `width:min(${options.width ?? 850}px, calc(100vw - 48px));height:min(${options.height ?? 650}px, calc(100vh - 48px));padding:16px;color:var(--wcd-color-text, white);background:var(--wcd-color-surface, #2f3545);border:1px solid #596c7a;`;
    const heading = document.createElement('h3');
    heading.textContent = options.title ?? '';
    heading.style.cssText = 'margin:0 0 12px;font:600 16px system-ui';
    element.style.cssText += ';display:block;height:calc(100% - 80px);width:100%;';
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;margin-top:12px';
    const cancel = document.createElement('button');
    cancel.textContent = confirmation ? options.cancelText ?? 'Cancel' : 'Close';
    cancel.onclick = () => dialog.close();
    actions.append(cancel);
    if (confirmation) {
      const save = document.createElement('button');
      save.textContent = options.confirmText ?? 'Save';
      save.onclick = () => dialog.close('save');
      actions.append(save);
    }
    const abort = () => dialog.close();
    options.abortSignal?.addEventListener('abort', abort, { once: true });
    dialog.onclose = () => {
      options.abortSignal?.removeEventListener('abort', abort);
      dialog.remove();
      resolve(dialog.returnValue === 'save');
    };
    dialog.append(heading, element, actions);
    document.body.append(dialog);
    dialog.showModal();
  });
}

export function setupVisualizationDemo(services: ServiceContainer) {
  const bindingService = new VisualizationBindingsService(new BindingsHelper(new DemoVisualizationHandler()));
  services.register('bindingService', bindingService);
  services.propertyGridExtensions.push(new ClassBindingsPropertyGridExtensionProvider());
  const shell: VisualizationShell = {
    openConfirmation: (element, options) => showDialog(element, options, true),
    openModal: async (element, options) => { await showDialog(element, options, false); },
    createBindableObjectBrowser: () => new BindableObjectsBrowser()
  };
  services.config.openBindingsEditor = async (property, items, binding, target) => {
    if (!items.length) return;
    const editor = new BindingsEditor(property, binding as IBinding & { converter: Record<string, any> }, target, services, items[0].instanceServiceContainer, shell);
    const save = await shell.openConfirmation(editor, { title: `Binding: ${target === BindingTarget.class ? 'class:' : ''}${property.name}`, width: 900, height: 680 });
    if (!save) return;
    const service = binding?.service ?? bindingService;
    const group = items[0].openGroup(`Edit binding: ${property.name}`);
    try {
      for (const item of items) {
        if (!service.setBinding(item, {
          ...binding, target, targetName: property.name, service,
          type: binding?.type ?? VisualizationBindingsService.type,
          mode: editor.twoWay ? BindingMode.twoWay : BindingMode.oneWay,
          bindableObjectNames: editor.objectNames.split(';'), expression: editor.expression,
          expressionTwoWay: editor.expressionTwoWay, changedEvents: editor.events ? editor.events.split(';') : [],
          invert: editor.invert, converters: editor.converter,
          ...{ historic: editor.historic, writeBackSignal: editor.writeBackSignal }
        })) throw new Error('Could not save the binding.');
      }
      group.commit();
    } catch (error) { group.abort(); throw error; }
  };
}

export const visualizationDemoHtml = `<button id="status" class="status" bind-class:is-active="DemoData.isActive" bind-class:has-error="DemoData.hasError" bind-content:text="DemoData.value2" style="position:absolute;left:50px;top:50px;padding:16px 24px;">Ready</button>`;
export const visualizationDemoStyle = `.status { border:2px solid #596c7a;border-radius:8px; } .is-active { background:#d1fae5;color:#065f46; } .has-error { background:#fee2e2;color:#991b1b; }`;
