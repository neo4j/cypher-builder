# Development

-   `npm test` to run cypher builder tests
-   `npm run build` to compile cypher builder library
-   `npm run docs` to generate the API reference docs

# JSDoc references

Each public element of the library should have a JSDoc comment compatible with [TypeDoc](https://typedoc.org/guides/overview).
The comments should follow these conventions:

-   Brief description
-   @group - This should be the Cypher concept related to this interface. Cypher Functions, Clauses, Operators, Procedures, Other Expressions.
-   @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual) - A link to the element in the Cypher documentation
-   @internal - If used by the library and not exposed
-   @example - example of usage and resulting Cypher

````
* @example
* ```ts
* new Cypher.Match(new Node({labels: ["Movie"]})).optional();
* ```
* _Cypher:_
* ```cypher
* OPTIONAL MATCH (this:Movie)
* ```
````
