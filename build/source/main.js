"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_helper_1 = require("./env/env-helper");
const server_1 = require("./server/server");
env_helper_1.EnvHelper.envConfig(".env.spotify");
async function main() {
    const server = new server_1.Server(3000);
    server.createServer();
}
main();
//# sourceMappingURL=main.js.map