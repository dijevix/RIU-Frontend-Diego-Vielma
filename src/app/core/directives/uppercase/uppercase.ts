import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[appUppercase]',
})
export class Uppercase {
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

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
    this.ngControl?.control?.setValue(upper, { emitEvent: false });
  }
}
