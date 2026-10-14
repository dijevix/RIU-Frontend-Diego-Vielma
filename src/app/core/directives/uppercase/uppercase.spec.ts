import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Uppercase } from './uppercase';

@Component({
  imports: [ReactiveFormsModule, Uppercase],
  template: `<input appUppercase [formControl]="name" />`,
})
class HostWithControl {
  readonly name = new FormControl('', { nonNullable: true });
}

@Component({
  imports: [Uppercase],
  template: `<input appUppercase />`,
})
class HostWithoutControl {}

describe('Uppercase', () => {
  describe('with form control', () => {
    let fixture: ComponentFixture<HostWithControl>;
    let input: HTMLInputElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HostWithControl],
      }).compileComponents();

      fixture = TestBed.createComponent(HostWithControl);
      fixture.detectChanges();
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('uppercases typed value and syncs the control', () => {
      input.value = 'spiderman';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('SPIDERMAN');
      expect(fixture.componentInstance.name.value).toBe('SPIDERMAN');
    });

    it('keeps value when it is already uppercase', () => {
      input.value = 'FLASH';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('FLASH');
      expect(fixture.componentInstance.name.value).toBe('FLASH');
    });
  });

  describe('without form control', () => {
    it('uppercases the native input value', async () => {
      await TestBed.configureTestingModule({
        imports: [HostWithoutControl],
      }).compileComponents();

      const fixture = TestBed.createComponent(HostWithoutControl);
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;

      input.value = 'batman';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('BATMAN');
    });
  });
});
