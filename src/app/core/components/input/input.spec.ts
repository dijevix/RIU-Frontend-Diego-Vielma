import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Input } from './input';

describe('Input', () => {
  let fixture: ComponentFixture<Input>;
  let component: Input;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Input],
    }).compileComponents();

    fixture = TestBed.createComponent(Input);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the label when provided', () => {
    fixture.componentRef.setInput('label', 'Nombre');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nombre');
  });

  it('renders the prefix icon when provided', () => {
    fixture.componentRef.setInput('prefix', 'search');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.app-input__icon')).toBeTruthy();
  });

  it('updates the value model on input', () => {
    const inputEl = fixture.nativeElement.querySelector('.app-input__control') as HTMLInputElement;
    inputEl.value = 'Batman';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.value()).toBe('Batman');
  });
});
