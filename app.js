import express from "express";
import cors from "cors";
import { booksRouter } from "./routes/books.js";

const app = express();

const port = process.env.PORT || 1234;

app.disable("x-powered-by");

app.use(express.json());

app.use(cors());

app.use("/books", booksRouter);

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}/`);
});
