import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Loading } from './core/loading/loading';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideNoopAnimations()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('shows the spinner overlay while loading', () => {
    const fixture = TestBed.createComponent(App);
    const loading = TestBed.inject(Loading);
    loading.show();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-loading')).toBeTruthy();
    expect(compiled.querySelector('mat-progress-spinner')).toBeTruthy();
  });
});
