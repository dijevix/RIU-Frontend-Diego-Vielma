import { Component, input, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule],
  selector: 'app-input',
  styleUrl: './input.scss',
  templateUrl: './input.html',
})
export class Input {
  readonly placeholder = input('');
  readonly label = input('');
  readonly prefix = input('');
  readonly value = model('');
}
