import { WorkerRunner } from '@effect/platform'
import {  BrowserWorkerRunner} from '@effect/platform-browser'
import * as WorkerSchema from './worker-schema.js'
import { Effect, Layer } from 'effect'


const workerOuter = WorkerRunner.layerSerialized(WorkerSchema.Outer.InitialMessage, {
	InitialMessage: ({port}) => Effect.gen(function* () {
		yield* Effect.log('outer worker started')
		yield* Effect.addFinalizer(() => Effect.log('outer finalizer'))

		yield* workerInner.pipe(
			Layer.provide(BrowserWorkerRunner.layerMessagePort(port)),
			Layer.launch,
			// Effect.scoped,
			Effect.tapErrorCause(Effect.logError),
			Effect.forkScoped,
		)

		return Layer.empty
	}).pipe(Layer.unwrapScoped),
})

const workerInner = WorkerRunner.layerSerialized(WorkerSchema.Inner.Request, {
	InitialMessage: () => Effect.gen(function* () {
		yield* Effect.log('inner worker started')

		yield* Effect.addFinalizer(() => Effect.log('inner finalizer'))

		return Layer.empty
	}).pipe(Layer.unwrapScoped),
	Multiply: ({a, b}) => Effect.succeed(a * b)
})



workerOuter.pipe(
	Layer.provide(BrowserWorkerRunner.layer),
	Layer.launch,
	Effect.scoped,
	Effect.tapErrorCause(Effect.logError),
	Effect.runFork,
)
