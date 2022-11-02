# 0.0.0-experimental.30 - 2 Nov 2022
Bug fix:
- Add `zod-to-json-schema` by default

# 0.0.0-experimental.29 - 2 Nov 2022
[Regulus]

This version introduces rework for internal architecture. Refine, and unify the structure of how KingWorld works internally.

Although many refactoring might require, I can assure you that this is for the greater good, as the API refinement lay down a solid structure for the future of KingWorld.

Thanks to API refinement, this version also introduced a lot of new interesting features, and many APIs simplified.

Notable improvements and new features:
- Define Schema, auto-infer type, and validation
- Simplifying Handler's generic
- Unifying Life Cycle into one property
- Custom Error handler, and body-parser
- Before start/stop and clean up effect

# 0.0.0-experimental.28 - 30 Oct 2022
Happy halloween.

This version named [GHOST FOOD] is one of the big improvement for KingWorld, I have been working on lately.
It has a lot of feature change for better performance, and introduce lots of deprecation.

Be sure to follow the migration section in `Breaking Change`.

New Feature:
- Auto infer type from `plugin` after merging with `use`
- `decorate` to extends `Context` method
- add `addParser`, for custom handler for parsing body

Breaking Change:
- Moved `store` into `context.store`
    - To migrate:
    ```typescript
    // From
    app.get(({}, store) => store.a)

    // To
    app.get(({ store }) => store.a)
    ```

- `ref`, and `refFn` is now removed
- Remove `Plugin` type, simplified Plugin type declaration
    - To migrate:
    ```typescript
    // From
    import type { Plugin } from 'kingworld'
    const a: Plugin = (app) => app

    // To
    import type { KingWorld } from 'kingworld'
    const a = (app: KingWorld) => app
    ```

- Migrate `Header` to `Record<string, unknown>`
    - To migrate:
    ```typescript
    app.get("/", ({ responseHeader }) => {
        // From
        responseHeader.append('X-Powered-By', 'KingWorld')

        // To
        responseHeader['X-Powered-By', 'KingWorld']

        return "KingWorld"
    })
    ```

Change:
- Store is now globally mutable

Improvement:
- Faster header initialization
- Faster hook initialization

# 0.0.0-experimental.27 - 23 Sep 2022
New Feature:
- Add `config.strictPath` for handling strict path

# 0.0.0-experimental.26 - 10 Sep 2022
Improvement:
- Improve `clone` performance
- Inline `ref` value
- Using object to store internal route

Bug fix:
- 404 on absolute path

# 0.0.0-experimental.25 - 9 Sep 2022
New Feature:
- Auto infer typed for `params`, `state`, `ref`
- `onRequest` now accept async function
- `refFn` syntax sugar for adding fn as reference instead of `() => () => value`

Improvement:
- Switch from `@saltyaom/trek-router` to `@medley/router`
- Using `clone` instead of flatten object
- Refactor path fn for inline cache
- Refactor `Context` to class 

Bug fix:
- `.ref()` throw error when accept function

# 0.0.0-experimental.24 - 21 Aug 2022
Change:
- optimized for `await`

# 0.0.0-experimental.23 - 21 Aug 2022
New Feature:
- Initialial config is now available, starting with `bodyLimit` config for limiting body size

Breaking Change:
- `ctx.body` is now a literal value instead of `Promise`
    - To migrate, simply remove `await`

Change: 
- `default` now accept `Handler` instead of `EmptyHandler`

Bug fix:
- Default Error response now return `responseHeaders`
- Possibly fixed parsing body error benchmark

# 0.0.0-experimental.22 - 19 Aug 2022
Breaking Change:
- context.body is now deprecated, use request.text() or request.json() instead

Improvement:
- Using reference header to increase json response speed
- Remove `body` getter, setter

Change:
- Using `instanceof` to early return `Response`

# 0.0.0-experimental.21 - 14 Aug 2022
Breaking Change:
- `context.headers` now return `Header` instead of `Record<string, string>`

Feature:
- Add status function to `Context`
- `handle` now accept `number | Serve`
- Remove `querystring` to support native Cloudflare Worker
- Using raw headers check to parse `body` type

# 0.0.0-experimental.20 - 13 Aug 2022
Feature:
- Handle error as response

# 0.0.0-experimental.19 - 13 Aug 2022
Change:
- Use Array Spread instead of concat as it's faster by 475%
- Update to @saltyaom/trek-router 0.0.7 as it's faster by 10%
- Use array.length instead of array[0] as it's faster by 4%

# 0.0.0-experimental.18 - 8 Aug 2022
Change:
- With lazy initialization, KingWorld is faster by 15% (tested on 14' M1 Max)
- Micro optimization
- Remove `set` from headers

# 0.0.0-experimental.17 - 15 Jul 2022
Change:
- Remove dependencies: `fluent-json-schema`, `fluent-schema-validator`
- Update `@saltyaom/trek-router` to `0.0.2`

# 0.0.0-experimental.16 - 15 Jul 2022
Breaking Change:
- Move `hook.schema` to separate plugin, [@kingworldjs/schema](https://github.com/saltyaom/kingworld-schema)
    - To migrate, simply move all `hook.schema` to `preHandler` instead

Change:
- Rename type `ParsedRequest` to `Context`
- Exposed `#addHandler` to `_addHandler`

# 0.0.0-experimental.15 - 14 Jul 2022
Breaking Change:
- Rename `context.responseHeader` to `context.responseHeaders`
- Change type of `responseHeaders` to `Header` instead of `Record<string, string>`