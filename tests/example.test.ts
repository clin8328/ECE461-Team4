const { add } = require('../src/example');

describe('add function', () => {
    // Test case 1
    it('should add two numbers correctly', () => {
      const a = 5;
      const b = 3;

      const result = add(a, b);

      expect(result).toBe(8);
    });
  
    // Test case 2
    it('should handle negative numbers', () => {
      const a = -2;
      const b = 1;

      const result = add(a, b);

      expect(result).toBe(-1);
    });
  });
