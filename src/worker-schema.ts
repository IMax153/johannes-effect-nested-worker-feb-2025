import { Transferable } from "@effect/platform";
import { Schema } from "effect";

export namespace Outer {
  export class InitialMessage extends Schema.TaggedRequest<InitialMessage>()('InitialMessage', {
		payload: {
			port: Transferable.MessagePort,
		},
		success: Schema.Void,
		failure: Schema.Never,
	}) {}
}

export namespace Inner {
	export class InitialMessage extends Schema.TaggedRequest<InitialMessage>()('InitialMessage', {
		payload: { },
		success: Schema.Void,
		failure: Schema.Never,
	}) {}

	export class Multiply extends Schema.TaggedRequest<Multiply>()('Multiply', {
		payload: {
			a: Schema.Number,
			b: Schema.Number,
		},
		success: Schema.Number,
		failure: Schema.Never,
	}) {}

	export class Request extends Schema.Union(InitialMessage, Multiply) {}
}
		