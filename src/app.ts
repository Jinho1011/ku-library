import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import loginRouter from "./routes/login";
import reserveRouter from "./routes/reserve";

const app: Express = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/login", loginRouter);
app.use("/api/reserve", reserveRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
