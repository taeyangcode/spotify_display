import { EnvHelper } from "./env/env-helper.js";
import { Server } from "./server/server.js";

EnvHelper.envConfig(".env.spotify");

async function main(): Promise<void> {
    const server: Server = new Server(3000);
    server.createServer();
}
main();