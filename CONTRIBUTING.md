# CONTRIBUTING

All contributions, such as [issues](https://github.com/neo4j/cypher-builder/issues) and [pull requests](https://github.com/neo4j/cypher-builder/pulls) are welcome.

If you want to contribute code, make sure to [sign the CLA](https://neo4j.com/developer/contributing-code/#sign-cla).

## Development instructions

- `npm test` to run cypher builder tests. Most tests are located next to the code that are testing as a `.test.ts` file
- `npm run build` to compile cypher builder library
- `npm run docs` to generate the API reference docs
- `npm run changeset` to generate changelog files of the changes

### Link Cypher Builder locally with yarn

In the Cypher Builder folder run:

- `yarn link`
- `yarn build`

In the root of the package run:

- `yarn link -p [path-to-local-cypher-builder]`

To unlink, in the project using cypher-builder:

- `yarn unlink @neo4j/cypher-builder`

### TSDoc references

Each public element of the library should have a TSDoc comment compatible with [TypeDoc](https://typedoc.org/guides/overview).
The comments should follow these conventions:

- Brief description if needed, in markdown format, without complex tags so it remains readable in code and no trailing dot (`.`)
- @group - This should be the Cypher concept related to this interface: Functions, Clauses, Operators, Procedures, Subqueries, Patterns, Namespaces, Maps, Lists, Utils.
- @category - Sub grouping, if needed. For example, `Aggregations` inside the group `functions`,
- @see {@link https://neo4j.com/docs/cypher-manual | Cypher Documentation} - A link to the element in the Cypher documentation,
- @internal - If used by the library and not exposed,
- @example - Example of usage and resulting Cypher, in markdown,
- @since - If recently added to Neo4j: `@since Neo4j 5.19`,
- @deprecated - If deprecated in Cypher Builder,

For example:

```ts
/** Absolute value of an `Integer` or `Float`
 * @group Functions
 * @category Math
 * @see {@link https://neo4j.com/docs/cypher-manual/current/functions/mathematical-numeric/#functions-abs | Cypher Documentation}
 */
export function abs(expr: Expr): CypherFunction {}
```

### Files

- `tsdoc.json` Defines the tsdoc shcema
- `typedoc.json` Configures the tool typedoc

### File imports

File imports are a bit complex due to a common interface exported, as well as the use of mixins. To prevent issues, follow the following rules:

- `index.ts` **only** re-exports everything from `Cypher.ts`
- `Cypher.ts` barrel-exports all the public surface of the cypher builder
- **All** internal imports must point to the local file, not index or Cypher. **Except**
    - Mixins (e.g `WithUnwind`) must import its clause dependency from `index`.
- All tests must import from top-level `index`, unless unit testing something internal

## Branches

These are the branches conventions on the repo:

- `main` The main branch, this is the latest release version
- `*.x` The cutoff of an older major version (e.g. `2.x`)
- `*-dev` development of a new major version

## Mixins

Many clauses in the Cypher Builder share the same interface. For example, `Match.with`, `With.with` and `Create.with`.
To avoid code duplication, we use mixins, based on https://www.typescriptlang.org/docs/handbook/mixins.html
These mixins allow to compose a class with other clases, by dynamically extending from all the classes. Traditional inheritance doesn't work here, as there is not a
clear chain of inheritance. Other composition techniques leave a more complex surface, or duplicate the code.

To work with mixins:

- All mixins follow the convention `With*` (including `WithWith`).
- To implement a mixin in a class, you need to both use the decorator `@mixin` and use `export interface MyClass extends WithMyMixin` so typescript get the typings
- A mixin implementing a clause, must import it from the barrel import (`Cypher.ts`) to avoid circular dependencies
