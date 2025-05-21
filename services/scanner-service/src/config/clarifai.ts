import { grpc } from "clarifai-nodejs-grpc";
const { ClarifaiStub } = require("clarifai-nodejs-grpc");
import dotenv from 'dotenv';

dotenv.config();

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', `Key ${process.env.CLARIFAI_API_KEY}`);


export { stub, metadata };