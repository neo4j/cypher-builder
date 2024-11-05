# @neo4j/cypher-builder

## 1.22.3

### Patch Changes

-   [#444](https://github.com/neo4j/cypher-builder/pull/444) [`be3c49e`](https://github.com/neo4j/cypher-builder/commit/be3c49ed060cd5cd06226d0eb01c4d123d4bdb20) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecate `assignToPath` in clauses in favor of `assignTo` in Pattern

    Before:

    ```js
    new Cypher.Match(pattern).assignToPath(path).return(path);
    ```

    Now:

    ```js
    new Cypher.Match(pattern.assignTo(path)).return(path);
    ```

    Generates the Cypher:

    ```cypher
    MATCH p = ()-[]-()
    RETURN p
    ```

-   [#444](https://github.com/neo4j/cypher-builder/pull/444) [`0a5bf6c`](https://github.com/neo4j/cypher-builder/commit/0a5bf6c5cbb7e0c3ebd9773c58398994f14858b3) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecate `Cypher.Path` and `Cypher.NamedPath` in favor of `Cypher.PathVariable` and `Cypher.NamedPathVariable` respectively

## 1.22.2

### Patch Changes

-   [#437](https://github.com/neo4j/cypher-builder/pull/437) [`fa520b8`](https://github.com/neo4j/cypher-builder/commit/fa520b81d8e9723fe34482616f44ef7624dcf978) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for patterns in `size()` for Neo4j 4

    ```js
    const pattern = new Cypher.Pattern(new Cypher.Node()).related().to();
    const cypherFunction = Cypher.size(pattern);
    ```

    ```cypher
    size((this0)-[this1]->(this2))
    ```

## 1.22.1

### Patch Changes

-   [#430](https://github.com/neo4j/cypher-builder/pull/430) [`f662ddd`](https://github.com/neo4j/cypher-builder/commit/f662ddd29d09313b2fbdb975a64b3903aa079f2f) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecate using a `Node` as a constructor of `Cypher.PatternComprehension`:

    ```js
    const node = new Cypher.Node();
    const comprehension = new Cypher.PatternComprehension(node);
    ```

## 1.22.0

### Minor Changes

-   [#421](https://github.com/neo4j/cypher-builder/pull/421) [`b9b75cd`](https://github.com/neo4j/cypher-builder/commit/b9b75cdf1bdd2785fb125fdba0590303f7653904) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for `OPTIONAL CALL`:

    ```js
    new Cypher.OptionalCall(subquery);
    ```

    Alternatively

    ```js
    new Cypher.Call(subquery).optional();
    ```

    To generate the following Cypher:

    ```cypher
    OPTIONAL CALL {
        // Subquery
    }
    ```

### Patch Changes

-   [#420](https://github.com/neo4j/cypher-builder/pull/420) [`77d8795`](https://github.com/neo4j/cypher-builder/commit/77d87951a8d3e378a26b8bd96a95988d5111fadf) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for `OFFSET` as an alias for `SKIP`:

    ```js
    const matchQuery = new Cypher.Return(movieNode).orderBy([movieNode.property("age")]).offset(new Cypher.Param(10));
    ```

    ```cypher
    RETURN this0
    ORDER BY this0.age ASC
    OFFSET $param0
    ```

-   [#425](https://github.com/neo4j/cypher-builder/pull/425) [`e899ceb`](https://github.com/neo4j/cypher-builder/commit/e899cebd0c12bdf80051f84c0574293329f74855) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for order by, skip and limit chaining after the following clauses:

    -   Call
    -   Merge
    -   Create
    -   Match
    -   Unwind
    -   Procedures

## 1.21.0

### Minor Changes

-   [#413](https://github.com/neo4j/cypher-builder/pull/413) [`0f2dfe6`](https://github.com/neo4j/cypher-builder/commit/0f2dfe67a2d4386e6a565791f6a952c0e51c6b8b) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for SHORTEST keyword in match and its variations:

    -   `.shortest(k)`
    -   `.shortestGroups(k)`
    -   `.allShortest`
    -   `.any`

    For example:

    ```js
    new Cypher.Match(pattern).shortest(2).return(node);
    ```

    ```cypher
    MATCH ALL SHORTEST (this0:Movie)-[this1]->(this2:Person)
    RETURN this0
    ```

-   [#419](https://github.com/neo4j/cypher-builder/pull/419) [`c7dd297`](https://github.com/neo4j/cypher-builder/commit/c7dd29779bc70bf09a2ae442dfa211c13a39415a) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for labels in set and remove:

    ```js
    const movie = new Cypher.Node();
    const clause = new Cypher.Match(new Cypher.Pattern(movie)).set(movie.label("NewLabel"));
    ```

    ```cypher
    MATCH (this0)
    SET
        this0:NewLabel
    ```

## 1.20.1

### Patch Changes

-   [#374](https://github.com/neo4j/cypher-builder/pull/374) [`721fb85`](https://github.com/neo4j/cypher-builder/commit/721fb85a5658c37c8490c8cc9b8d8932b7fd762a) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecates `Cypher.concat` in favor of `Cypher.utils.concat`

## 1.20.0

### Minor Changes

-   [#399](https://github.com/neo4j/cypher-builder/pull/399) [`02c7e99`](https://github.com/neo4j/cypher-builder/commit/02c7e9957d80498c3af7ceaf4ef84b330ed1e89e) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for variable scope in CALL:

    ```js
    const movieNode = new Cypher.Node();
    const actorNode = new Cypher.Node();

    const clause = new Cypher.Call(new Cypher.Create(new Cypher.Pattern(movieNode).related().to(actorNode)), [
        movieNode,
        actorNode,
    ]);
    ```

    ```cypher
    CALL (this0, this1) {
        CREATE (this0)-[this2]->(this1)
    }
    ```

### Patch Changes

-   [#403](https://github.com/neo4j/cypher-builder/pull/403) [`eed7686`](https://github.com/neo4j/cypher-builder/commit/eed7686112341207a005bb9f3e40ed006889e3e5) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for adding `Call` clauses to `Match` and `With`:

    ```js
    const match = new Cypher.Match(new Cypher.Pattern(movieNode, { labels: ["Movie"] }))
        .call(new Cypher.Create(new Cypher.Pattern(movieNode).related().to(actorNode)), [movieNode])
        .return(movieNode);
    ```

    ```cypher
    MATCH (this0:Movie)
    CALL (this0) {
        CREATE (this0)-[this2]->(this1)
    }
    RETURN this0
    ```

-   [#396](https://github.com/neo4j/cypher-builder/pull/396) [`f39056f`](https://github.com/neo4j/cypher-builder/commit/f39056f11a68b384df763470b39909efe56da20f) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for GQL type aliases introduced in Neo4j 5.23:

    -   `Cypher.TYPE.TIMESTAMP_WITHOUT_TIME_ZONE`
    -   `Cypher.TYPE.TIME_WITHOUT_TIME_ZONE`
    -   `Cypher.TYPE.TIMESTAMP_WITH_TIME_ZONE`
    -   `Cypher.TYPE.TIME_WITH_TIME_ZONE`

## 1.19.1

### Patch Changes

-   [#373](https://github.com/neo4j/cypher-builder/pull/373) [`99eb375`](https://github.com/neo4j/cypher-builder/commit/99eb375b8a6b154e1b89612fc6a5e05788067aa5) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for `new Union().distinct()`

-   [#378](https://github.com/neo4j/cypher-builder/pull/378) [`51ae499`](https://github.com/neo4j/cypher-builder/commit/51ae4993c0aa4fa015ec40c65d3a923eb06cf8e4) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for trimCharacter on rtrim and ltrim

-   [#377](https://github.com/neo4j/cypher-builder/pull/377) [`d4c790e`](https://github.com/neo4j/cypher-builder/commit/d4c790e82b42fb28e21e385b086a2f991e642d50) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for `btrim`

-   [#378](https://github.com/neo4j/cypher-builder/pull/378) [`51ae499`](https://github.com/neo4j/cypher-builder/commit/51ae4993c0aa4fa015ec40c65d3a923eb06cf8e4) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecates `lTrim` and `rTrim` in favour of `ltrim` and `rtrim`

## 1.19.0

### Minor Changes

-   [#369](https://github.com/neo4j/cypher-builder/pull/369) [`3514bdd`](https://github.com/neo4j/cypher-builder/commit/3514bdd6574a43f05c1eed7da1359a2e327bc047) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for LOAD CSV:

    ```js
    const row = new Cypher.Variable();
    const loadClause = new Cypher.LoadCSV("https://data.neo4j.com/bands/artists.csv", row).return(row);
    ```

-   [#354](https://github.com/neo4j/cypher-builder/pull/354) [`ef49a96`](https://github.com/neo4j/cypher-builder/commit/ef49a96ec8a88676fa731f4d17030e7e01718b77) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for quantifier patterns:

    ```js
    const m = new Cypher.Node();
    const m2 = new Cypher.Node();

    const quantifiedPath = new Cypher.QuantifiedPath(
        new Cypher.Pattern(m, { labels: ["Movie"], properties: { title: new Cypher.Param("V for Vendetta") } }),
        new Cypher.Pattern({ labels: ["Movie"] })
            .related({ type: "ACTED_IN" })
            .to({ labels: ["Person"] })
            .quantifier({ min: 1, max: 2 }),
        new Cypher.Pattern(m2, {
            labels: ["Movie"],
            properties: { title: new Cypher.Param("Something's Gotta Give") },
        })
    );

    const query = new Cypher.Match(quantifiedPath).return(m2);
    ```

    _Cypher_

    ```cypher
    MATCH (this0:Movie { title: $param0 })
          ((:Movie)-[:ACTED_IN]->(:Person)){1,2}
          (this1:Movie { title: $param1 })
    RETURN this1
    ```

### Patch Changes

-   [#371](https://github.com/neo4j/cypher-builder/pull/371) [`6d1b0c4`](https://github.com/neo4j/cypher-builder/commit/6d1b0c44d0c7d8862dbbcf7e1c29897cb2e17c5c) Thanks [@angrykoala](https://github.com/angrykoala)! - Add `LOAD CSV` related functions:

    -   `file()`
    -   `linenumber()`

## 1.18.1

### Patch Changes

-   [#366](https://github.com/neo4j/cypher-builder/pull/366) [`5fa3f51`](https://github.com/neo4j/cypher-builder/commit/5fa3f516b19672df3a15bbfa88d7902a8f7f990e) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for multiple expressions on the simple CASE:

    ```js
    matchClause.return(
        new Cypher.Case(person.property("eyes"))
            .when(new Cypher.Literal("brown"), new Cypher.Literal("hazel"))
            .then(new Cypher.Literal(2))
    ```

## 1.18.0

### Minor Changes

-   [#365](https://github.com/neo4j/cypher-builder/pull/365) [`6f20b0a`](https://github.com/neo4j/cypher-builder/commit/6f20b0a5a477c72708674e5428b04e0ea76bc007) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for `CALL { …​ } IN CONCURRENT TRANSACTIONS`:

    ```js
    new Cypher.Call(subquery).inTransactions({
        concurrentTransactions: 3,
    });
    ```

    ```cypher
    CALL {
        // Subquery
    } IN 3 CONCURRENT TRANSACTIONS
    ```

### Patch Changes

-   [#357](https://github.com/neo4j/cypher-builder/pull/357) [`22f87f3`](https://github.com/neo4j/cypher-builder/commit/22f87f370508ebbad3ad6effc09756105cb61b55) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for procedures in the tx namespace:

    -   `tx.getMetaData`
    -   `tx.setMetaData`

-   [#363](https://github.com/neo4j/cypher-builder/pull/363) [`47ee1ef`](https://github.com/neo4j/cypher-builder/commit/47ee1ef9b3f687e789eae307486d1e320f183329) Thanks [@angrykoala](https://github.com/angrykoala)! - Add functions `lower` and `upper`

-   [#361](https://github.com/neo4j/cypher-builder/pull/361) [`e769f61`](https://github.com/neo4j/cypher-builder/commit/e769f612f1f3e904467209e7c477b23a1d086b0c) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for missing fulltext procedures:

    -   `db.index.fulltext.awaitEventuallyConsistentIndexRefresh`
    -   `db.index.fulltext.listAvailableAnalyzers`

-   [#361](https://github.com/neo4j/cypher-builder/pull/361) [`e769f61`](https://github.com/neo4j/cypher-builder/commit/e769f612f1f3e904467209e7c477b23a1d086b0c) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for missing db procedures:

    -   `db.ping`
    -   `db.propertyKeys`
    -   `db.relationshipTypes`
    -   `db.resampleIndex`
    -   `db.resampleOutdatedIndexes`

## 1.17.2

### Patch Changes

-   [#355](https://github.com/neo4j/cypher-builder/pull/355) [`acddbc3`](https://github.com/neo4j/cypher-builder/commit/acddbc365d50390d152e180a8f0f6a04827ce7e1) Thanks [@angrykoala](https://github.com/angrykoala)! - Add the following procedures:

    -   `db.nameFromElementId`
    -   `db.info`
    -   `db.createLabel`
    -   `db.createProperty`
    -   `db.createRelationshipType`
    -   `db.schema.nodeTypeProperties`
    -   `db.schema.relTypeProperties`
    -   `db.schema.visualization`

-   [#351](https://github.com/neo4j/cypher-builder/pull/351) [`ef73177`](https://github.com/neo4j/cypher-builder/commit/ef73177f73359b033e7364741605ffbd8eb1f42d) Thanks [@angrykoala](https://github.com/angrykoala)! - Exports type ROUND_PRECISION_MODE

## 1.17.1

### Patch Changes

-   [#346](https://github.com/neo4j/cypher-builder/pull/346) [`65661c3`](https://github.com/neo4j/cypher-builder/commit/65661c36b8fb27f464fe12c7fe9e038f29b091e5) Thanks [@mjfwebb](https://github.com/mjfwebb)! - Add callProcedure method to With and Match clauses

    ```js
    const withQuery = new Cypher.With("*").callProcedure(Cypher.db.labels()).yield("label");
    ```

## 1.17.0

### Minor Changes

-   [#340](https://github.com/neo4j/cypher-builder/pull/340) [`b1b7acf`](https://github.com/neo4j/cypher-builder/commit/b1b7acfe7c1584671c051bd0764d672bf09350f8) Thanks [@angrykoala](https://github.com/angrykoala)! - Add vector similarity functions:

    ```js
    Cypher.vector.similarity.euclidean(param1, param2);
    Cypher.vector.similarity.cosine(param1, param2);
    ```

-   [#342](https://github.com/neo4j/cypher-builder/pull/342) [`5bba4b5`](https://github.com/neo4j/cypher-builder/commit/5bba4b58b1502f67175f3de30c93106dcb143ab8) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for FINISH clauses:

    ```js
    new Cypher.Finish()

    new Cypher.Match(...).finish()
    new Cypher.Create(...).finish()
    new Cypher.Merge(...).finish()
    ```

## 1.16.0

### Minor Changes

-   [#333](https://github.com/neo4j/cypher-builder/pull/333) [`2593296`](https://github.com/neo4j/cypher-builder/commit/2593296b885715a944bb2dcf79074babcccfa4bc) Thanks [@mjfwebb](https://github.com/mjfwebb)! - Adds support for genai function `genai.vector.encode()` and procedure ` genai.vector.encodeBatch()`

-   [#328](https://github.com/neo4j/cypher-builder/pull/328) [`628ec62`](https://github.com/neo4j/cypher-builder/commit/628ec6238d19ae3835c6223be70e2fb00b4171ff) Thanks [@mjfwebb](https://github.com/mjfwebb)! - Adds support for vector index functions `db.index.vector.queryNodes()` and ` db.index.vector.queryRelationships()`

-   [#310](https://github.com/neo4j/cypher-builder/pull/310) [`13fd317`](https://github.com/neo4j/cypher-builder/commit/13fd31777c6873f615d2f333cbbaabb90f7aaba5) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for arbitrary variables in Patterns instead of only Node and Relationship:

### Patch Changes

-   [#310](https://github.com/neo4j/cypher-builder/pull/310) [`13fd317`](https://github.com/neo4j/cypher-builder/commit/13fd31777c6873f615d2f333cbbaabb90f7aaba5) Thanks [@angrykoala](https://github.com/angrykoala)! - The following methods in `Pattern` class and chains are deprecated:

    -   `withoutLabels`
    -   `withoutVariable`
    -   `withProperties`
    -   `getVariables`
    -   `withoutType`
    -   `withDirection`
    -   `withLength`

    Instead, these properties should be passed as an object, for example:

    ```js
    const a = new Cypher.Variable();
    const rel = new Cypher.Variable();
    const b = new Cypher.Variable();

    const pattern = new Cypher.Pattern(a, { labels: ["Movie"] }).related(rel, { type: "ACTED_IN" }).to(b);
    ```

-   [#310](https://github.com/neo4j/cypher-builder/pull/310) [`98a8b2f`](https://github.com/neo4j/cypher-builder/commit/98a8b2f32ef79d98c49fc5d448f9a637abd4ed60) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecate using Node directly on Match, Create and Merge clauses. Use a Pattern instead

-   [#310](https://github.com/neo4j/cypher-builder/pull/310) [`7574aee`](https://github.com/neo4j/cypher-builder/commit/7574aee5e3263e79afb617bff4ee16f0d8a33aa2) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecate setting up labels and types in Node and Relationship. The following examples are now deprecated:

    ```js
    new Cypher.Node({ labels: ["Movie"] });
    ```

    ```js
    new Cypher.Relationship({ type: "ACTED_IN" });
    ```

    Instead, Nodes and Relationships should be created without parameters. Labels and types should be set in a Pattern:

    ```js
    const n = new Cypher.Node();
    const r = new Cypher.Relationship();

    const pattern = new Cypher.Pattern(n, { labels: ["Movie"] }).related(r, { type: "ACTED_IN" }).to();
    ```

## 1.15.0

### Minor Changes

-   [#321](https://github.com/neo4j/cypher-builder/pull/321) [`0acf69b`](https://github.com/neo4j/cypher-builder/commit/0acf69be80bdb2539c11bfe8ac0288c5acb60b75) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for `IN TRANSACTIONS` in CALL statements using the method `inTransactions()`

## 1.14.0

### Minor Changes

-   [#312](https://github.com/neo4j/cypher-builder/pull/312) [`3060a56`](https://github.com/neo4j/cypher-builder/commit/3060a565a61519aa53ee9d0dd14d229ff0419f44) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for `normalize` function:

    ```
    Cypher.normalize(new Cypher.Param("my string"), "NFC");
    ```

-   [#314](https://github.com/neo4j/cypher-builder/pull/314) [`dbb6a4a`](https://github.com/neo4j/cypher-builder/commit/dbb6a4ad1e81b5f1cb85643db985fb331c3f29bd) Thanks [@angrykoala](https://github.com/angrykoala)! - Add `isNormalized` and `isNotNormalized` operators:

    ```
    const stringLiteral = new Cypher.Literal("the \\u212B char");
    const query = new Cypher.Return([Cypher.isNormalized(stringLiteral, "NFC"), "normalized"]);
    const { cypher } = query.build();
    ```

    ```
    RETURN "the \u212B char" IS NFC NORMALIZED AS normalized
    ```

### Patch Changes

-   [#315](https://github.com/neo4j/cypher-builder/pull/315) [`e3a7505`](https://github.com/neo4j/cypher-builder/commit/e3a750521adb3af6a5653eb8093a3d69bd1d29b0) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecate `Cypher.cdc` Procedures in favor of `Cypher.db.cdc`:

    -   `Cypher.cdc.current` in favor of `Cypher.db.cdc.current`
    -   `Cypher.cdc.earliest` in favor of `Cypher.db.cdc.earliest`
    -   `Cypher.cdc.query` in favor of `Cypher.db.cdc.query`

    This new procedures also update the generated Cypher namespace to `db.cdc`

## 1.13.0

### Minor Changes

-   [#301](https://github.com/neo4j/cypher-builder/pull/301) [`f2f679b`](https://github.com/neo4j/cypher-builder/commit/f2f679bc6256ffb20feeb9146221e06b8bf06247) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for Collect subqueries:

    ```js
    const dog = new Cypher.Node({ labels: ["Dog"] });
    const person = new Cypher.Node({ labels: ["Person"] });

    const subquery = new Cypher.Match(
        new Cypher.Pattern(person).related(new Cypher.Relationship({ type: "HAS_DOG" })).to(dog)
    ).return(dog.property("name"));

    const match = new Cypher.Match(person)
        .where(Cypher.in(new Cypher.Literal("Ozzy"), new Cypher.Collect(subquery)))
        .return(person);
    ```

    ```cypher
    MATCH (this0:Person)
    WHERE "Ozzy" IN COLLECT {
        MATCH (this0:Person)-[this1:HAS_DOG]->(this2:Dog)
        RETURN this2.name
    }
    RETURN this0
    ```

## 1.12.0

### Minor Changes

-   [#294](https://github.com/neo4j/cypher-builder/pull/294) [`07280b6`](https://github.com/neo4j/cypher-builder/commit/07280b675b8b75de6973cda1137893b6c4d0216f) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for WHERE predicates in patters:

    ```javascript
    const movie = new Cypher.Node({ labels: ["Movie"] });

    new Cypher.Pattern(movie).where(Cypher.eq(movie.property("title"), new Cypher.Literal("The Matrix")));
    ```

    ```cypher
    (this0:Movie WHERE this0.title = "The Matrix")
    ```

## 1.11.0

### Minor Changes

-   [#277](https://github.com/neo4j/cypher-builder/pull/277) [`f97c229`](https://github.com/neo4j/cypher-builder/commit/f97c2298939f2adab6305416ed105b0bcaae78e0) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for type predicate expressions with the functions `Cypher.isType` and `Cypher.isNotType`:

    ```ts
    const variable = new Cypher.Variable();
    const unwindClause = new Cypher.Unwind([new Cypher.Literal([42, true, "abc", null]), variable]).return(
        variable,
        Cypher.isType(variable, Cypher.TYPE.INTEGER)
    );
    ```

    ```cypher
    UNWIND [42, true, \\"abc\\", NULL] AS var0
    RETURN var0, var0 IS :: INTEGER
    ```

### Patch Changes

-   [#283](https://github.com/neo4j/cypher-builder/pull/283) [`566e1d4`](https://github.com/neo4j/cypher-builder/commit/566e1d400c4639631989f9fe41d8ab8f94a02306) Thanks [@angrykoala](https://github.com/angrykoala)! - Prepends WITH on each UNION subquery when `.importWith` is set in parent CALL:

    ```js
    const returnVar = new Cypher.Variable();
    const n1 = new Cypher.Node({ labels: ["Movie"] });
    const query1 = new Cypher.Match(n1).return([n1, returnVar]);
    const n2 = new Cypher.Node({ labels: ["Movie"] });
    const query2 = new Cypher.Match(n2).return([n2, returnVar]);

    const unionQuery = new Cypher.Union(query1, query2);
    const callQuery = new Cypher.Call(unionQuery).importWith(new Cypher.Variable());
    ```

    The statement `WITH var0` will be added to each UNION subquery

    ```cypher
    CALL {
        WITH var0
        MATCH (this1:Movie)
        RETURN this1 AS var2
        UNION
        WITH var0
        MATCH (this3:Movie)
        RETURN this3 AS var2
    }
    ```

-   [#283](https://github.com/neo4j/cypher-builder/pull/283) [`566e1d4`](https://github.com/neo4j/cypher-builder/commit/566e1d400c4639631989f9fe41d8ab8f94a02306) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecate `Call.innerWith` in favor of `Call.importWith`

-   [#289](https://github.com/neo4j/cypher-builder/pull/289) [`b9a2ad6`](https://github.com/neo4j/cypher-builder/commit/b9a2ad60cb265dd675f544453067abb5b3481eb2) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecates the second parameter of patternComprehensions in favor of new `.map` method:

    _old_

    ```javascript
    new Cypher.PatternComprehension(pattern, expr);
    ```

    _new_

    ```javascript
    new Cypher.PatternComprehension(pattern).map(expr);
    ```

## 1.10.3

### Patch Changes

-   [#279](https://github.com/neo4j/cypher-builder/pull/279) [`4620a2e`](https://github.com/neo4j/cypher-builder/commit/4620a2e6339251e13c20c9d30011c6b2560f8b19) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for "\*" parameter in MapProjection:

    ```js
    new Cypher.MapProjection(new Cypher.Variable(), "*");
    ```

    ```cypher
    var0 { .* }
    ```

## 1.10.2

### Patch Changes

-   [#274](https://github.com/neo4j/cypher-builder/pull/274) [`d154995`](https://github.com/neo4j/cypher-builder/commit/d1549956660bce18ecd9938b24935022b568e8d1) Thanks [@MacondoExpress](https://github.com/MacondoExpress)! - Fix a bug where the delete clause where not being attached to `Cypher.Call`

## 1.10.1

### Patch Changes

-   [#271](https://github.com/neo4j/cypher-builder/pull/271) [`5834c61`](https://github.com/neo4j/cypher-builder/commit/5834c612e1147137555e9684092dd9aadbc5b40d) Thanks [@angrykoala](https://github.com/angrykoala)! - Add `labelOperator` option on build to change the default label `AND` operator:

    ```js
    const node = new Cypher.Node({ labels: ["Movie", "Film"] });
    const query = new Cypher.Match(node);

    const queryResult = new TestClause(query).build(
        undefined,
        {},
        {
            labelOperator: "&",
        }
    );
    ```

    Will return:

    ```cypher
    MATCH (this:Movie&Film)
    ```

## 1.10.0

### Minor Changes

-   [#269](https://github.com/neo4j/cypher-builder/pull/269) [`6d9d3e2`](https://github.com/neo4j/cypher-builder/commit/6d9d3e226ecc72252b3609dd22f367ae909b1dca) Thanks [@angrykoala](https://github.com/angrykoala)! - Add chained clauses to Procedures after YIELD:

    -   `.unwind`
    -   `.match`
    -   `.optionalMatch`
    -   `.delete`
    -   `.detachDelete`
    -   `.set`
    -   `.merge`
    -   `.create`
    -   `.remove`

## 1.9.0

### Minor Changes

-   [#263](https://github.com/neo4j/cypher-builder/pull/263) [`4c4f49b`](https://github.com/neo4j/cypher-builder/commit/4c4f49b5946bbeda2672adfc7353fa81b7ec0f8f) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for NODETACH:

    ```js
    new Cypher.Match(n).noDetachDelete(n);
    ```

    ```cypher
    MATCH(n)
    NODETACH DELETE n
    ```

-   [#261](https://github.com/neo4j/cypher-builder/pull/261) [`f018078`](https://github.com/neo4j/cypher-builder/commit/f0180784f28380eee9d51be898a1d64866acea4e) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for nullIf function `Cypher.nullIf(expr1, expr2)`

## 1.8.0

### Minor Changes

-   [#253](https://github.com/neo4j/cypher-builder/pull/253) [`da0b3ab`](https://github.com/neo4j/cypher-builder/commit/da0b3abb6be387026b732b91e6f8ed4770322671) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for type filtering on relationships

    ```js
    new Cypher.Match(new Cypher.Pattern().related(new Cypher.Relationship()).to()).where(
        relationship.hasType("ACTED_IN")
    );
    ```

    ```cypher
    MATCH(this0)-[this1]->(this2)
    WHERE this1:ACTED_IN
    ```

-   [#251](https://github.com/neo4j/cypher-builder/pull/251) [`80e1bca`](https://github.com/neo4j/cypher-builder/commit/80e1bcab017a15683431b1d7bba061ba23eff3d8) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for label expressions on `hasLabel`:

    ```js
    const query = new Cypher.Match(node).where(node.hasLabel(Cypher.labelExpr.or("Movie", "Film")));
    ```

    ```cypher
    MATCH (this0:Movie)
    WHERE this0:(Movie|Film)
    ```

-   [#256](https://github.com/neo4j/cypher-builder/pull/256) [`602c237`](https://github.com/neo4j/cypher-builder/commit/602c237ad471f8d81f076bc376d4d25e6f1a1fcc) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for `ON MATCH SET` after `MERGE`:

    ```js
    const node = new Cypher.Node({
        labels: ["MyLabel"],
    });

    const countProp = node.property("count");
    const query = new Cypher.Merge(node)
        .onCreateSet([countProp, new Cypher.Literal(1)])
        .onMatchSet([countProp, Cypher.plus(countProp, new Cypher.Literal(1))]);
    ```

    ```cypher
    MERGE (this0:MyLabel)
    ON MATCH SET
        this0.count = (this0.count + 1)
    ON CREATE SET
        this0.count = 1
    ```

## 1.7.4

### Patch Changes

-   [#245](https://github.com/neo4j/cypher-builder/pull/245) [`a63337d`](https://github.com/neo4j/cypher-builder/commit/a63337d4bfc9eface369872d013288f9082791e1) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecate `Merge.onCreate` in favor of `Merge.onCreateSet` to better reflect the resulting Cypher `ON CREATE SET`

-   [#244](https://github.com/neo4j/cypher-builder/pull/244) [`347ae01`](https://github.com/neo4j/cypher-builder/commit/347ae01215e9946314cf795cd35e0530abe9df28) Thanks [@angrykoala](https://github.com/angrykoala)! - Fix clauses order when using `Merge.onCreate` along with `.set`

    For example:

    ```js
    const query = new Cypher.Merge(node)
        .onCreate([node.property("age"), new Cypher.Param(23)])
        .set([node.property("age"), new Cypher.Param(10)]);
    ```

    ```cypher
    MERGE (this0:MyLabel)
    ON CREATE SET
        this0.age = $param1
    SET
        this0.age = $param0
    ```

## 1.7.3

### Patch Changes

-   [#236](https://github.com/neo4j/cypher-builder/pull/236) [`34552dc`](https://github.com/neo4j/cypher-builder/commit/34552dc31339f4392afcc578ff82f011a4c21f3f) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for chained `.yield`:

    ```ts
    const customProcedure = new Cypher.Procedure("customProcedure", []).yield("result1").yield(["result2", "aliased"]);
    ```

    is equivalent to:

    ```ts
    const customProcedure = new Cypher.Procedure("customProcedure", []).yield("result1", ["result2", "aliased"]);
    ```

    and results in the Cypher:

    ```cypher
    CALL customProcedure() YIELD result1, result2 AS aliased
    ```

## 1.7.2

### Patch Changes

-   [#230](https://github.com/neo4j/cypher-builder/pull/230) [`f37cc99`](https://github.com/neo4j/cypher-builder/commit/f37cc9999f3a5945c981e8c9d81ae3d49dac7237) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for passing `undefined` to `.where`:

    ```ts
    const n = new Cypher.Node();
    new Cypher.Match(n).where(undefined).return(n);
    ```

    This will generate the following Cypher:

    ```
    MATCH(n)
    RETURN n
    ```

    Note that the `WHERE` clause is omitted if the predicate is `undefined`

## 1.7.1

### Patch Changes

-   [#226](https://github.com/neo4j/cypher-builder/pull/226) [`84b1534`](https://github.com/neo4j/cypher-builder/commit/84b1534f766c8c009e8a4f8b15d4c282c6ead500) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for `new Call().innerWith("*")` to generate `WITH *` inside a `CALL` subquery

## 1.7.0

### Minor Changes

-   [#218](https://github.com/neo4j/cypher-builder/pull/218) [`81dc823`](https://github.com/neo4j/cypher-builder/commit/81dc82377cc93a50d373cf05824ab8ef45efa93a) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for CDC procedures:

    -   `cdc.current`
    -   `cdc.earliest`
    -   `cdc.query`

-   [#224](https://github.com/neo4j/cypher-builder/pull/224) [`c872abd`](https://github.com/neo4j/cypher-builder/commit/c872abd611e22db3ae1fd3b6c8162f44f7e47eb6) Thanks [@angrykoala](https://github.com/angrykoala)! - Implement functions from Cypher 5.13:

    -   `valueType`
    -   `char_length`
    -   `character_length`

### Patch Changes

-   [#219](https://github.com/neo4j/cypher-builder/pull/219) [`cae1828`](https://github.com/neo4j/cypher-builder/commit/cae182840b8718d7f972bf2e83f990c23807bd1f) Thanks [@angrykoala](https://github.com/angrykoala)! - Removes duplication between RawCypher (deprecated) and Raw

## 1.6.0

### Minor Changes

-   [#211](https://github.com/neo4j/cypher-builder/pull/211) [`2e76445`](https://github.com/neo4j/cypher-builder/commit/2e76445174843dcb77fcd68633f22a4cc427a508) Thanks [@angrykoala](https://github.com/angrykoala)! - Add chained clauses in unwind:

    -   `Unwind.return`
    -   `Unwind.remove`
    -   `Unwind.set`

-   [`fa3d246`](https://github.com/neo4j/cypher-builder/commit/fa3d24612c7094ec947b036bf7bd00f660916e33) Thanks [@angrykoala](https://github.com/angrykoala)! - Add chained methods in Merge:

    -   `Merge.remove`
    -   `Merge.with`

-   [#213](https://github.com/neo4j/cypher-builder/pull/213) [`64edcdd`](https://github.com/neo4j/cypher-builder/commit/64edcdd580fb72cf8e859edf4f6331ffee65c189) Thanks [@angrykoala](https://github.com/angrykoala)! - Add methods for chained Merge:

    -   `Match.merge`
    -   `Create.merge`
    -   `Call.merge`
    -   `Foreach.merge`
    -   `Merge.merge`
    -   `Unwind.merge`
    -   `With.merge`

-   [#206](https://github.com/neo4j/cypher-builder/pull/206) [`1ef6244`](https://github.com/neo4j/cypher-builder/commit/1ef6244df80dd1f48e69623b0f3ea0cdb62b6376) Thanks [@angrykoala](https://github.com/angrykoala)! - Add methods for chained match clauses:

    -   `With.match`
    -   `With.optionalMatch`
    -   `Unwind.match`
    -   `Unwind.optionalMatch`
    -   `Call.match`
    -   `Call.optionalMatch`

-   [#204](https://github.com/neo4j/cypher-builder/pull/204) [`8227ade`](https://github.com/neo4j/cypher-builder/commit/8227ade6f7174d6c61bf5d2475fea04912e9a2c8) Thanks [@angrykoala](https://github.com/angrykoala)! - Add chained clauses in CALL clause:

    -   `Call.remove`
    -   `Call.set`
    -   `Call.delete`
    -   `Call.detachDelete`

-   [#212](https://github.com/neo4j/cypher-builder/pull/212) [`33ceb71`](https://github.com/neo4j/cypher-builder/commit/33ceb71a5eeea0af2f46d52417015643a0a9f2fb) Thanks [@angrykoala](https://github.com/angrykoala)! - Add methods for chained Create method:

    -   `Match.create`
    -   `Call.create`
    -   `Foreach.create`
    -   `Merge.create`
    -   `Unwind.create`
    -   `With.create`

-   [#200](https://github.com/neo4j/cypher-builder/pull/200) [`d582e1a`](https://github.com/neo4j/cypher-builder/commit/d582e1ace8665de5ea3ed2abcfc9ad6c571fdfbf) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support nested match clauses #90:

    -   `Match.match()`
    -   `Match.optionalMatch()`

-   [#210](https://github.com/neo4j/cypher-builder/pull/210) [`9388048`](https://github.com/neo4j/cypher-builder/commit/9388048f65f1850d9eee6c0fa666328da27d46ea) Thanks [@angrykoala](https://github.com/angrykoala)! - Add chained subclauses for foreach:

    -   `Foreach.return`
    -   `Foreach.remove`
    -   `Foreach.set`
    -   `Foreach.delete`
    -   `Foreach.detachDelete`

-   [#201](https://github.com/neo4j/cypher-builder/pull/201) [`70c60b1`](https://github.com/neo4j/cypher-builder/commit/70c60b1edbb672c32d4394401d37c60a85d45633) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for chained unwind:

    -   `Unwind.unwind`
    -   `Match.unwind`
    -   `With.unwind`

-   [#203](https://github.com/neo4j/cypher-builder/pull/203) [`d7d0d2f`](https://github.com/neo4j/cypher-builder/commit/d7d0d2f8d2262d854deea49faf611d2581cb3392) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for chained methods on Create clause:

    -   `Create.remove`
    -   `Create.delete`
    -   `Create.detachDelete`
    -   `Create.with`
    -   `Create.create`

## 1.5.2

### Patch Changes

-   [#194](https://github.com/neo4j/cypher-builder/pull/194) [`0c40f04`](https://github.com/neo4j/cypher-builder/commit/0c40f04ce32bb9a6bb628d46440d01b01b6287ed) Thanks [@angrykoala](https://github.com/angrykoala)! - Refactors mixins.
    Due to this, multiple top-level clauses nested in the same clause will explicitly fail, instead of silent failing:

    The following is not supported;

    ```javascript
    const match = new Cypher.Match();

    match.with();
    match.return();
    ```

    In favor of the following:

    ```javascript
    const match = new Cypher.Match();

    match.with().return();
    ```

-   [#195](https://github.com/neo4j/cypher-builder/pull/195) [`6b24fdd`](https://github.com/neo4j/cypher-builder/commit/6b24fdd293c6b31ef745744b35502ecdd3782020) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for expressions on Pattern properties:

    ```js
    const pattern = new Cypher.Pattern(node).withProperties({
        name: Cypher.plus(new Cypher.Literal("The "), new Cypher.Literal("Matrix")),
    });
    ```

    Results in:

    ```cypher
    (this0: {name: "The " + "Matrix"})
    ```

-   [#199](https://github.com/neo4j/cypher-builder/pull/199) [`58dfee6`](https://github.com/neo4j/cypher-builder/commit/58dfee6af88856c169b683e364f3a8b65e3010de) Thanks [@angrykoala](https://github.com/angrykoala)! - Fix RawCypher types

-   [#198](https://github.com/neo4j/cypher-builder/pull/198) [`bfb1c97`](https://github.com/neo4j/cypher-builder/commit/bfb1c9764d74b8ae53b687555162304c00355dd5) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecates using `With.with` when nested with already exists in favour of `addColumn`:

    ```js
    const withQuery = new Cypher.With(node);

    withQuery.with(node2);
    withQuery.with("*");
    ```

    Instead, it should be:

    ```js
    const withQuery = new Cypher.With(node);

    const nestedWith = withQuery.with(node2);
    nestedWith.addColumn("*");
    ```

## 1.5.1

### Patch Changes

-   [#185](https://github.com/neo4j/cypher-builder/pull/185) [`75e083e`](https://github.com/neo4j/cypher-builder/commit/75e083eb166f476e8bfe2432e16448bce3452b11) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecates `Cypher.RawCypher` in favor of `Cypher.Raw`

## 1.5.0

### Minor Changes

-   [#171](https://github.com/neo4j/cypher-builder/pull/171) [`888dca7`](https://github.com/neo4j/cypher-builder/commit/888dca7e2a98be8f6fe45a585fdfabe45bab4b87) Thanks [@angrykoala](https://github.com/angrykoala)! - Adds `db.nameFromElementId` function

### Patch Changes

-   [#148](https://github.com/neo4j/cypher-builder/pull/148) [`6f6b48e`](https://github.com/neo4j/cypher-builder/commit/6f6b48e4d01864a8f4f261c620cd2352e1db6484) Thanks [@jhanggi](https://github.com/jhanggi)! - Fix typing to allow NamedRelationship to accept a LabelExpr

## 1.4.0

### Minor Changes

-   [#127](https://github.com/neo4j/cypher-builder/pull/127) [`574f5f6`](https://github.com/neo4j/cypher-builder/commit/574f5f6bd270e89285893a7da8e5c4e80467dea0) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecates `Cypher.utils.compileCypher` and `.getCypher` in favor of `env.compile`:

    Previously:

    ```js
    new Cypher.RawCypher((env) => {
        const myVar = new Cypher.Variable();
        return myVar.getCypher(env);
    });
    ```

    Or

    ```js
    new Cypher.RawCypher((env) => {
        const myVar = new Cypher.Variable();
        return Cypher.utils.compileCypher(myVar, env);
    });
    ```

    Now:

    ```js
    new Cypher.RawCypher((env) => {
        const myVar = new Cypher.Variable();
        return env.compile(myVar);
    });
    ```

### Patch Changes

-   [#139](https://github.com/neo4j/cypher-builder/pull/139) [`480d3b4`](https://github.com/neo4j/cypher-builder/commit/480d3b4e3f5efadf4b044806e9ddae61ebc7da74) Thanks [@angrykoala](https://github.com/angrykoala)! - Change mixins class hierarchy, removing intermediate "ClauseMixin"

## 1.3.0

### Minor Changes

-   [#106](https://github.com/neo4j/cypher-builder/pull/106) [`7474e62`](https://github.com/neo4j/cypher-builder/commit/7474e62ef8336b394d43021d459686096f0cae4c) Thanks [@angrykoala](https://github.com/angrykoala)! - Add instant temporal functions:

    -   time
    -   localtime
    -   localdatetime
    -   datetime
    -   date

    As well as the related nested functions:

    -   \*.realtime
    -   \*.statement
    -   \*.transaction
    -   \*.truncate
    -   datetime.fromepoch
    -   datetime.fromepochmillis

-   [#100](https://github.com/neo4j/cypher-builder/pull/100) [`73d9cba`](https://github.com/neo4j/cypher-builder/commit/73d9cbac0d0790f4a5cda90c26d8d191cdb241bd) Thanks [@angrykoala](https://github.com/angrykoala)! - Add duration functions:
    -   duration
    -   duration.between
    -   duration.inMonths
    -   duration.inDays
    -   duration.inSeconds

### Patch Changes

-   [#110](https://github.com/neo4j/cypher-builder/pull/110) [`f405df2`](https://github.com/neo4j/cypher-builder/commit/f405df2e58519ce2eb9e602482492e839db79548) Thanks [@angrykoala](https://github.com/angrykoala)! - Fix RegExp with super-linear runtime

-   [#107](https://github.com/neo4j/cypher-builder/pull/107) [`ed13cb8`](https://github.com/neo4j/cypher-builder/commit/ed13cb823d04b01ea358364966f3c7e93c5c4f2e) Thanks [@angrykoala](https://github.com/angrykoala)! - Add sugar syntax `Cypher.true` and `Cypher.false` for `new Cypher.Literal(true)` and `new Cypher.Literal(false)`

## 1.2.0

### Minor Changes

-   [#96](https://github.com/neo4j/cypher-builder/pull/96) [`7cb59d1`](https://github.com/neo4j/cypher-builder/commit/7cb59d1f44d479b878dca435c0ad8d56a380bd19) Thanks [@angrykoala](https://github.com/angrykoala)! - Add missing spatial functions:

    -   withinBBox

-   [#91](https://github.com/neo4j/cypher-builder/pull/91) [`0940e2b`](https://github.com/neo4j/cypher-builder/commit/0940e2b88ed229510b431d0db4c9fb53c1c74cab) Thanks [@angrykoala](https://github.com/angrykoala)! - Add missing aggregation functions:
    -   percentileCont
    -   percentileDisc
    -   stDev
    -   stDevP

### Patch Changes

-   [#96](https://github.com/neo4j/cypher-builder/pull/96) [`7cb59d1`](https://github.com/neo4j/cypher-builder/commit/7cb59d1f44d479b878dca435c0ad8d56a380bd19) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecates `pointDistance` in favour of `point.distance`

-   [#99](https://github.com/neo4j/cypher-builder/pull/99) [`11d89d3`](https://github.com/neo4j/cypher-builder/commit/11d89d37d7c25004247eb03911f8255a0218af6a) Thanks [@angrykoala](https://github.com/angrykoala)! - Update types on label expressions & and | to support 1 or 0 parameters

-   [#95](https://github.com/neo4j/cypher-builder/pull/95) [`0550f83`](https://github.com/neo4j/cypher-builder/commit/0550f8309469a19a47f4bb2f3c0fc9b32cec8a61) Thanks [@angrykoala](https://github.com/angrykoala)! - Fix typings on `.skip()` and `.limit()` to support expressions

## 1.1.2

### Patch Changes

-   [#84](https://github.com/neo4j/cypher-builder/pull/84) [`c083fc0`](https://github.com/neo4j/cypher-builder/commit/c083fc0d3f3307f0684c06d45f7cfb6cab55b71e) Thanks [@angrykoala](https://github.com/angrykoala)! - Fix relationship patterns length with value of 0

## 1.1.1

### Patch Changes

-   [#81](https://github.com/neo4j/cypher-builder/pull/81) [`0af8a3a`](https://github.com/neo4j/cypher-builder/commit/0af8a3a33b2cd2c318250f041789f5e34ece0224) Thanks [@angrykoala](https://github.com/angrykoala)! - Reverts types for Call innerWith, With without parameters will not be rendered

## 1.1.0

### Minor Changes

-   [#80](https://github.com/neo4j/cypher-builder/pull/80) [`ecbfd52`](https://github.com/neo4j/cypher-builder/commit/ecbfd529dc20aa971b6306b18ab51a45f27d4cfc) Thanks [@angrykoala](https://github.com/angrykoala)! - Add `getVariables` method to Pattern

### Patch Changes

-   [#75](https://github.com/neo4j/cypher-builder/pull/75) [`a71639e`](https://github.com/neo4j/cypher-builder/commit/a71639ef8b6b6f3788df8e8e721b18fe5dce213d) Thanks [@angrykoala](https://github.com/angrykoala)! - Fix typings on innerWith so at least a parameter is required

-   [#79](https://github.com/neo4j/cypher-builder/pull/79) [`d542fe7`](https://github.com/neo4j/cypher-builder/commit/d542fe71b774797d494dd9c490b96c2f0d9a49dd) Thanks [@angrykoala](https://github.com/angrykoala)! - Fix typings for `apoc.date.convertFormat` input

## 1.0.0

### Major Changes

-   [#50](https://github.com/neo4j/cypher-builder/pull/50) [`91ee39c`](https://github.com/neo4j/cypher-builder/commit/91ee39c9e38ea1e7ba6bfe142c604694355ddca9) Thanks [@angrykoala](https://github.com/angrykoala)! - Escape variable names if needed

-   [#7](https://github.com/neo4j/cypher-builder/pull/7) [`6f57eaf`](https://github.com/neo4j/cypher-builder/commit/6f57eafb635077a4ae77f767149bbdeaca60a1a4) Thanks [@angrykoala](https://github.com/angrykoala)! - Escape relationship types if needed

-   [#72](https://github.com/neo4j/cypher-builder/pull/72) [`0777c76`](https://github.com/neo4j/cypher-builder/commit/0777c764be4a948904f03a9e01c520e85850d72e) Thanks [@angrykoala](https://github.com/angrykoala)! - Remove Reference class. Node, Relationship, Path and Param now extend the class Variable

-   [#1](https://github.com/neo4j/cypher-builder/pull/1) [`79f4834`](https://github.com/neo4j/cypher-builder/commit/79f4834cb7c24f31355c44bbfb81a3742954ed31) Thanks [@angrykoala](https://github.com/angrykoala)! - Escape properties in map projections

### Minor Changes

-   [#70](https://github.com/neo4j/cypher-builder/pull/70) [`e2339ff`](https://github.com/neo4j/cypher-builder/commit/e2339ff6f176944c1e04499968a110bdc07cf221) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for expressions on .skip and .limit subqueries

-   [#7](https://github.com/neo4j/cypher-builder/pull/7) [`6f57eaf`](https://github.com/neo4j/cypher-builder/commit/6f57eafb635077a4ae77f767149bbdeaca60a1a4) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for label expressions for nodes and relationships

    For example:

    ```
    (:A&(B|C))
    ```

-   [#41](https://github.com/neo4j/cypher-builder/pull/41) [`28e5b35`](https://github.com/neo4j/cypher-builder/commit/28e5b35c56019b7ac77336f1bce56e4ee6abe5b1) Thanks [@angrykoala](https://github.com/angrykoala)! - Add predicate functions

-   [#63](https://github.com/neo4j/cypher-builder/pull/63) [`9c26ff2`](https://github.com/neo4j/cypher-builder/commit/9c26ff21f2896dc70e69a5cdffb3d6e22dbfda80) Thanks [@angrykoala](https://github.com/angrykoala)! - Add graph functions

-   [#71](https://github.com/neo4j/cypher-builder/pull/71) [`01badcf`](https://github.com/neo4j/cypher-builder/commit/01badcffb63c48a09b46c6ebc50a12da5f47ca96) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for list index access in property references

-   [#44](https://github.com/neo4j/cypher-builder/pull/44) [`9b4d351`](https://github.com/neo4j/cypher-builder/commit/9b4d3513bb4add5c5fb2823081161e52d150d10b) Thanks [@angrykoala](https://github.com/angrykoala)! - Add missing scalar functions

-   [#45](https://github.com/neo4j/cypher-builder/pull/45) [`f483ab1`](https://github.com/neo4j/cypher-builder/commit/f483ab100ef9cb032ec1a70252d8bff1561f6ba6) Thanks [@angrykoala](https://github.com/angrykoala)! - Add mathematical functions

-   [#57](https://github.com/neo4j/cypher-builder/pull/57) [`af799a4`](https://github.com/neo4j/cypher-builder/commit/af799a49d47e0bcb64b46cbbe00696c23bdc325d) Thanks [@angrykoala](https://github.com/angrykoala)! - Add missing list functions (https://neo4j.com/docs/cypher-manual/current/functions/list/)

### Patch Changes

-   [#50](https://github.com/neo4j/cypher-builder/pull/50) [`91ee39c`](https://github.com/neo4j/cypher-builder/commit/91ee39c9e38ea1e7ba6bfe142c604694355ddca9) Thanks [@angrykoala](https://github.com/angrykoala)! - Updates escape logic so names with numbers are not escaped unless they begin with a number:

    -   `this0` OK
    -   `0this` Should be escaped

-   [#68](https://github.com/neo4j/cypher-builder/pull/68) [`d331655`](https://github.com/neo4j/cypher-builder/commit/d331655a80e8fa79c56ea6564c5a997cd89f3f7d) Thanks [@renovate](https://github.com/apps/renovate)! - Update types to remove usage of any

-   [#58](https://github.com/neo4j/cypher-builder/pull/58) [`9c78c25`](https://github.com/neo4j/cypher-builder/commit/9c78c25e862c90d14ab30c8b81c110dc3d2735b4) Thanks [@angrykoala](https://github.com/angrykoala)! - Remove spaces between list content: [ 1, 2 ] -> [1, 2]

-   [#6](https://github.com/neo4j/cypher-builder/pull/6) [`554a58d`](https://github.com/neo4j/cypher-builder/commit/554a58da610bb9aea4507223bda82e1e00892182) Thanks [@angrykoala](https://github.com/angrykoala)! - Only escape labels if needed

-   [#73](https://github.com/neo4j/cypher-builder/pull/73) [`2ed4de8`](https://github.com/neo4j/cypher-builder/commit/2ed4de8056ade39c219294ffc80bdb2afdf870c0) Thanks [@angrykoala](https://github.com/angrykoala)! - Add string as a possible type for alias in procedure yield

## 0.6.0

### Minor Changes

-   [#53](https://github.com/neo4j/cypher-builder/pull/53) [`7623c25`](https://github.com/neo4j/cypher-builder/commit/7623c25e37d198d77ece05d39ffbad5269058c4a) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for number params in skip and limit

-   [#34](https://github.com/neo4j/cypher-builder/pull/34) [`ee295d0`](https://github.com/neo4j/cypher-builder/commit/ee295d058be9e574ae7f53f69fec802958f72056) Thanks [@angrykoala](https://github.com/angrykoala)! - Removes `getReference` method from the Environment class

-   [#27](https://github.com/neo4j/cypher-builder/pull/27) [`9d6cfe3`](https://github.com/neo4j/cypher-builder/commit/9d6cfe33e3c252e1336191bccfa9307b5be5e3de) Thanks [@angrykoala](https://github.com/angrykoala)! - Updates CypherResult type to Record<string, unknown>, better reflecting the results of the parameters

### Patch Changes

-   [#51](https://github.com/neo4j/cypher-builder/pull/51) [`f2394db`](https://github.com/neo4j/cypher-builder/commit/f2394db7bb50b365443236be65a8b88f7138ec7c) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for count(\*)

-   [#30](https://github.com/neo4j/cypher-builder/pull/30) [`c92b67a`](https://github.com/neo4j/cypher-builder/commit/c92b67a1b1ba21b245204e943b13bc8f3c15a19a) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for COUNT subqueries

-   [#26](https://github.com/neo4j/cypher-builder/pull/26) [`9c46104`](https://github.com/neo4j/cypher-builder/commit/9c46104a9479f8ee17c23d69f29a11e71571e0f0) Thanks [@angrykoala](https://github.com/angrykoala)! - Fix typings for predicate functions

## 0.5.4

### Patch Changes

-   [#22](https://github.com/neo4j/cypher-builder/pull/22) [`9aadbad`](https://github.com/neo4j/cypher-builder/commit/9aadbad3a32b0dfa1cc8132f5113f646c0de3e0c) Thanks [@angrykoala](https://github.com/angrykoala)! - Adds `@internal` methods to the output .d.ts to avoid errors in client builds

## 0.5.3

### Patch Changes

-   [#17](https://github.com/neo4j/cypher-builder/pull/17) [`1089034`](https://github.com/neo4j/cypher-builder/commit/10890341974429a552433caecf63cba500960891) Thanks [@angrykoala](https://github.com/angrykoala)! - Escapes properties in patterns.

    e.g.

    ```
    MATCH (m:Movie { `$myProp`: "Text" })
    ```

## 0.5.2

### Patch Changes

-   [#11](https://github.com/neo4j/cypher-builder/pull/11) [`63ffbbf`](https://github.com/neo4j/cypher-builder/commit/63ffbbf34ec003247aebfbf8754bafe216d42ef1) Thanks [@angrykoala](https://github.com/angrykoala)! - Adds db.index.fulltext.queryRelationships

-   [#13](https://github.com/neo4j/cypher-builder/pull/13) [`41a15dd`](https://github.com/neo4j/cypher-builder/commit/41a15dd5f6725dd74cf8da08ce0eb91909ff142f) Thanks [@darrellwarde](https://github.com/darrellwarde)! - Change the abstract class Reference to accept nested properties

## 0.5.1

### Patch Changes

-   [`708d9de`](https://github.com/neo4j/cypher-builder/commit/708d9de5391ea0877d6775389ddd721782f832b8) Thanks [@angrykoala](https://github.com/angrykoala)! - Adds NamedRelationship

-   [#8](https://github.com/neo4j/cypher-builder/pull/8) [`b77f6b0`](https://github.com/neo4j/cypher-builder/commit/b77f6b05e72701b8a606ce5ea093bf46c7ac86a4) Thanks [@angrykoala](https://github.com/angrykoala)! - Add Cypher.utils.compileCypher method

-   [#8](https://github.com/neo4j/cypher-builder/pull/8) [`b77f6b0`](https://github.com/neo4j/cypher-builder/commit/b77f6b05e72701b8a606ce5ea093bf46c7ac86a4) Thanks [@angrykoala](https://github.com/angrykoala)! - Add escapeType and escapeProperty utils

## 0.5.0

### Minor Changes

-   [#2](https://github.com/neo4j/cypher-builder/pull/2) [`c2f4af7`](https://github.com/neo4j/cypher-builder/commit/c2f4af72c10e685e19dcae74ac05cc6e3080478d) Thanks [@angrykoala](https://github.com/angrykoala)! - Deprecates runFirstColumn clause in favor of apoc.cypher.runFirstColumnSingle and runFirstColumnMany function to better reflect Cypher behaviour

### Patch Changes

-   [`19892cb`](https://github.com/neo4j/cypher-builder/commit/19892cb8a2fdcd3b3532d8aaef0c66b46f54571c) Thanks [@angrykoala](https://github.com/angrykoala)! - Update repository to https://github.com/neo4j/cypher-builder

-   [#3](https://github.com/neo4j/cypher-builder/pull/3) [`1c1bd0c`](https://github.com/neo4j/cypher-builder/commit/1c1bd0c26426d926a89620edb83b722c9a9392ef) Thanks [@angrykoala](https://github.com/angrykoala)! - Groups mathematical operators with parenthesis

## 0.4.3

### Patch Changes

-   [#3370](https://github.com/neo4j/graphql/pull/3370) [`ddae88e48`](https://github.com/neo4j/graphql/commit/ddae88e48a2e13ea9b6f4d9b39c46c52cf35a17e) Thanks [@angrykoala](https://github.com/angrykoala)! - Exports utility "toCypherParams"

-   [#3369](https://github.com/neo4j/graphql/pull/3369) [`42d2f6938`](https://github.com/neo4j/graphql/commit/42d2f6938df2b728c5ed552200565d1f8145e8bd) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for clauses as input of sub-clauses methods where possible

## 0.4.2

### Patch Changes

-   [#3220](https://github.com/neo4j/graphql/pull/3220) [`2d3661476`](https://github.com/neo4j/graphql/commit/2d3661476b78713d11b6d74a8db8c7af51d18989) Thanks [@angrykoala](https://github.com/angrykoala)! - Serialize properties if needed

## 0.4.1

### Patch Changes

-   [#3191](https://github.com/neo4j/graphql/pull/3191) [`f0d6d45b0`](https://github.com/neo4j/graphql/commit/f0d6d45b07cc65081ede71ce98efc916ce506977) Thanks [@angrykoala](https://github.com/angrykoala)! - Fix Unwind parameters

-   [#3191](https://github.com/neo4j/graphql/pull/3191) [`f0d6d45b0`](https://github.com/neo4j/graphql/commit/f0d6d45b07cc65081ede71ce98efc916ce506977) Thanks [@angrykoala](https://github.com/angrykoala)! - Add .delete chain methods to With, Unwind and Merge

## 0.4.0

### Minor Changes

-   [#3147](https://github.com/neo4j/graphql/pull/3147) [`2bc2c7019`](https://github.com/neo4j/graphql/commit/2bc2c70196c084f850aaf5b17838b0a66eaca79c) Thanks [@angrykoala](https://github.com/angrykoala)! - Refactor Cypher.Map to use a Map internally, include .size method and remove support for undefined fields

-   [#3106](https://github.com/neo4j/graphql/pull/3106) [`bfae63097`](https://github.com/neo4j/graphql/commit/bfae6309717ab936768cab7e5e2a1a20bbff60da) Thanks [@darrellwarde](https://github.com/darrellwarde)! - The type `Cypher.PropertyRef` is now fully exported under `Cypher.Property` for use with utilities such as `instanceof`. However, it maintains the current behaviour of not being directly instantiable.

-   [#3115](https://github.com/neo4j/graphql/pull/3115) [`a04ef4469`](https://github.com/neo4j/graphql/commit/a04ef44692e744e3154a74c5ac2c73f323732fc7) Thanks [@angrykoala](https://github.com/angrykoala)! - Map projections inject the leading dot (.) in the map fields automatically.

### Patch Changes

-   [#3091](https://github.com/neo4j/graphql/pull/3091) [`0d7a140ae`](https://github.com/neo4j/graphql/commit/0d7a140aea93eca94c03bcd49fda9ee9dfa5ae2b) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for using sets when defining the labels of a Node

-   [#3153](https://github.com/neo4j/graphql/pull/3153) [`d47624ea1`](https://github.com/neo4j/graphql/commit/d47624ea1b1b79401c59d326b4d0e31e64a1545d) Thanks [@MacondoExpress](https://github.com/MacondoExpress)! - Adds `divide`, `multiply`, `mod`, `pow` to the Math Operators.

-   [#3154](https://github.com/neo4j/graphql/pull/3154) [`b276bbae2`](https://github.com/neo4j/graphql/commit/b276bbae29ead5b110f28984cc77914755ac4c22) Thanks [@angrykoala](https://github.com/angrykoala)! - Add inequality operator (<>) with Cypher.neq

## 0.3.0

### Minor Changes

-   [#3025](https://github.com/neo4j/graphql/pull/3025) [`507f9f7ff`](https://github.com/neo4j/graphql/commit/507f9f7ff5a57ff42f6554b21c2eff0cf37c10ba) Thanks [@angrykoala](https://github.com/angrykoala)! - CallProcedure clause deprecated and improvements on Procedures API

### Patch Changes

-   [#3012](https://github.com/neo4j/graphql/pull/3012) [`cdbf0c1fe`](https://github.com/neo4j/graphql/commit/cdbf0c1fed34e5c39c8697410e13b338498f7520) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for USE in CypherBuilder

-   [#2984](https://github.com/neo4j/graphql/pull/2984) [`084e0e036`](https://github.com/neo4j/graphql/commit/084e0e036ea05091db9082cae227b55a55157109) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for path variables over patterns

-   [#3008](https://github.com/neo4j/graphql/pull/3008) [`c4b9f120a`](https://github.com/neo4j/graphql/commit/c4b9f120ac2e22a6c9c1a34c920cb1ddf88fa45d) Thanks [@angrykoala](https://github.com/angrykoala)! - Adds support for DISTINCT in aggregation functions

## 0.2.1

### Patch Changes

-   [#2868](https://github.com/neo4j/graphql/pull/2868) [`c436ab040`](https://github.com/neo4j/graphql/commit/c436ab0403a45395594728e6fc192034712f45af) Thanks [@angrykoala](https://github.com/angrykoala)! - Add timezone parameter to temporal functions

-   [#2884](https://github.com/neo4j/graphql/pull/2884) [`1a2101c33`](https://github.com/neo4j/graphql/commit/1a2101c33d00a738be26c57fa378d4a9e3bede41) Thanks [@darrellwarde](https://github.com/darrellwarde)! - Add `id()` and `elementId()` functions

## 0.2.0

### Minor Changes

-   [#2855](https://github.com/neo4j/graphql/pull/2855) [`d4455881c`](https://github.com/neo4j/graphql/commit/d4455881c83f9ec597e657d92b9c9c126721541b) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for patterns with multiple relationships and variable-length patterns

### Patch Changes

-   [#2827](https://github.com/neo4j/graphql/pull/2827) [`81df28ed9`](https://github.com/neo4j/graphql/commit/81df28ed9238c1b4692aabe8e1de438ba01ae914) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for square brackets syntax on variable properties

-   [#2862](https://github.com/neo4j/graphql/pull/2862) [`4fdb5135f`](https://github.com/neo4j/graphql/commit/4fdb5135fa3bdb84b87893d14afe263ad5ed020f) Thanks [@angrykoala](https://github.com/angrykoala)! - Add XOR operation

## 0.1.10

### Patch Changes

-   [#2827](https://github.com/neo4j/graphql/pull/2827) [`81df28ed9`](https://github.com/neo4j/graphql/commit/81df28ed9238c1b4692aabe8e1de438ba01ae914) Thanks [@angrykoala](https://github.com/angrykoala)! - Add support for square brackets syntax on varaible properties

## 0.1.9

### Patch Changes

-   [#2678](https://github.com/neo4j/graphql/pull/2678) [`ddf51ccfe`](https://github.com/neo4j/graphql/commit/ddf51ccfeec896b64ee943e910e59ac4e2f62869) Thanks [@angrykoala](https://github.com/angrykoala)! - Fix variable name generation when reusing named params

## 0.1.8

### Patch Changes

-   [#2545](https://github.com/neo4j/graphql/pull/2545) [`2d2cb2e42`](https://github.com/neo4j/graphql/commit/2d2cb2e42dc0d495b944fa5a49abed8e4c0892e5) Thanks [@angrykoala](https://github.com/angrykoala)! - Support for UNWIND statement after CALL { ... }

## 0.1.7

### Patch Changes

-   [#2530](https://github.com/neo4j/graphql/pull/2530) [`c8c2d2d4d`](https://github.com/neo4j/graphql/commit/c8c2d2d4d4897adfd1afcd666bf9f46263dfab1f) Thanks [@MacondoExpress](https://github.com/MacondoExpress)! - Introduce ListIndex and add support to the square bracket notation.

## 0.1.6

### Patch Changes

-   [#2406](https://github.com/neo4j/graphql/pull/2406) [`150b64c04`](https://github.com/neo4j/graphql/commit/150b64c046dd511d29436b33d67770aed6217c8f) Thanks [@MacondoExpress](https://github.com/MacondoExpress)! - Apoc.util.validate is now invocable from CallProcedure

## 0.1.5

### Patch Changes

-   [#2427](https://github.com/neo4j/graphql/pull/2427) [`e23691152`](https://github.com/neo4j/graphql/commit/e23691152db927d03891c592a716ca41e58d5f47) Thanks [@angrykoala](https://github.com/angrykoala)! - Add string functions and expose Function class for arbitrary functions

-   [#2429](https://github.com/neo4j/graphql/pull/2429) [`4c79ec3cf`](https://github.com/neo4j/graphql/commit/4c79ec3cf29ea7f0cd0e5fc18f98e65c221af8e5) Thanks [@angrykoala](https://github.com/angrykoala)! - Add reduce function

## 0.1.4

### Patch Changes

-   [#2345](https://github.com/neo4j/graphql/pull/2345) [`94b6cea4f`](https://github.com/neo4j/graphql/commit/94b6cea4f26b90523fed59d0b22cbac25461a71c) Thanks [@angrykoala](https://github.com/angrykoala)! - Remove dependencies on nodejs utils

## 0.1.3

### Patch Changes

-   [#2115](https://github.com/neo4j/graphql/pull/2115) [`7aff0cf19`](https://github.com/neo4j/graphql/commit/7aff0cf194010c8268024917abec931d9ba2c359) Thanks [@MacondoExpress](https://github.com/MacondoExpress)! - Included List, date, localtime, localdatetime, time, randomUUID.
    It's possible now to set edge properties from the Merge clause.

## 0.1.2

### Patch Changes

-   [#2301](https://github.com/neo4j/graphql/pull/2301) [`42771f950`](https://github.com/neo4j/graphql/commit/42771f950badfc33e8babf07f85931ebd6018749) Thanks [@angrykoala](https://github.com/angrykoala)! - Fix indentation on apoc.fulltext

## 0.1.0

### Minor Changes

-   [#2247](https://github.com/neo4j/graphql/pull/2247) [`f37a58d5b`](https://github.com/neo4j/graphql/commit/f37a58d5b475dd3a12d36c7cb3205b0f60430f99) Thanks [@angrykoala](https://github.com/angrykoala)! - Cypher Builder package initial release
