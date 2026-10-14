import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { Loading } from './core/loading/loading';

@Component({
  imports: [RouterOutlet, MatProgressSpinnerModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly loading = inject(Loading);
}
