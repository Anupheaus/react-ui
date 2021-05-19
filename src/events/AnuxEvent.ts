export class AnuxEvent {
  constructor() {
    this.#canBubble = true;
  }

  #canBubble: boolean;

  public get canBubble() { return this.#canBubble; }

  public stopPropagation(): void {
    this.#canBubble = false;
  }

}