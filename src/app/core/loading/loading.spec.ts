import { TestBed } from '@angular/core/testing';
import { Loading } from './loading';

describe('Loading', () => {
  let loading: Loading;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    loading = TestBed.inject(Loading);
  });

  it('starts inactive', () => {
    expect(loading.active()).toBe(false);
  });

  it('shows and hides', () => {
    loading.show();
    expect(loading.active()).toBe(true);
    loading.hide();
    expect(loading.active()).toBe(false);
  });
});
