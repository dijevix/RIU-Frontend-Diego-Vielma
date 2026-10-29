import { PATTERNS } from '../../../core/common/constants/patterns';
import { CreateHero, Hero } from '../models/hero.model';

export type HeroFields = CreateHero;

export const emptyHero = (): HeroFields => ({
  name: '',
  realName: '',
  lastName: '',
  city: '',
});

export const fromHero = (hero: Hero): HeroFields => ({
  name: hero.name,
  realName: hero.realName,
  lastName: hero.lastName,
  city: hero.city,
});

const fieldError = (kind: string) => ({ kind, message: '3–25 chars. Letters, numbers, spaces or hyphens only.' });

export const validateHeroText = (value: string | undefined) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return fieldError('required');
  if (trimmed.length < 3) return fieldError('minlength');
  if (trimmed.length > 25) return fieldError('maxlength');
  if (!PATTERNS.heroText.test(trimmed)) return fieldError('pattern');
  return undefined;
};
