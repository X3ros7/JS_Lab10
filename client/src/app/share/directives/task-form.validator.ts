import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class TaskFormValidator {
  static forbiddenWordsValidator(words: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || typeof control.value !== "string") {
        return null;
      }

      const hasForbiddenWords = words.some((word) =>
        control.value.includes(word.toLowerCase())
      );
      return hasForbiddenWords ? { forbiddenWord: true } : null;
    };
  }

  static dateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const inputValue = new Date(control.value);
    const currentYear = new Date().getFullYear();

    return inputValue.getFullYear() < currentYear ? { dateVal: true } : null;
  }
}
