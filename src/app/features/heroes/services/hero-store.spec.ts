import { TestBed } from '@angular/core/testing';
import { heroSeed } from '../data/hero.seed';
import { Hero } from '../models/hero.model';
import { HeroStore } from './hero-store';

describe('HeroStore', () => {
  let store: HeroStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(HeroStore);
  });

  describe('getHeroes', () => {
    it('returns the seeded heroes', () => {
      expect(store.getHeroes()).toEqual(heroSeed);
    });

    it('reflects changes after add', () => {
      const before = store.getHeroes().length;
      store.add({
        name: 'Flash',
        realName: 'Barry',
        lastName: 'Allen',
        city: 'Central City',
      });
      expect(store.getHeroes()).toHaveLength(before + 1);
    });
  });

  describe('getHero', () => {
    it('returns one hero by id', () => {
      expect(store.getHero(1)).toEqual(heroSeed[0]);
    });

    it('returns undefined when the id does not exist', () => {
      expect(store.getHero(99)).toBeUndefined();
    });
  });

  describe('searchHeroes', () => {
    it('returns heroes whose name contains the term', () => {
      expect(store.searchHeroes('man').map((hero) => hero.name)).toEqual([
        'Spiderman',
        'Superman',
        'Manolito el fuerte',
        'Batman',
        'Ironman',
        'Black Widow',
        'Ant-Man',
        'Spider-Man 2099',
      ]);
    });

    it('matches real name last name or city', () => {
      expect(store.searchHeroes('Peter').map((hero) => hero.name)).toEqual(['Spiderman']);
      expect(store.searchHeroes('Parker').map((hero) => hero.name)).toEqual(['Spiderman']);
      expect(store.searchHeroes('Gotham').map((hero) => hero.name)).toEqual(['Batman']);
    });

    it('matches the search without caring about case', () => {
      expect(store.searchHeroes('MAN').map((hero) => hero.name)).toEqual([
        'Spiderman',
        'Superman',
        'Manolito el fuerte',
        'Batman',
        'Ironman',
        'Black Widow',
        'Ant-Man',
        'Spider-Man 2099',
      ]);
    });

    it('returns an empty list when nothing matches', () => {
      expect(store.searchHeroes('test string')).toEqual([]);
    });

    it('returns all heroes when the term is empty', () => {
      expect(store.searchHeroes('')).toEqual(store.getHeroes());
      expect(store.searchHeroes('   ')).toEqual(store.getHeroes());
    });
  });

  describe('add', () => {
    it('registers a hero with the next id and trimmed fields', () => {
      const created = store.add({
        name: '  Batman Beyond  ',
        realName: '  Terry  ',
        lastName: '  McGinnis  ',
        city: '  Gotham  ',
      });

      expect(created).toEqual({
        id: heroSeed.length + 1,
        name: 'Batman Beyond',
        realName: 'Terry',
        lastName: 'McGinnis',
        city: 'Gotham',
      });
      expect(store.getHeroes().at(-1)).toEqual(created);
    });

    it('assigns sequential ids on multiple creates', () => {
      const first = store.add({
        name: 'Flash',
        realName: 'Barry',
        lastName: 'Allen',
        city: 'Central City',
      });
      const second = store.add({
        name: 'Green Lantern',
        realName: 'Hal',
        lastName: 'Jordan',
        city: 'Coast City',
      });

      expect(second.id).toBe(first.id + 1);
      expect(store.getHero(first.id)).toEqual(first);
      expect(store.getHero(second.id)).toEqual(second);
    });
  });

  describe('replace', () => {
    it('updates the hero that matches the id', () => {
      store.replace({
        id: 1,
        name: 'Spider-Man',
        realName: 'Peter',
        lastName: 'Parker',
        city: 'Queens',
      });

      expect(store.getHero(1)).toEqual({
        id: 1,
        name: 'Spider-Man',
        realName: 'Peter',
        lastName: 'Parker',
        city: 'Queens',
      });
      expect(store.getHeroes()).toHaveLength(heroSeed.length);
    });

    it('does not change other heroes', () => {
      const before = store.getHero(2);
      store.replace({
        id: 1,
        name: 'Spider-Man',
        realName: 'Peter',
        lastName: 'Parker',
        city: 'Queens',
      });
      expect(store.getHero(2)).toEqual(before);
    });

    it('leaves the list unchanged when the id does not exist', () => {
      const missing: Hero = {
        id: 999,
        name: 'Ghost',
        realName: 'No',
        lastName: 'One',
        city: 'Nowhere',
      };
      store.replace(missing);
      expect(store.getHero(999)).toBeUndefined();
      expect(store.getHeroes()).toHaveLength(heroSeed.length);
    });
  });

  describe('remove', () => {
    it('removes the hero by id', () => {
      store.remove(2);

      expect(store.getHero(2)).toBeUndefined();
      expect(store.getHeroes().map((hero) => hero.id)).not.toContain(2);
      expect(store.getHeroes()).toHaveLength(heroSeed.length - 1);
    });

    it('does nothing when the id does not exist', () => {
      store.remove(999);
      expect(store.getHeroes()).toHaveLength(heroSeed.length);
    });
  });
});
