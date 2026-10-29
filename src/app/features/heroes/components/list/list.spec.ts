import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DrawerShell } from '../../../../core/components/drawer/drawer';
import { provideHeroesHttp } from '../../../../testing/http-providers';
import { HeroForm } from '../hero-form/hero-form';
import { List } from './list';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [List],
      providers: [provideNoopAnimations(), provideRouter([]), provideHeroesHttp()],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders seeded heroes in the table', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Spiderman');
    expect(text).toContain('Superman');
    expect(text).toContain('Manolito el fuerte');
  });

  it('debounces search before updating the term', () => {
    vi.useFakeTimers();
    component.onSearch('Batman');
    expect(component.term()).toBe('');

    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(component.term()).toBe('Batman');
    expect(fixture.nativeElement.textContent).toContain('Batman');
    expect(fixture.nativeElement.textContent).not.toContain('Superman');
  });

  it('opens an empty drawer for create', () => {
    component.open();
    fixture.detectChanges();

    expect(component.opened()).toBe(true);
  });

  it('closes the drawer', () => {
    component.open();
    component.close();
    expect(component.opened()).toBe(false);
  });

  it('opens create from the header button', () => {
    const button = fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(component.opened()).toBe(true);
  });

  it('filters from the search input after debounce', () => {
    vi.useFakeTimers();
    const inputEl = fixture.nativeElement.querySelector('.app-input__control') as HTMLInputElement;
    inputEl.value = 'Batman';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.term()).toBe('');
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(component.term()).toBe('Batman');
    expect(fixture.nativeElement.textContent).toContain('Batman');
  });

  it('closes when the drawer emits closed', () => {
    component.open();
    fixture.detectChanges();
    const drawer = fixture.debugElement.query(By.directive(DrawerShell)).componentInstance as DrawerShell;
    drawer.closed.emit();
    expect(component.opened()).toBe(false);
  });

  it('closes when the form is saved or cancelled', () => {
    component.open();
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.directive(HeroForm)).componentInstance as HeroForm;

    form.saved.emit();
    expect(component.opened()).toBe(false);

    component.open();
    form.cancelled.emit();
    expect(component.opened()).toBe(false);
  });
});
