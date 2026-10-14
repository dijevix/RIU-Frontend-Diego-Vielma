import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

export interface ConfirmModalData {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

@Component({
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule],
  selector: 'app-confirm-modal',
  styleUrl: './confirm-modal.scss',
  templateUrl: './confirm-modal.html',
})
export class ConfirmModal {
  protected readonly data = inject<ConfirmModalData>(MAT_DIALOG_DATA);
}
