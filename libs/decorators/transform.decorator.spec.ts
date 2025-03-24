import { plainToInstance } from 'class-transformer';
import { ToBoolean, ToLowerCase, ToUpperCase } from './transforms.decorator';

class TestClass {
  @ToLowerCase()
  lowerCaseProp: string | string[];

  @ToUpperCase()
  upperCaseProp: string | string[];

  @ToBoolean()
  booleanProp: string | boolean;
}

describe('Transform Decorators', () => {
  describe('ToLowerCase', () => {
    it('should transform string to lowercase', () => {
      const dto = plainToInstance(TestClass, { lowerCaseProp: 'HELLO' });
      expect(dto.lowerCaseProp).toBe('hello');
    });

    it('should transform array of strings to lowercase', () => {
      const dto = plainToInstance(TestClass, {
        lowerCaseProp: ['HELLO', 'WORLD'],
      });
      expect(dto.lowerCaseProp).toEqual(['hello', 'world']);
    });
  });

  describe('ToUpperCase', () => {
    it('should transform string to uppercase', () => {
      const dto = plainToInstance(TestClass, { upperCaseProp: 'hello' });
      expect(dto.upperCaseProp).toBe('HELLO');
    });

    it('should transform array of strings to uppercase', () => {
      const dto = plainToInstance(TestClass, {
        upperCaseProp: ['hello', 'world'],
      });
      expect(dto.upperCaseProp).toEqual(['HELLO', 'WORLD']);
    });
  });

  describe('ToBoolean', () => {
    it('should transform "true" to true', () => {
      const dto = plainToInstance(TestClass, { booleanProp: 'true' });
      expect(dto.booleanProp).toBe(true);
    });

    it('should transform "false" to false', () => {
      const dto = plainToInstance(TestClass, { booleanProp: 'false' });
      expect(dto.booleanProp).toBe(false);
    });

    it('should keep string unchanged if not "true" or "false"', () => {
      const dto = plainToInstance(TestClass, { booleanProp: 'yes' });
      expect(dto.booleanProp).toBe('yes');
    });

    it('should keep boolean value unchanged', () => {
      const dtoTrue = plainToInstance(TestClass, { booleanProp: true });
      expect(dtoTrue.booleanProp).toBe(true);

      const dtoFalse = plainToInstance(TestClass, { booleanProp: false });
      expect(dtoFalse.booleanProp).toBe(false);
    });

    it('should keep value unchanged if not a string or boolean', () => {
      const dtoNumber = plainToInstance(TestClass, { booleanProp: 123 });
      expect(dtoNumber.booleanProp).toBe(123);

      const dtoObject = plainToInstance(TestClass, { booleanProp: {} });
      expect(dtoObject.booleanProp).toEqual({});
    });
  });
});
