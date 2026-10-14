import { Service, signal } from '@angular/core';

@Service()
export class Loading {
  readonly active = signal(false);

  show(): void {
    this.active.set(true);
  }

  hide(): void {
    this.active.set(false);
  }
}
