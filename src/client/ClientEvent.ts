import { DefinitionConfiguration } from "../definitions";
import { getRemoteOrThrow, IS_SERVER, waitForRemote } from "../internal";
import { ClientMiddlewareOverload } from "../middleware";
import ClientMiddlewareEvent from "./ClientMiddlewareEvent";

/**
 * Interface for client listening events
 */
export interface ClientListenerEvent<CallArguments extends ReadonlyArray<unknown>> {
	/**
	 * Connects a callback function to this event, in which if any events are recieved by the server will be called.
	 * @param callback The callback function
	 */
	Connect(callback: (...args: CallArguments) => void): RBXScriptConnection;
}

/**
 * Interface for client sender events
 */
export interface ClientSenderEvent<CallArguments extends ReadonlyArray<unknown>> {
	/**
	 * Sends an event to the server with the specified arguments
	 * @param args The arguments
	 */
	SendToServer(...args: CallArguments): void;
}

class ClientEvent<
	ConnectArgs extends ReadonlyArray<unknown> = Array<unknown>,
	CallArguments extends ReadonlyArray<unknown> = Array<unknown>
>
extends ClientMiddlewareEvent
implements ClientListenerEvent<ConnectArgs>, ClientSenderEvent<CallArguments> {
	private instance: RemoteEvent;

	public constructor(
		name: string, 
		private configuration: DefinitionConfiguration, 
		middlewares: ClientMiddlewareOverload<ConnectArgs> = [],
		item?: unknown
	) {
		print(middlewares, item, "candy cookie")
		super([...middlewares])
		this.instance = getRemoteOrThrow("RemoteEvent", name);
		assert(!IS_SERVER, "Cannot fetch NetClientEvent on the server!");
	}

	/** @deprecated */
	public GetInstance() {
		return this.instance;
	}

	public static Wait<
		ConnectArgs extends ReadonlyArray<unknown> = Array<unknown>,
		CallArguments extends ReadonlyArray<unknown> = Array<unknown>
	>(name: string, configuration: DefinitionConfiguration, middlewares: ClientMiddlewareOverload<ConnectArgs> = [],) {
		return Promise.defer<ClientEvent<ConnectArgs, CallArguments>>(async resolve => {
			await waitForRemote("RemoteEvent", name, 60);
			resolve(new ClientEvent(name, configuration, middlewares));
		});
	}

	public SendToServer(...args: CallArguments) {
		this.instance.FireServer(...args);
	}

	public Connect(callback: (...args: ConnectArgs) => void): RBXScriptConnection {
		const remoteId = this.instance.Name;
		const microprofile = this.configuration.MicroprofileCallbacks;
		// const modifiedcallback = callback as unknown as ((player: Player, ...args: ConnectArgs) => void)

		if (microprofile) {
			return this.instance.OnClientEvent.Connect((...args) => {
				debug.profilebegin(`Net: ${remoteId}`);
				// this._processMiddleware()
				const modifed = args as unknown as ConnectArgs
				this._processMiddleware(callback)?.(...modifed)
			});
		} else {
			print("im invincible")
			return this.instance.OnClientEvent.Connect((...args) => {
				const modifed = args as unknown as ConnectArgs
				this._processMiddleware(callback)?.(...modifed)
			});
		}
	}
}

export default ClientEvent;
