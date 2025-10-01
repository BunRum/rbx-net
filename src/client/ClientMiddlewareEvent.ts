import { $ifEnv } from "rbxts-transform-env";
import { ClientNextCaller, clientMiddleware, ClientNetGlobalMiddleware } from "../middleware";
// import { NetGlobalMiddleware, NetMiddleware, NextCaller } from "";

/** @internal */
export type MutableMiddlewareList = Array<clientMiddleware<Array<unknown>>>;
export type MiddlewareList = ReadonlyArray<clientMiddleware<ReadonlyArray<unknown>>>;
abstract class ClientMiddlewareEvent {
	protected constructor(private readonly middlewares: MiddlewareList = []) {}

	/** @internal */
	abstract GetInstance(): RemoteEvent;

	/** @internal */
	public _use(middleware: ClientNetGlobalMiddleware) {
		(this.middlewares as MutableMiddlewareList).push(middleware);
	}

	protected _processMiddleware<A extends ReadonlyArray<unknown>, R = void>(
		callback: (...args: A) => R,
	) {
		const { middlewares } = this;
		print("silly client middleware")
		try {
			assert(
				typeIs(middlewares, "table"),
				"The middleware argument should be an array of middlewares not a " + typeOf(middlewares),
			);
			print(middlewares.size())
			if (middlewares.size() > 0) {
				let callbackFn = callback as ClientNextCaller<R>;

				// Run through each middleware
				for (const middleware of middlewares) {
					callbackFn = middleware(callbackFn, this) as ClientNextCaller<R>;
				}

				return callbackFn;
			} else {
				return callback;
			}
		} catch (e) {
			warn("[rbx-net] " + tostring(e));
		}
	}
}

export default ClientMiddlewareEvent;
