import { Component, input, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule],
  selector: 'app-input',
  styleUrl: './input.scss',
  templateUrl: './input.html',
})
export class Input {
  private static nextId = 0;
  readonly controlId = `app-input-${Input.nextId++}`;
  readonly placeholder = input('');
  readonly label = input('');
  readonly ariaLabel = input('');
  readonly prefix = input('');
  readonly value = model('');
}
