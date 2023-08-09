# @neo4j/cypher-builder

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
