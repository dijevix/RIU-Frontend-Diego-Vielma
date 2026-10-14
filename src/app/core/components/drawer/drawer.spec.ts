import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawerShell } from './drawer';

describe('DrawerShell', () => {
  let component: DrawerShell;
  let fixture: ComponentFixture<DrawerShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerShell],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerShell);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'New hero');
    fixture.componentRef.setInput('opened', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the title', () => {
    expect(fixture.nativeElement.textContent).toContain('New hero');
  });

  it('emits closed when close is called', () => {
    const closed = vi.fn();
    component.closed.subscribe(closed);
    component.close();
    expect(closed).toHaveBeenCalled();
  });

  it('emits closed when the drawer fires closedStart', () => {
    const closed = vi.fn();
    component.closed.subscribe(closed);
    fixture.debugElement.query(By.css('mat-drawer')).triggerEventHandler('closedStart', {});
    expect(closed).toHaveBeenCalled();
  });
});
