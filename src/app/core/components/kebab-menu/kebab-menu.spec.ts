import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KebabMenu } from './kebab-menu';

describe('KebabMenu', () => {
  let fixture: ComponentFixture<KebabMenu>;
  let component: KebabMenu;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KebabMenu],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(KebabMenu);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', [
      { id: 'edit', label: 'Edit' },
      { id: 'remove', label: 'Delete' },
    ]);
    fixture.componentRef.setInput('ariaLabel', 'Actions for Batman');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the trigger with aria label', () => {
    const trigger = fixture.nativeElement.querySelector('button[mat-icon-button]') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-label')).toBe('Actions for Batman');
  });

  it('emits the selected action id', () => {
    const action = vi.fn();
    component.action.subscribe(action);

    const trigger = fixture.nativeElement.querySelector('button[mat-icon-button]') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const items = document.querySelectorAll('button[mat-menu-item]');
    (items[0] as HTMLButtonElement).click();
    expect(action).toHaveBeenCalledWith('edit');

    trigger.click();
    fixture.detectChanges();
    const itemsAgain = document.querySelectorAll('button[mat-menu-item]');
    (itemsAgain[1] as HTMLButtonElement).click();
    expect(action).toHaveBeenCalledWith('remove');
  });

  it('emits from onSelect', () => {
    const action = vi.fn();
    component.action.subscribe(action);
    component['onSelect']('edit');
    expect(action).toHaveBeenCalledWith('edit');
  });
});
