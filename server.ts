import http from "http";
import {app} from "./app"

const port = process.env.port || 6000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log("Server is started")
})