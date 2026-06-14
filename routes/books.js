import { Router } from "express";
import { BooksController } from "../controllers/books.js";

export const booksRouter = Router();

booksRouter.get("/", BooksController.getAll);

booksRouter.get("/:slug", BooksController.getBySlug);

booksRouter.post("/", BooksController.createBook);

booksRouter.delete("/:id", BooksController.deleteBook);

booksRouter.patch("/:id", BooksController.updateBook);
