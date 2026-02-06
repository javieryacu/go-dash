---
description: Create a new feature following TDD methodology
---
# New Feature (TDD)

## Steps

1. **Identify the feature** to implement based on `task.md`

2. **Write the test first** (RED phase):
   - Create test file: `src/__tests__/[feature].test.ts`
   - Write failing tests that describe expected behavior
   - Run tests to confirm they fail: `npm run test`

3. **Implement minimal code** (GREEN phase):
   - Write just enough code to make tests pass
   - Focus on functionality, not perfection
   - Run tests: `npm run test`

4. **Refactor** (BLUE phase):
   - Clean up the code
   - Improve naming, structure, performance
   - Ensure tests still pass

5. **Update task.md**:
   - Mark the feature as completed: `[x]`

## TDD Best Practices
- Test behavior, not implementation
- One assertion per test when possible
- Use descriptive test names: `it('should return error when email is invalid')`
- Mock external dependencies (Supabase, OpenAI)

## Example Test Structure
```typescript
import { describe, it, expect, vi } from 'vitest'
import { myFunction } from '@/lib/myModule'

describe('myFunction', () => {
  it('should handle valid input correctly', () => {
    const result = myFunction('valid-input')
    expect(result).toBe('expected-output')
  })

  it('should throw error for invalid input', () => {
    expect(() => myFunction('')).toThrow('Invalid input')
  })
})
```
