import { WindowState } from './WindowsModels';

function reorderWindows<StateType extends WindowState = WindowState>(states: StateType[], previousOrder: string[]): [StateType[], string[]] {
  let oldStates = states.slice();
  const newStates = [];
  for (const id of previousOrder) {
    const state = oldStates.findById(id);
    if (state) {
      newStates.push(state);
      oldStates = oldStates.remove(state);
    }
  }
  newStates.push(...oldStates);
  return [newStates, newStates.ids()];
}

export const windowsUtils = {
  reorderWindows,
};
