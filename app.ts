import express from "express";
import {router as movie} from "./api/movie";
import {router as person} from "./api/person"
import bodyParser from "body-parser";


export const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/movie",movie);
app.use("/person",person);
