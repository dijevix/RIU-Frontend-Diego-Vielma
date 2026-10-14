import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawerShell } from '../../../../core/components/drawer/drawer';
import { heroSeed } from '../../data/hero.seed';
import { HeroForm } from '../hero-form/hero-form';
import { HeroTable } from '../hero-table/hero-table';
import { List } from './list';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [List],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('filters the table when searching by name', () => {
    component.onSearch('Batman');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Batman');
    expect(text).not.toContain('Superman');
  });

  it('opens an empty drawer for create', () => {
    component.open();
    fixture.detectChanges();

    expect(component.opened()).toBe(true);
    expect(component.activeHero()).toBeNull();
  });

  it('opens the drawer with the hero to edit', () => {
    const hero = heroSeed[0];
    component.openDrawerEdition(hero);
    fixture.detectChanges();

    expect(component.opened()).toBe(true);
    expect(component.activeHero()).toEqual(hero);
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
    expect(component.activeHero()).toBeNull();
  });

  it('handles a nullish hero on edition', () => {
    component.openDrawerEdition(null as never);
    expect(component.activeHero()).toBeNull();
    expect(component.opened()).toBe(true);
  });

  it('filters from the search input', () => {
    const inputEl = fixture.nativeElement.querySelector('.app-input__control') as HTMLInputElement;
    inputEl.value = 'Batman';
    inputEl.dispatchEvent(new Event('input'));
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

  it('opens edition when the table emits openDrawer', () => {
    const table = fixture.debugElement.query(By.directive(HeroTable)).componentInstance as HeroTable;
    table.openDrawer.emit(heroSeed[0]);
    fixture.detectChanges();

    expect(component.opened()).toBe(true);
    expect(component.activeHero()).toEqual(heroSeed[0]);
  });
});
