import { WorkerRunner } from "@effect/platform"
import { BrowserWorkerRunner } from "@effect/platform-browser"
import { Effect, Layer } from "effect"
import { InitialMessage } from "./schema.js"

const WorkerLayer = WorkerRunner.layerSerialized(InitialMessage, {
  InitialMessage: () =>
    Effect.gen(function*() {
      yield* Effect.log("outer worker started")

      yield* Effect.addFinalizer(() => Effect.log("finalizer"))

      return Layer.empty
    }).pipe(Layer.unwrapScoped)
})

WorkerLayer.pipe(
  Layer.provide(BrowserWorkerRunner.layer),
  Layer.launch,
  Effect.scoped,
  Effect.tapErrorCause(Effect.logError),
  Effect.runFork
)
