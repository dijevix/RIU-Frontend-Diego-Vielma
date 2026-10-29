import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders } from '@angular/core';
import { loadingInterceptor } from '../core/loading/loading.interceptor';
import { heroesApiInterceptor } from '../features/heroes/interceptors/heroes-api.interceptor';

export const provideHeroesHttp = (): EnvironmentProviders =>
  provideHttpClient(withInterceptors([loadingInterceptor, heroesApiInterceptor]));
