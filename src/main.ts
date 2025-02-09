import { BrowserRuntime, BrowserWorker } from '@effect/platform-browser'
import { Worker } from '@effect/platform'
import { InitialMessage } from './schema.js'
import { Effect } from 'effect'

const main = Effect.gen(function*() {
  const mc = new MessageChannel()

  yield* Worker.makeSerialized<typeof InitialMessage.Type>({
    initialMessage: () => new InitialMessage({ port: mc.port1 }),
  }).pipe(
    Effect.provide(BrowserWorker.layer(() => {
      return new globalThis.Worker(new URL('./worker.ts', import.meta.url), {
        type: 'module'
      })
    }))
  )

  yield* Effect.never
}).pipe(Effect.timeout(2000), Effect.ignore)

main.pipe(Effect.scoped, BrowserRuntime.runMain)
