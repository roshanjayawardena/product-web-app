import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function priceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
   
      // Allow the required validator to handle empty values
      if (value === null || value === undefined || value === '') {
          return null;
      }
          
    // Ensure the value is a number
    if (isNaN(value)) {
      return { invalidNumber: true };
    }

    // Check for negative values
    if (value < 0) {
      return { negativeValue: true };
    }

    // Check for more than two decimal points
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      return { invalidDecimal: true };
    }

    return null; // Valid input
  };
}
