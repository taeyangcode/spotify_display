import { EnvHelper } from "./env/env-helper";
import { Server } from "./server/server";
import { Authorization } from "./spotify/authorization";

EnvHelper.envConfig(".env.spotify");

async function main(): Promise<void> {
    const server: Server = new Server(3000);
    server.createServer();
}
main();