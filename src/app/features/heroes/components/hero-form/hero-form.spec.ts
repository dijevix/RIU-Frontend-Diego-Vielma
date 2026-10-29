import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModal, ConfirmModalData } from '../../../../core/components/confirm-modal/confirm-modal';
import { Loading } from '../../../../core/loading/loading';
import { provideHeroesHttp } from '../../../../testing/http-providers';
import { heroSeed } from '../../data/hero.seed';
import { HeroService } from '../../services/hero';
import { Modal } from '../../../../core/modal/modal';
import { HeroForm } from './hero-form';

type ConfirmConfig = { data?: ConfirmModalData };

const fillValid = (component: HeroForm) => {
  component.heroForm.name().value.set('FLASH');
  component.heroForm.realName().value.set('BARRY');
  component.heroForm.lastName().value.set('ALLEN');
  component.heroForm.city().value.set('CENTRAL CITY');
};

describe('HeroForm', () => {
  let component: HeroForm;
  let fixture: ComponentFixture<HeroForm>;
  let heroService: HeroService;
  let modal: Modal;
  let loading: Loading;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroForm],
      providers: [provideNoopAnimations(), provideHeroesHttp()],
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
    expect(component.heroForm.name().invalid()).toBe(true);
    expect(component.heroForm.realName().invalid()).toBe(true);
    expect(component.heroForm.lastName().invalid()).toBe(true);
    expect(component.heroForm.city().invalid()).toBe(true);
  });

  it('rejects whitespace-only values', () => {
    component.heroForm.name().value.set('   ');
    expect(component.heroForm.name().invalid()).toBe(true);
  });

  it('rejects special characters', () => {
    component.heroForm.name().value.set('Spider@Man');
    expect(component.heroForm.name().errors().some((error) => error.kind === 'pattern')).toBe(true);
  });

  it('accepts letters numbers spaces and hyphens', () => {
    component.heroForm.name().value.set('Spider-Man 2099');
    component.heroForm.realName().value.set('el pepe');
    component.heroForm.lastName().value.set('OHara');
    component.heroForm.city().value.set('New York');
    expect(component.heroForm.name().valid()).toBe(true);
    expect(component.heroForm.realName().valid()).toBe(true);
    expect(component.heroForm.lastName().valid()).toBe(true);
    expect(component.heroForm.city().valid()).toBe(true);
  });

  it('rejects dots apostrophes and parentheses', () => {
    component.heroForm.name().value.set('Dr. Strange');
    expect(component.heroForm.name().errors().some((error) => error.kind === 'pattern')).toBe(true);
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

    fillValid(component);
    component.save(new Event('submit'));
    expect(loading.active()).toBe(true);
    expect(heroService.getHeroes()).toHaveLength(before);

    vi.advanceTimersByTime(1000);

    expect(loading.active()).toBe(false);
    expect(heroService.getHeroes()).toHaveLength(before + 1);
    expect(heroService.getHeroes().at(-1)?.name).toBe('FLASH');
    expect(saved).toHaveBeenCalled();
  });

  it('fills the form when editing a hero', () => {
    const hero = heroSeed[3];
    fixture.componentRef.setInput('activeHero', hero);
    fixture.detectChanges();

    expect(component.heroForm.name().value()).toBe(hero.name);
    expect(component.heroForm.realName().value()).toBe(hero.realName);
    expect(component.heroForm.lastName().value()).toBe(hero.lastName);
    expect(component.heroForm.city().value()).toBe(hero.city);
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

    component.heroForm.name().value.set('SPIDERMAN');
    component.heroForm.realName().value.set('PETER');
    component.heroForm.lastName().value.set('PARKER');
    component.heroForm.city().value.set('QUEENS');
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
    component.heroForm.name().value.set('SPIDERMAN');
    component.heroForm.realName().value.set('PETER');
    component.heroForm.lastName().value.set('PARKER');
    component.heroForm.city().value.set('QUEENS');
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
    component.heroForm.name().value.set('SPIDERMAN');
    component.heroForm.realName().value.set('PETER');
    component.heroForm.lastName().value.set('PARKER');
    component.heroForm.city().value.set('QUEENS');
    component.save(new Event('submit'));
    vi.advanceTimersByTime(1000);

    expect(heroService.getHero(1)?.city).toBe('QUEENS');
  });

  it('rejects values longer than 25 characters', () => {
    component.heroForm.name().value.set('a'.repeat(26));
    expect(component.heroForm.name().errors().some((error) => error.kind === 'maxlength')).toBe(true);
  });

  it('rejects values shorter than 3 characters', () => {
    component.heroForm.name().value.set('ab');
    expect(component.heroForm.name().errors().some((error) => error.kind === 'minlength')).toBe(true);
  });

  it('treats empty control values as required', () => {
    component.heroForm.name().value.set('');
    expect(component.heroForm.name().errors().some((error) => error.kind === 'required')).toBe(true);
  });

  it('submits from the form ngSubmit binding', () => {
    vi.useFakeTimers();
    component.heroForm.name().value.set('WASP');
    component.heroForm.realName().value.set('HOPE');
    component.heroForm.lastName().value.set('VAN DYNE');
    component.heroForm.city().value.set('SAN FRANCISCO');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', new Event('submit'));
    vi.advanceTimersByTime(1000);

    expect(heroService.getHeroes().some((hero) => hero.name === 'WASP')).toBe(true);
  });

  it('resets the form when activeHero becomes null', () => {
    fixture.componentRef.setInput('activeHero', heroSeed[0]);
    fixture.detectChanges();
    fixture.componentRef.setInput('activeHero', null);
    fixture.detectChanges();
    expect(component.heroForm.name().value()).toBe('');
  });

  it('saves from the submit button click', () => {
    vi.useFakeTimers();
    fillValid(component);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement;
    button.click();
    vi.advanceTimersByTime(1000);

    expect(heroService.getHeroes().some((hero) => hero.name === 'FLASH')).toBe(true);
  });

  it('cancels from the cancel button click', () => {
    const cancelled = vi.fn();
    component.cancelled.subscribe(cancelled);
    component.heroForm.name().value.set('FLASH');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.btn-secondary') as HTMLButtonElement;
    button.click();

    expect(cancelled).toHaveBeenCalled();
    expect(component.heroForm.name().value()).toBe('');
  });

  it('updates the hero after confirming the edit', () => {
    vi.useFakeTimers();
    const hero = { ...heroSeed[0], name: 'SPIDER MAN' };
    const saved = vi.fn();
    component.saved.subscribe(saved);
    vi.spyOn(modal, 'closeModal').mockImplementation(() => undefined);

    component.triggerConfirmation(hero);
    expect(loading.active()).toBe(true);

    vi.advanceTimersByTime(1000);

    expect(heroService.getHero(1)?.name).toBe('SPIDER MAN');
    expect(loading.active()).toBe(false);
    expect(saved).toHaveBeenCalled();
  });

  it('emits cancelled and resets the form', () => {
    const cancelled = vi.fn();
    component.cancelled.subscribe(cancelled);
    component.heroForm.name().value.set('FLASH');

    component.cancel();

    expect(component.heroForm.name().value()).toBe('');
    expect(cancelled).toHaveBeenCalled();
  });
});
