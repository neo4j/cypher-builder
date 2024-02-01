---
"@neo4j/cypher-builder": patch
---

Deprecates the second parameter of patternComprehensions in favor of new `.map` method:

_old_

```javascript
new Cypher.PatternComprehension(pattern, expr);
```

_new_

```javascript
new Cypher.PatternComprehension(pattern).map(expr);
```
