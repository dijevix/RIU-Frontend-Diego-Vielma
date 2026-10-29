import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FORM_FIELD } from '@angular/forms/signals';

@Directive({
  selector: 'input[appUppercase]',
})
export class Uppercase {
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly formField = inject(FORM_FIELD, { optional: true, self: true });

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const upper = input.value.toUpperCase();
    if (input.value === upper) {
      return;
    }
    input.value = upper;
    input.setSelectionRange(start, end);
    if (this.formField) {
      this.formField.state().value.set(upper);
      return;
    }
    const control = this.ngControl?.control;
    if (control && typeof control.setValue === 'function') {
      control.setValue(upper, { emitEvent: false });
    }
  }
}
