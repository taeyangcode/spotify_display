import { EnvHelper } from "./env/env-helper.js";
import { Server } from "./server/server.js";
EnvHelper.envConfig(".env.spotify");
async function main() {
    const server = new Server(3000);
    server.createServer();
}
main();
//# sourceMappingURL=main.js.map