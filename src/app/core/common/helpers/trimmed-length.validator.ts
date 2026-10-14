import { ValidatorFn } from '@angular/forms';
import { PATTERNS } from '../constants/patterns';

export const trimmedLength =
  (min: number, max: number, pattern: RegExp = PATTERNS.lettersSpacesHyphenApostrophe): ValidatorFn =>
  (control) => {
    const value = String(control.value ?? '').trim();
    if (!value) return { required: true };
    if (value.length < min) return { minlength: { requiredLength: min, actualLength: value.length } };
    if (value.length > max) return { maxlength: { requiredLength: max, actualLength: value.length } };
    if (!pattern.test(value)) return { pattern: true };
    return null;
  };
