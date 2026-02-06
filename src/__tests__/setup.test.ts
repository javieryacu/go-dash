import { describe, it, expect } from 'vitest'

describe('GoDash Setup', () => {
    it('should have correct environment', () => {
        expect(true).toBe(true)
    })

    it('should be able to run tests', () => {
        const sum = (a: number, b: number) => a + b
        expect(sum(2, 3)).toBe(5)
    })
})
