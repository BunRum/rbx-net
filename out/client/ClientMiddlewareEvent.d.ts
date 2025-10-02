/// <reference types="@rbxts/compiler-types" />
import { clientMiddleware } from "../middleware";
export declare type MiddlewareList = ReadonlyArray<clientMiddleware<ReadonlyArray<unknown>>>;
declare abstract class ClientMiddlewareEvent {
    private readonly middlewares;
    protected constructor(middlewares?: MiddlewareList);
    protected _processMiddleware<A extends ReadonlyArray<unknown>, R = void>(callback: (...args: A) => R): ((...args: A) => R) | undefined;
}
export default ClientMiddlewareEvent;
