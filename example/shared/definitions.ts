import Net from "../../";
import { Definitions } from "../../";
import { clientMiddleware } from "./middleware";


const MyMiddleware: clientMiddleware = (nextMiddleware) => {
    return (...args) => {
        print("scoop")
        return nextMiddleware("c");
    };
};
const g = Net.CreateDefinitions({
    m: Definitions.ServerToClientEvent<[data: unknown]>([
        MyMiddleware
    ]),
    onJoin: Definitions.ServerFunction<() => string>([], [MyMiddleware])
})

const love = g.Server.Get("m")

g.Client.Get("onJoin").CallServer()