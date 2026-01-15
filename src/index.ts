import express, { Application } from "express";
import dotenv from "dotenv"
import router from "./routes";
import { ErrorHandlerMiddleware } from "@middlewares";
import cors from "cors";
import path from "path";
dotenv.config();

const app: Application = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(router);

app.use("/*", ErrorHandlerMiddleware.errorHandlerMiddleware)

let PORT = process.env.APP_PORT || 9000
app.listen(PORT, () => {console.log(PORT)})