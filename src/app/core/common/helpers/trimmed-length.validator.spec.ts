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

  it('accepts valid values including accents hyphens and apostrophes', () => {
    expect(validate(new FormControl('José-Luis'))).toBeNull();
    expect(validate(new FormControl("O'Brien"))).toBeNull();
  });

  it('can use a custom pattern', () => {
    const digitsOnly = trimmedLength(1, 5, /^\d+$/);
    expect(digitsOnly(new FormControl('42'))).toBeNull();
    expect(digitsOnly(new FormControl('ab'))).toEqual({ pattern: true });
  });

  it('exposes the default pattern constant', () => {
    expect(PATTERNS.lettersSpacesHyphenApostrophe.test('Batman')).toBe(true);
    expect(PATTERNS.lettersSpacesHyphenApostrophe.test('Iron#Man')).toBe(false);
  });
});
