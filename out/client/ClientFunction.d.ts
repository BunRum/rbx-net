/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { DefinitionConfiguration } from "../definitions";
import { ClientMiddlewareOverload } from "../middleware";
import ClientMiddlewareFunction from "./ClientMiddlewareFunction";
export default class ClientFunction<CallArgs extends ReadonlyArray<unknown>, ServerReturnType = unknown> extends ClientMiddlewareFunction {
    private name;
    private configuration;
    private instance;
    constructor(name: string, configuration: DefinitionConfiguration, middlewares?: ClientMiddlewareOverload<CallArgs>);
    static Wait<CallArgs extends ReadonlyArray<unknown> = Array<unknown>, ServerReturnType = unknown>(name: string, configuration: DefinitionConfiguration, middlewares?: ClientMiddlewareOverload<CallArgs>): Promise<ClientFunction<CallArgs, ServerReturnType>>;
    /** @deprecated */
    GetInstance(): RemoteFunction<Callback>;
    /**
     * Will call the server synchronously
     * @param args The call arguments
     */
    CallServer(...args: CallArgs): any;
    /**
     * Will call the server asynchronously
     * @param args The call arguments
     */
    CallServerAsync(...args: CallArgs): Promise<ServerReturnType>;
}
