import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideHeroesHttp } from '../../testing/http-providers';
import { Loading } from './loading';

describe('loadingInterceptor', () => {
  let http: HttpClient;
  let loading: Loading;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHeroesHttp()],
    });
    http = TestBed.inject(HttpClient);
    loading = TestBed.inject(Loading);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows loading while a heroes request is in flight', () => {
    vi.useFakeTimers();

    http.post('/api/heroes', {
      name: 'Flash',
      realName: 'Barry',
      lastName: 'Allen',
      city: 'Central City',
    }).subscribe();

    expect(loading.active()).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(loading.active()).toBe(false);
  });
});
