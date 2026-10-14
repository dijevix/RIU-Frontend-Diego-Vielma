import { FormControl } from '@angular/forms';
import { PATTERNS } from '../constants/patterns';
import { trimmedLength } from './trimmed-length.validator';

describe('trimmedLength', () => {
  const validate = trimmedLength(3, 25);

  it('requires a non-empty trimmed value', () => {
    expect(validate(new FormControl('   '))).toEqual({ required: true });
    expect(validate(new FormControl(null))).toEqual({ required: true });
  });

  it('rejects values shorter than min', () => {
    expect(validate(new FormControl('ab'))).toEqual({
      minlength: { requiredLength: 3, actualLength: 2 },
    });
  });

  it('rejects values longer than max', () => {
    expect(validate(new FormControl('a'.repeat(26)))).toEqual({
      maxlength: { requiredLength: 25, actualLength: 26 },
    });
  });

  it('rejects values that do not match the pattern', () => {
    expect(validate(new FormControl('Spider@Man'))).toEqual({ pattern: true });
  });

  it('accepts letters numbers spaces and hyphens', () => {
    expect(validate(new FormControl('José-Luis'))).toBeNull();
    expect(validate(new FormControl('el pepe'))).toBeNull();
    expect(validate(new FormControl('Spider-Man 2099'))).toBeNull();
  });

  it('rejects dots apostrophes and parentheses', () => {
    expect(validate(new FormControl("O'Brien"))).toEqual({ pattern: true });
    expect(validate(new FormControl('Dr. Strange'))).toEqual({ pattern: true });
    expect(validate(new FormControl('Spider-Man (2099)'))).toEqual({ pattern: true });
  });

  it('can use a custom pattern', () => {
    const digitsOnly = trimmedLength(1, 5, /^\d+$/);
    expect(digitsOnly(new FormControl('42'))).toBeNull();
    expect(digitsOnly(new FormControl('ab'))).toEqual({ pattern: true });
  });

  it('exposes the default pattern constant', () => {
    expect(PATTERNS.heroText.test('Batman')).toBe(true);
    expect(PATTERNS.heroText.test('Iron#Man')).toBe(false);
  });
});
