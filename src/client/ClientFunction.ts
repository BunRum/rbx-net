import { DefinitionConfiguration } from "../definitions";
import { getRemoteOrThrow, IS_SERVER, TagId, waitForRemote } from "../internal";
import { ClientMiddlewareOverload } from "../middleware";
import ClientMiddlewareFunction from "./ClientMiddlewareFunction";
const CollectionService = game.GetService("CollectionService");

export default class ClientFunction<CallArgs extends ReadonlyArray<unknown>, ServerReturnType = unknown> extends ClientMiddlewareFunction {
	private instance: RemoteFunction;

	constructor(private name: string, private configuration: DefinitionConfiguration, middlewares: ClientMiddlewareOverload<CallArgs> = []) {
		super(middlewares)
		this.instance = getRemoteOrThrow("RemoteFunction", name);
		assert(!IS_SERVER, "Cannot create a Net.ClientFunction on the Server!");
	}

	public static Wait<CallArgs extends ReadonlyArray<unknown> = Array<unknown>, ServerReturnType = unknown>(
		name: string,
		configuration: DefinitionConfiguration,
		middlewares: ClientMiddlewareOverload<CallArgs> = []
	) {
		return Promise.defer<ClientFunction<CallArgs, ServerReturnType>>(async (resolve) => {
			await waitForRemote("RemoteFunction", name, 60);
			resolve(new ClientFunction(name, configuration, middlewares));
		});
	}

		/** @deprecated */
		public GetInstance() {
			return this.instance;
		}

	/**
	 * Will call the server synchronously
	 * @param args The call arguments
	 */
	public CallServer(...args: CallArgs) {
		if (CollectionService.HasTag(this.instance, TagId.DefaultFunctionListener)) {
			throw `Attempted to call Function '${this.name}' - which has no user defined callback`;
		}
		
		const modifed = args as unknown as CallArgs;
		// return  this.instance.InvokeServer()
		// const callback = (...argsa: unknown[]) => this.instance.InvokeServer(...argsa);
		// const callback = this.instance.InvokeServer
		const relo = this.instance.InvokeServer(...args)
		const callback = () => relo
		return this._processMiddleware(callback)!()
		// const returnData = [...relo]
// 
		// return this.process(returnData)
		// return this._processMiddleware(callback) 
		// return this._processMiddleware<CallArgs, ServerReturnType>(callback)() as;
	}

	/**
	 * Will call the server asynchronously
	 * @param args The call arguments
	 */
	public async CallServerAsync(...args: CallArgs): Promise<ServerReturnType> {
		return Promise.defer<ServerReturnType>((resolve) => {
			const result = this.instance.InvokeServer(...args) as ServerReturnType;
			resolve(result);
		});
	}
}
