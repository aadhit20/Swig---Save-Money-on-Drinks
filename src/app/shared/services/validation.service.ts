import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor() {}

  public matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      console.log(
        'CAlled',
        !!control.parent &&
          !!control.parent.value &&
          control.value === control.parent.controls[matchTo].value
          ? null
          : { isMatching: false }
      );

      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isNotMatching: true };
    };
  }
}
