import { BrowserRuntime, BrowserWorker } from '@effect/platform-browser'
import {Worker} from '@effect/platform'
import * as WorkerSchema from './worker-schema.js'
import { Effect } from 'effect'

const main = Effect.gen(function* () {
	const mc = new MessageChannel()

	console.log('booting outer')

	const outer = yield* Worker.makeSerialized<typeof WorkerSchema.Outer.InitialMessage['Type']>({
		initialMessage: () => new WorkerSchema.Outer.InitialMessage({
				port: mc.port1,
		}),
	}).pipe(Effect.provide(BrowserWorker.layer(() => new globalThis.Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }))))

	console.log('booting inner')

	const inner = yield* Worker.makeSerialized<typeof WorkerSchema.Inner.Request['Type']>({
		initialMessage: () => new WorkerSchema.Inner.InitialMessage(),
	}).pipe(Effect.provide(BrowserWorker.layer(() => mc.port2)))

	// const res = yield* inner.executeEffect(new WorkerSchema.Inner.Multiply({
	// 	a: 4,
	// 	b: 2,
	// }))

	// console.log('should be 8', res)

	yield* Effect.never
}).pipe(Effect.timeout(2000))

main.pipe(Effect.scoped, BrowserRuntime.runMain)