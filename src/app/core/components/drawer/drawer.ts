import { Component, input, output } from '@angular/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';

@Component({
  imports: [MatDrawerContainer, MatDrawer, MatDrawerContent],
  selector: 'app-drawer-shell',
  styleUrl: './drawer.scss',
  templateUrl: './drawer.html',
})
export class DrawerShell {
  readonly opened = input(false);
  readonly title = input('');
  readonly closed = output<void>();

  close(): void {
    this.closed.emit();
  }
}
