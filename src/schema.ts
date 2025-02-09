import { Schema } from "effect"

export class InitialMessage extends Schema.TaggedRequest<InitialMessage>()("InitialMessage", {
  payload: {},
  success: Schema.Void,
  failure: Schema.Never
}) { }
