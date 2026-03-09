---
"@neo4j/cypher-builder": major
---

Remove extra parameters in `Cypher.Foreach` in favor of methods `in` and `do`.

For example, to create the following Cypher:

```cypher
FOREACH (var0 IN [1, 2, 3] |
        CREATE (this1:Movie)
        SET
            this1.id = var0
    )
```

_before_

```js
const list = new Cypher.Literal([1, 2, 3]);
const variable = new Cypher.Variable();

const movieNode = new Cypher.Node();
const createMovie = new Cypher.Create(new Cypher.Pattern(movieNode, { labels: ["Movie"] })).set([
    movieNode.property("id"),
    variable,
]);

const foreachClause = new Cypher.Foreach(variable, list, createMovie);
```

_after_

```js
const list = new Cypher.Literal([1, 2, 3]);
const variable = new Cypher.Variable();

const movieNode = new Cypher.Node();
const createMovie = new Cypher.Create(new Cypher.Pattern(movieNode, { labels: ["Movie"] })).set([
    movieNode.property("id"),
    variable,
]);

const foreachClause = new Cypher.Foreach(variable).in(list).do(createMovie);
```
