import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ConfirmModal, ConfirmModalData } from '../../../../core/components/confirm-modal/confirm-modal';
import { provideHeroesHttp } from '../../../../testing/http-providers';
import { heroSeed } from '../../data/hero.seed';
import { HeroService } from '../../services/hero';
import { Modal } from '../../../../core/modal/modal';
import { HeroDetail } from './hero-detail';

type ConfirmConfig = { data?: ConfirmModalData };

describe('HeroDetail', () => {
  let fixture: ComponentFixture<HeroDetail>;
  let component: HeroDetail;
  let modal: Modal;
  let router: Router;
  let heroService: HeroService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDetail],
      providers: [provideNoopAnimations(), provideRouter([]), provideHeroesHttp()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetail);
    component = fixture.componentInstance;
    modal = TestBed.inject(Modal);
    router = TestBed.inject(Router);
    heroService = TestBed.inject(HeroService);
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the hero fields', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Spiderman');
    expect(text).toContain('Peter');
    expect(text).toContain('Parker');
    expect(text).toContain('New York');
  });

  it('shows empty state for an unknown id', () => {
    fixture.componentRef.setInput('id', '999');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Hero not found');
  });

  it('enters edit mode', () => {
    const edit = [...fixture.nativeElement.querySelectorAll('button')].find((button: HTMLButtonElement) =>
      /edit/i.test(button.textContent ?? ''),
    ) as HTMLButtonElement;
    edit.click();
    fixture.detectChanges();

    expect(component.editing()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Edit hero');
    expect(fixture.nativeElement.querySelector('app-hero-form')).toBeTruthy();
  });

  it('opens the delete confirm modal', () => {
    const openModal = vi.spyOn(modal, 'openModal').mockReturnValue({} as never);
    component.remove(heroSeed[0]);
    expect(openModal).toHaveBeenCalledWith(
      ConfirmModal,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Delete hero' }),
      }),
    );
  });

  it('deletes and navigates back to the list', () => {
    vi.useFakeTimers();
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    vi.spyOn(modal, 'closeModal').mockImplementation(() => undefined);
    vi.spyOn(modal, 'openModal').mockImplementation((_component, conf) => {
      (conf as ConfirmConfig | undefined)?.data?.onConfirm();
      return {} as never;
    });

    component.remove(heroSeed[0]);
    vi.advanceTimersByTime(1000);

    expect(heroService.getHero(1)).toBeUndefined();
    expect(navigate).toHaveBeenCalledWith(['/heroes']);
  });
});
