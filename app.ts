import express from "express";
import {router as movie} from "./api/movie";
import {router as person} from "./api/person"
import bodyParser from "body-parser";
import cors = require('cors');


export const app = express();

app.use(
    cors({
      origin: "*",
    })
  );
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/movie",movie);
app.use("/person",person);
