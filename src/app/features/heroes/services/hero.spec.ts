import { TestBed } from '@angular/core/testing';
import { heroSeed } from '../data/hero.seed';
import { Hero } from '../models/hero.model';
import { HeroService } from './hero';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroService);
  });

  describe('getHeroes', () => {
    it('returns the seeded heroes', () => {
      expect(service.getHeroes()).toEqual(heroSeed);
    });

    it('reflects changes after create', () => {
      const before = service.getHeroes().length;
      service.create({
        name: 'Flash',
        realName: 'Barry',
        lastName: 'Allen',
        city: 'Central City',
      });
      expect(service.getHeroes()).toHaveLength(before + 1);
    });
  });

  describe('getHero', () => {
    it('returns one hero by id', () => {
      expect(service.getHero(1)).toEqual(heroSeed[0]);
    });

    it('returns undefined when the id does not exist', () => {
      expect(service.getHero(99)).toBeUndefined();
    });
  });

  describe('searchHeroes', () => {
    it('returns heroes whose name contains the term', () => {
      expect(service.searchHeroes('man').map((hero) => hero.name)).toEqual([
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
      expect(service.searchHeroes('Peter').map((hero) => hero.name)).toEqual(['Spiderman']);
      expect(service.searchHeroes('Parker').map((hero) => hero.name)).toEqual(['Spiderman']);
      expect(service.searchHeroes('Gotham').map((hero) => hero.name)).toEqual(['Batman']);
    });

    it('matches the search without caring about case', () => {
      expect(service.searchHeroes('MAN').map((hero) => hero.name)).toEqual([
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
      expect(service.searchHeroes('test string')).toEqual([]);
    });

    it('returns all heroes when the term is empty', () => {
      expect(service.searchHeroes('')).toEqual(service.getHeroes());
      expect(service.searchHeroes('   ')).toEqual(service.getHeroes());
    });
  });

  describe('create', () => {
    it('registers a hero with the next id and trimmed fields', () => {
      const created = service.create({
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
      expect(service.getHeroes().at(-1)).toEqual(created);
    });

    it('assigns sequential ids on multiple creates', () => {
      const first = service.create({
        name: 'Flash',
        realName: 'Barry',
        lastName: 'Allen',
        city: 'Central City',
      });
      const second = service.create({
        name: 'Green Lantern',
        realName: 'Hal',
        lastName: 'Jordan',
        city: 'Coast City',
      });

      expect(second.id).toBe(first.id + 1);
      expect(service.getHero(first.id)).toEqual(first);
      expect(service.getHero(second.id)).toEqual(second);
    });
  });

  describe('updateHero', () => {
    it('updates the hero that matches the id', () => {
      service.updateHero({
        id: 1,
        name: 'Spider-Man',
        realName: 'Peter',
        lastName: 'Parker',
        city: 'Queens',
      });

      expect(service.getHero(1)).toEqual({
        id: 1,
        name: 'Spider-Man',
        realName: 'Peter',
        lastName: 'Parker',
        city: 'Queens',
      });
      expect(service.getHeroes()).toHaveLength(heroSeed.length);
    });

    it('does not change other heroes', () => {
      const before = service.getHero(2);
      service.updateHero({
        id: 1,
        name: 'Spider-Man',
        realName: 'Peter',
        lastName: 'Parker',
        city: 'Queens',
      });
      expect(service.getHero(2)).toEqual(before);
    });

    it('leaves the list unchanged when the id does not exist', () => {
      const missing: Hero = {
        id: 999,
        name: 'Ghost',
        realName: 'No',
        lastName: 'One',
        city: 'Nowhere',
      };
      service.updateHero(missing);
      expect(service.getHero(999)).toBeUndefined();
      expect(service.getHeroes()).toHaveLength(heroSeed.length);
    });
  });

  describe('deleteHero', () => {
    it('removes the hero by id', () => {
      service.deleteHero(2);

      expect(service.getHero(2)).toBeUndefined();
      expect(service.getHeroes().map((hero) => hero.id)).not.toContain(2);
      expect(service.getHeroes()).toHaveLength(heroSeed.length - 1);
    });

    it('does nothing when the id does not exist', () => {
      service.deleteHero(999);
      expect(service.getHeroes()).toHaveLength(heroSeed.length);
    });
  });
});
