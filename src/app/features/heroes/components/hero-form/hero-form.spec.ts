import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModal, ConfirmModalData } from '../../../../core/components/confirm-modal/confirm-modal';
import { Loading } from '../../../../core/loading/loading';
import { heroSeed } from '../../data/hero.seed';
import { HeroService } from '../../services/hero';
import { Modal } from '../../../../core/modal/modal';
import { HeroForm } from './hero-form';

type ConfirmConfig = { data?: ConfirmModalData };

describe('HeroForm', () => {
  let component: HeroForm;
  let fixture: ComponentFixture<HeroForm>;
  let heroService: HeroService;
  let modal: Modal;
  let loading: Loading;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroForm],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroForm);
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

  it('keeps the form invalid with empty fields', () => {
    expect(component.name.invalid).toBe(true);
    expect(component.realName.invalid).toBe(true);
    expect(component.lastName.invalid).toBe(true);
    expect(component.city.invalid).toBe(true);
  });

  it('rejects whitespace-only values', () => {
    component.name.setValue('   ');
    expect(component.name.invalid).toBe(true);
  });

  it('rejects special characters', () => {
    component.name.setValue('Spider@Man');
    expect(component.name.hasError('pattern')).toBe(true);
  });

  it('accepts letters numbers spaces and hyphens', () => {
    component.name.setValue('Spider-Man 2099');
    component.realName.setValue('el pepe');
    component.lastName.setValue('OHara');
    component.city.setValue('New York');
    expect(component.name.valid).toBe(true);
    expect(component.realName.valid).toBe(true);
    expect(component.lastName.valid).toBe(true);
    expect(component.city.valid).toBe(true);
  });

  it('rejects dots apostrophes and parentheses', () => {
    component.name.setValue('Dr. Strange');
    expect(component.name.hasError('pattern')).toBe(true);
  });

  it('does not create when the form is invalid', () => {
    const create = vi.spyOn(heroService, 'create');
    component.save(new Event('submit'));
    expect(create).not.toHaveBeenCalled();
  });

  it('creates a hero after the loading delay', () => {
    vi.useFakeTimers();
    const before = heroService.getHeroes().length;
    const saved = vi.fn();
    component.saved.subscribe(saved);

    component.name.setValue('Flash');
    component.realName.setValue('Barry');
    component.lastName.setValue('Allen');
    component.city.setValue('Central City');

    component.save(new Event('submit'));
    expect(loading.active()).toBe(true);
    expect(heroService.getHeroes()).toHaveLength(before);

    vi.advanceTimersByTime(1000);

    expect(loading.active()).toBe(false);
    expect(heroService.getHeroes()).toHaveLength(before + 1);
    expect(heroService.getHeroes().at(-1)?.name).toBe('Flash');
    expect(saved).toHaveBeenCalled();
  });

  it('fills the form when editing a hero', () => {
    const hero = heroSeed[3];
    fixture.componentRef.setInput('activeHero', hero);
    fixture.detectChanges();

    expect(component.name.value).toBe(hero.name);
    expect(component.realName.value).toBe(hero.realName);
    expect(component.lastName.value).toBe(hero.lastName);
    expect(component.city.value).toBe(hero.city);
  });

  it('closes without modal when edit has no changes', () => {
    const openModal = vi.spyOn(modal, 'openModal').mockReturnValue({} as never);
    const saved = vi.fn();
    component.saved.subscribe(saved);
    fixture.componentRef.setInput('activeHero', heroSeed[0]);
    fixture.detectChanges();

    component.save(new Event('submit'));

    expect(openModal).not.toHaveBeenCalled();
    expect(saved).toHaveBeenCalled();
  });

  it('opens the confirm modal when saving an edit', () => {
    const openModal = vi.spyOn(modal, 'openModal').mockReturnValue({} as never);
    fixture.componentRef.setInput('activeHero', heroSeed[0]);
    fixture.detectChanges();

    component.name.setValue('Spiderman');
    component.realName.setValue('Peter');
    component.lastName.setValue('Parker');
    component.city.setValue('Queens');
    component.save(new Event('submit'));

    expect(openModal).toHaveBeenCalledWith(
      ConfirmModal,
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Edit hero',
        }),
      }),
    );
  });

  it('closes the modal when edit is cancelled', () => {
    const closeModal = vi.spyOn(modal, 'closeModal').mockImplementation(() => undefined);
    vi.spyOn(modal, 'openModal').mockImplementation((_component, config) => {
      (config as ConfirmConfig | undefined)?.data?.onCancel();
      return {} as never;
    });

    fixture.componentRef.setInput('activeHero', heroSeed[0]);
    fixture.detectChanges();
    component.name.setValue('Spiderman');
    component.realName.setValue('Peter');
    component.lastName.setValue('Parker');
    component.city.setValue('Queens');
    component.save(new Event('submit'));

    expect(closeModal).toHaveBeenCalled();
  });

  it('runs onConfirm from the edit modal', () => {
    vi.useFakeTimers();
    vi.spyOn(modal, 'closeModal').mockImplementation(() => undefined);
    vi.spyOn(modal, 'openModal').mockImplementation((_component, config) => {
      (config as ConfirmConfig | undefined)?.data?.onConfirm();
      return {} as never;
    });

    fixture.componentRef.setInput('activeHero', heroSeed[0]);
    fixture.detectChanges();
    component.name.setValue('Spiderman');
    component.realName.setValue('Peter');
    component.lastName.setValue('Parker');
    component.city.setValue('Queens');
    component.save(new Event('submit'));
    vi.advanceTimersByTime(1000);

    expect(heroService.getHero(1)?.city).toBe('Queens');
  });

  it('rejects values longer than 25 characters', () => {
    component.name.setValue('a'.repeat(26));
    expect(component.name.hasError('maxlength')).toBe(true);
  });

  it('rejects values shorter than 3 characters', () => {
    component.name.setValue('ab');
    expect(component.name.hasError('minlength')).toBe(true);
  });

  it('treats null control values as empty', () => {
    component.name.setValue(null as never);
    expect(component.name.hasError('required')).toBe(true);
  });

  it('submits from the form ngSubmit binding', () => {
    vi.useFakeTimers();
    component.name.setValue('Wasp');
    component.realName.setValue('Hope');
    component.lastName.setValue('van Dyne');
    component.city.setValue('San Francisco');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', new Event('submit'));
    vi.advanceTimersByTime(1000);

    expect(heroService.getHeroes().some((hero) => hero.name === 'Wasp')).toBe(true);
  });

  it('resets the form when activeHero becomes null', () => {
    fixture.componentRef.setInput('activeHero', heroSeed[0]);
    fixture.detectChanges();
    fixture.componentRef.setInput('activeHero', null);
    fixture.detectChanges();
    expect(component.name.value).toBe('');
  });

  it('saves from the submit button click', () => {
    vi.useFakeTimers();
    component.name.setValue('Flash');
    component.realName.setValue('Barry');
    component.lastName.setValue('Allen');
    component.city.setValue('Central City');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement;
    button.click();
    vi.advanceTimersByTime(1000);

    expect(heroService.getHeroes().some((hero) => hero.name === 'Flash')).toBe(true);
  });

  it('cancels from the cancel button click', () => {
    const cancelled = vi.fn();
    component.cancelled.subscribe(cancelled);
    component.name.setValue('Flash');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.btn-secondary') as HTMLButtonElement;
    button.click();

    expect(cancelled).toHaveBeenCalled();
    expect(component.name.value).toBe('');
  });

  it('updates the hero after confirming the edit', () => {
    vi.useFakeTimers();
    const hero = { ...heroSeed[0], name: 'Spider Man' };
    const saved = vi.fn();
    component.saved.subscribe(saved);
    vi.spyOn(modal, 'closeModal').mockImplementation(() => undefined);

    component.triggerConfirmation(hero);
    expect(loading.active()).toBe(true);

    vi.advanceTimersByTime(1000);

    expect(heroService.getHero(1)?.name).toBe('Spider Man');
    expect(loading.active()).toBe(false);
    expect(saved).toHaveBeenCalled();
  });

  it('emits cancelled and resets the form', () => {
    const cancelled = vi.fn();
    component.cancelled.subscribe(cancelled);
    component.name.setValue('Flash');

    component.cancel();

    expect(component.name.value).toBe('');
    expect(cancelled).toHaveBeenCalled();
  });
});
