# PROMPTS.md



## 1. .NET vs NestJS — framework comparison during the walkthrough

Tell me the difference between .NET and NestJS — some patterns, how HTTP requests are handled, dependency injection. Basic overview of NestJs development principles with .Net as an example.
Basic overview, learned that singleton is default within the module scope, service registration in @Module container.

## 2. After first successfull build and code/functionality check, next adjustments to the project:
Ok, good for now. Next fix these issues:

Navigation bar should not only be visible when user is logged in, it should be visible always, but if user is logged then there is logout button. User should be able to browse items without being logged in. It was not defined if user should be logged in to checkout, so make it as bussiness rule config switch - if user needs to be logged in to be able to checkout or not.


## 3. Test hanging — the real cause

Tests run but produce no output and hang forever on Windows.
Next prompts are mostly me trying some adjustments suggested by AI but getting some new erros, then pasting these new errors to the AI. In total around 10-12 prompts required to make tests work.

AI Suggested `forceExit: true` in Jest config, then `openHandlesTimeout`, then switching from `jest.config.ts` to `jest.config.js` to avoid a ts-node startup failure.

*(After several rounds none of these fully fixed it)*

AI Suggested if `bcrypt` is the issue — it's a native C++ addon compiled inside Docker for Linux. When Jest runs on Windows it tries to load that Linux binary.

Confirmed — replaced `bcrypt` with `bcryptjs` (pure JS) throughout. Also caught that the test TypeORM configs only registered a subset of entities, causing TypeORM to fail resolving relationships at startup, which produced the hanging behaviour rather than a clean error.

The AI kept treating this as a Jest configuration problem when the actual causes were a native binary incompatibility and an incomplete entity list. Working through it systematically — checking each layer — found both issues. The AI was a useful sounding board once the right hypothesis was on the table.
