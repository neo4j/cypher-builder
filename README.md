# Cypher Builder

[![npm version](https://badge.fury.io/js/@neo4j%2Fcypher-builder.svg)](https://www.npmjs.com/package/@neo4j/cypher-builder)
[![Test](https://github.com/neo4j/cypher-builder/actions/workflows/test.yml/badge.svg)](https://github.com/neo4j/cypher-builder/actions/workflows/test.yml)
[![Lint](https://github.com/neo4j/cypher-builder/actions/workflows/lint.yml/badge.svg)](https://github.com/neo4j/cypher-builder/actions/workflows/lint.yml)

Cypher Builder is a JavaScript programmatic API to create [Cypher](https://neo4j.com/docs/cypher-manual/current/) queries for [Neo4j](https://neo4j.com/).

-   [Documentation](https://neo4j.github.io/cypher-builder/cypher-builder/current/)

```typescript
import Cypher from "@neo4j/cypher-builder";

const movieNode = new Cypher.Node();
const pattern = new Cypher.Pattern(movieNode, { labels: ["Movie"] });

const matchQuery = new Cypher.Match(pattern)
    .where(movieNode, {
        title: new Cypher.Param("The Matrix"),
    })
    .return(movieNode.property("title"));

const { cypher, params } = matchQuery.build();

console.log(cypher);
console.log(params);
```

_Cypher_

```cypher
MATCH (this0:Movie)
WHERE this0.title = $param0
RETURN this0.title
```

_Params_

```typescript
{
    "param0": "The Matrix",
}
```

# Examples

You can find usage examples in the [examples](https://github.com/neo4j/cypher-builder/tree/main/examples) folder.

> This library is for JavaScript and TypeScript only. If you are using Java, check [Neo4j Cypher DSL](https://neo4j.github.io/cypher-dsl).
