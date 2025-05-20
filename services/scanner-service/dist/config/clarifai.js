"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = exports.stub = void 0;
const clarifai_nodejs_grpc_1 = require("clarifai-nodejs-grpc");
const { ClarifaiStub } = require("clarifai-nodejs-grpc");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stub = ClarifaiStub.grpc();
exports.stub = stub;
const metadata = new clarifai_nodejs_grpc_1.grpc.Metadata();
exports.metadata = metadata;
metadata.set('authorization', `Key ${process.env.CLARIFAI_API_KEY}`);
//# sourceMappingURL=clarifai.js.map