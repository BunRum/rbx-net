import { ClientNetGlobalMiddleware, ClientNextCaller, NetGlobalMiddleware, NetMiddleware, NextCaller } from "../middleware";
import { MiddlewareList, MutableMiddlewareList } from "./ClientMiddlewareEvent";

abstract class ClientMiddlewareFunction {
	protected constructor(private readonly middlewares: MiddlewareList = []) {}
	abstract GetInstance(): RemoteFunction;

	/** @internal */
	public _use(middleware: ClientNetGlobalMiddleware) {
		(this.middlewares as MutableMiddlewareList).push(middleware);
	}

	protected _processMiddleware<A extends ReadonlyArray<unknown>, R = unknown>(
		callback: (...args: A) => R,
	) {
		const { middlewares } = this;
		try {
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

	process(arr: unknown[]) {
		const { middlewares } = this;
		if (middlewares.size() > 0) {
			for (const middleware of middlewares) {
				
			}
		}
	}
}

export default ClientMiddlewareFunction;
