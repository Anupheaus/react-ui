import { Records, bind } from '@anupheaus/common';
import { ReactNode } from 'react';

const dialogManagers = new Map<string, DialogsManager>();

interface DialogState {
  id: string;
  content: ReactNode;
}

export class DialogsManager {
  private constructor() {
    this.#dialogs = new Records();
  }

  #dialogs: Records<DialogState>;

  @bind
  public static get(id: string) {
    const existingManager = dialogManagers.get(id);
    if (existingManager) return existingManager;
    const newManager = new DialogsManager();
    dialogManagers.set(id, newManager);
    return newManager;
  }

  @bind
  public save(id: string, content: ReactNode) {
    this.#dialogs.upsert({ id, content });
  }

  @bind
  public subscribeTo(id: string, callback: (content: ReactNode) => void) {
    return this.#dialogs.onModified(dialogs => {
      const dialogState = dialogs.findById(id);
      if (!dialogState) return;
      callback(dialogState.content);
    });
  }

  @bind
  public get(id: string): ReactNode {
    return this.#dialogs.get(id)?.content ?? null;
  }

  @bind
  public remove(id: string) {
    this.#dialogs.remove(id);
  }
}