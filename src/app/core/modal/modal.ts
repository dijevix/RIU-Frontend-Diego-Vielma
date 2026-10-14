import { ComponentType } from '@angular/cdk/overlay';
import { inject, Service } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Service()
export class Modal {
  private readonly _dialog = inject(MatDialog);

  openModal<T, k>(component: ComponentType<T>, config?: MatDialogConfig<k>): MatDialogRef<T> {
    return this._dialog.open(component, config);
  }

  closeModal(): void {
    this._dialog.closeAll();
  }
}
