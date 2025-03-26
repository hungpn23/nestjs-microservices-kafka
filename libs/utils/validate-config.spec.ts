import {
  NumberValidators,
  StringValidators,
} from '@libs/decorators/properties.decorator';
import { validateConfig } from './validate-config';

class TestConfig {
  @StringValidators()
  name: string;

  @NumberValidators()
  age: number;
}

describe('validateConfig', () => {
  it('should transform and validate a valid config', () => {
    const validConfig = {
      name: 'Test',
      age: 25,
    };

    const result = validateConfig(validConfig, TestConfig);

    expect(result).toBeInstanceOf(TestConfig);
    expect(result.name).toBe('Test');
    expect(result.age).toBe(25);
  });

  it('should throw an error for invalid config', () => {
    const invalidConfig = {
      name: '',
      age: 'not a number',
    };

    expect(() => {
      validateConfig(invalidConfig, TestConfig);
    }).toThrow();
  });

  it('should throw an error for missing properties', () => {
    const incompleteConfig = {
      name: 'Test',
    };

    expect(() => {
      validateConfig(incompleteConfig, TestConfig);
    }).toThrow();
  });

  it('should handle empty config object', () => {
    const emptyConfig = {};

    expect(() => {
      validateConfig(emptyConfig, TestConfig);
    }).toThrow();
  });
});
