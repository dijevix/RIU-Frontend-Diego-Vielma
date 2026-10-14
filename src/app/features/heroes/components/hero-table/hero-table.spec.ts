import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModal, ConfirmModalData } from '../../../../core/components/confirm-modal/confirm-modal';
import { Loading } from '../../../../core/loading/loading';
import { heroSeed } from '../../data/hero.seed';
import { HeroService } from '../../services/hero';
import { Modal } from '../../services/modal';
import { HeroTable } from './hero-table';

type ConfirmConfig = { data?: ConfirmModalData };

describe('HeroTable', () => {
  let component: HeroTable;
  let fixture: ComponentFixture<HeroTable>;
  let heroService: HeroService;
  let modal: Modal;
  let loading: Loading;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroTable],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroTable);
    component = fixture.componentInstance;
    heroService = TestBed.inject(HeroService);
    modal = TestBed.inject(Modal);
    loading = TestBed.inject(Loading);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the first page of heroes', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Spiderman');
    expect(text).toContain('Hawkeye');
    expect(text).not.toContain('Black Panther');
  });

  it('filters heroes by term', () => {
    fixture.componentRef.setInput('term', 'man');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Spiderman');
    expect(text).toContain('Superman');
    expect(text).not.toContain('Thor');
  });

  it('resets to page 0 when the term changes', () => {
    component['onPage']({ pageIndex: 1, pageSize: 10, length: 20 } as never);
    fixture.componentRef.setInput('term', 'Spider');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Spiderman');
  });

  it('emits openDrawer when editing', () => {
    const emitted = vi.fn();
    component.openDrawer.subscribe(emitted);

    component['edit'](heroSeed[0]);

    expect(emitted).toHaveBeenCalledWith(heroSeed[0]);
  });

  it('opens the confirm modal when removing', () => {
    const openModal = vi.spyOn(modal, 'openModal').mockReturnValue({} as never);

    component['remove'](heroSeed[1]);

    expect(openModal).toHaveBeenCalledWith(
      ConfirmModal,
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Delete hero',
        }),
      }),
    );
  });

  it('closes the modal when remove is cancelled', () => {
    const closeModal = vi.spyOn(modal, 'closeModal').mockImplementation(() => undefined);
    vi.spyOn(modal, 'openModal').mockImplementation((_component, config) => {
      (config as ConfirmConfig | undefined)?.data?.onCancel();
      return {} as never;
    });

    component['remove'](heroSeed[1]);
    expect(closeModal).toHaveBeenCalled();
  });

  it('runs onConfirm from the remove modal', () => {
    vi.useFakeTimers();
    vi.spyOn(modal, 'closeModal').mockImplementation(() => undefined);
    vi.spyOn(modal, 'openModal').mockImplementation((_component, config) => {
      (config as ConfirmConfig | undefined)?.data?.onConfirm();
      return {} as never;
    });

    component['remove'](heroSeed[1]);
    vi.advanceTimersByTime(1000);

    expect(heroService.getHero(2)).toBeUndefined();
  });

  it('deletes the hero after confirming remove', () => {
    vi.useFakeTimers();
    vi.spyOn(modal, 'closeModal').mockImplementation(() => undefined);
    const before = heroService.getHeroes().length;

    component['onConfirmRemoving'](heroSeed[1]);
    expect(loading.active()).toBe(true);

    vi.advanceTimersByTime(1000);

    expect(heroService.getHero(2)).toBeUndefined();
    expect(heroService.getHeroes()).toHaveLength(before - 1);
    expect(loading.active()).toBe(false);
  });

  it('edits and removes from the kebab menu', () => {
    const emitted = vi.fn();
    component.openDrawer.subscribe(emitted);
    const openModal = vi.spyOn(modal, 'openModal').mockReturnValue({} as never);

    const trigger = fixture.nativeElement.querySelector('button[mat-icon-button]') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const menuButtons = document.querySelectorAll('button[mat-menu-item]');
    (menuButtons[0] as HTMLButtonElement).click();
    expect(emitted).toHaveBeenCalled();

    trigger.click();
    fixture.detectChanges();
    const menuButtonsAgain = document.querySelectorAll('button[mat-menu-item]');
    (menuButtonsAgain[1] as HTMLButtonElement).click();
    expect(openModal).toHaveBeenCalled();
  });

  it('routes kebab actions', () => {
    const emitted = vi.fn();
    component.openDrawer.subscribe(emitted);
    const openModal = vi.spyOn(modal, 'openModal').mockReturnValue({} as never);

    component['onAction']('edit', heroSeed[0]);
    expect(emitted).toHaveBeenCalledWith(heroSeed[0]);

    component['onAction']('remove', heroSeed[1]);
    expect(openModal).toHaveBeenCalled();

    component['onAction']('unknown', heroSeed[0]);
    expect(emitted).toHaveBeenCalledTimes(1);
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('changes page from the paginator', () => {
    component['onPage']({ pageIndex: 1, pageSize: 10, length: 20 } as never);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Black Panther');
    expect(text).not.toContain('Spiderman');
  });

  it('handles the paginator page event from the template', () => {
    fixture.debugElement
      .query(By.css('mat-paginator'))
      .triggerEventHandler('page', { pageIndex: 1, pageSize: 10, length: 20 });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Black Panther');
  });
});
