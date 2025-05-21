"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = process.env.SCANNER_SERVICE_PORT || 3007;
app_1.default.listen(PORT, () => {
    console.log(`Scanner service running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map