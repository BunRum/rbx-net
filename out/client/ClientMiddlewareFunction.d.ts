/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/compiler-types" />
import { MiddlewareList } from "./ClientMiddlewareEvent";
declare abstract class ClientMiddlewareFunction {
    private readonly middlewares;
    protected constructor(middlewares?: MiddlewareList);
    abstract GetInstance(): RemoteFunction;
    protected _processMiddleware<A extends ReadonlyArray<unknown>, R = unknown>(callback: (...args: A) => R): ((...args: A) => R) | undefined;
    process(arr: unknown[]): void;
}
export default ClientMiddlewareFunction;
