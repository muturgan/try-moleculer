import type { CheckerFunction, ValidationError } from 'fastest-validator';

// const re = /^((\+7|7|8)+([0-9]){10})$/gm;
const re = /\d/g;

export const validatePhoneNumber: CheckerFunction<string> = (val: string, _, path: string): true | ValidationError[] =>
{
   const isValid = re.test(val);
   return isValid === true
      ? true
      : [{
         type: 'phoneNumber',
         field: path,
         message: 'incorrect phone number',
         expected: 'like 89009001234',
         actual: val,
      }];
};