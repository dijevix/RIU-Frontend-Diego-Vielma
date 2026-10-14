export interface Hero {
  id: number;
  name: string;
  realName: string;
  lastName: string;
  city: string;
}

export type CreateHero = Omit<Hero, 'id'>;
