import express from "express";
import cors from "cors";
import { createBookRouter } from "./routes/books.js";

export const createApp = ({ bookModel }) => {
  const app = express();

  const port = process.env.PORT || 1234;

  app.disable("x-powered-by");

  app.use(express.json());

  app.use(cors());

  app.use("/books", createBookRouter({ bookModel }));

  app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}/`);
  });
};
