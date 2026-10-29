import { TestBed } from '@angular/core/testing';
import { provideHeroesHttp } from '../../../testing/http-providers';
import { Loading } from '../../../core/loading/loading';
import { heroSeed } from '../data/hero.seed';
import { HeroService } from './hero';
import { HeroStore } from './hero-store';

describe('HeroService', () => {
  let service: HeroService;
  let store: HeroStore;
  let loading: Loading;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHeroesHttp()],
    });
    service = TestBed.inject(HeroService);
    store = TestBed.inject(HeroStore);
    loading = TestBed.inject(Loading);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('reads heroes from the store', () => {
    expect(service.getHeroes()).toEqual(store.getHeroes());
    expect(service.getHero(1)).toEqual(heroSeed[0]);
    expect(service.searchHeroes('Gotham').map((hero) => hero.name)).toEqual(['Batman']);
  });

  it('creates a hero through http after the loading delay', () => {
    vi.useFakeTimers();
    const before = store.getHeroes().length;
    let createdName = '';

    service
      .create({
        name: 'Flash',
        realName: 'Barry',
        lastName: 'Allen',
        city: 'Central City',
      })
      .subscribe((hero) => {
        createdName = hero.name;
      });

    expect(loading.active()).toBe(true);
    expect(store.getHeroes()).toHaveLength(before);

    vi.advanceTimersByTime(1000);

    expect(loading.active()).toBe(false);
    expect(createdName).toBe('Flash');
    expect(store.getHeroes()).toHaveLength(before + 1);
  });

  it('updates a hero through http after the loading delay', () => {
    vi.useFakeTimers();

    service
      .updateHero({
        id: 1,
        name: 'Spider-Man',
        realName: 'Peter',
        lastName: 'Parker',
        city: 'Queens',
      })
      .subscribe();

    expect(loading.active()).toBe(true);
    vi.advanceTimersByTime(1000);

    expect(loading.active()).toBe(false);
    expect(store.getHero(1)?.city).toBe('Queens');
  });

  it('deletes a hero through http after the loading delay', () => {
    vi.useFakeTimers();
    const before = store.getHeroes().length;

    service.deleteHero(2).subscribe();

    expect(loading.active()).toBe(true);
    vi.advanceTimersByTime(1000);

    expect(loading.active()).toBe(false);
    expect(store.getHero(2)).toBeUndefined();
    expect(store.getHeroes()).toHaveLength(before - 1);
  });
});
