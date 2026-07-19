# /review

Review the current project for code quality issues.

## Steps

1. Read all source files in `src/`.
2. Check for **security issues**: unsanitized inputs, missing auth checks, exposed secrets.
3. Check for **performance issues**: N+1 queries, missing indexes, unbounded loops, memory leaks.
4. Check for **code style**: inconsistent naming, missing error handling, dead code, missing types.
5. Output a structured summary:

```
## Code Review Summary

### Security
| Severity | File | Issue | Suggestion |
|----------|------|-------|------------|
| ...      | ...  | ...   | ...        |

### Performance
| Severity | File | Issue | Suggestion |
|----------|------|-------|------------|
| ...      | ...  | ...   | ...        |

### Code Style
| Severity | File | Issue | Suggestion |
|----------|------|-------|------------|
| ...      | ...  | ...   | ...        |

### Overall: PASS / NEEDS ATTENTION
```

## Notes

- Severity levels: HIGH, MEDIUM, LOW
- If no issues found in a category, say "No issues found"
- Be specific about file paths and line numbers
