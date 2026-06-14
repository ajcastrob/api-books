import { Router } from "express";
import { booksController } from "../controllers/books.js";

export const booksRouter = Router();

booksRouter.get("/", booksController.getAll);

booksRouter.get("/:slug", booksController.getBySlug);

booksRouter.post("/", booksController.createBook);

booksRouter.delete("/:id", booksController.deleteBook);

booksRouter.patch("/:id", booksController.updateBook);
