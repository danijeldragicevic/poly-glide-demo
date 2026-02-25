import { describe, it, expect } from 'vitest';
import { helloWorld } from '../../src/serverFunctions/helloWorld';

describe('hello world test', () => {
    it('should return a string', () => {
        expect(typeof helloWorld()).toBe("string");
    });
    it ('should not return an empty string', () => {
        expect(helloWorld()).not.toBe("");
    });
    it('should return "Hello from Poly."', () => {
        expect(helloWorld()).toBe("Hello from Poly.");
    });
});
