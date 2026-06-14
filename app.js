import express from "express";
import books from "./data.json" with { type: "json" };
import cors from "cors";
import { validateSchema, validatePartialSchema } from "./schema/books.js";
import crypto from "node:crypto";
import { error } from "node:console";

const notFound = (res, message) => {
  return res.status(404).json({ error: message });
};

const app = express();

const port = process.env.PORT || 1234;

app.disable("x-powered-by");

app.use(express.json());

app.use(cors());

app.get("/books", (req, res) => {
  const { genre } = req.query;

  if (genre) {
    const booksForGenre = books.filter((book) =>
      book.genre.includes(genre.toLowerCase()),
    );

    return res.status(200).json(booksForGenre);
  }

  const nameBooks = books.map((book) => book.slug);

  res.json(nameBooks);
});

app.get("/books/:slug", (req, res) => {
  const { slug } = req.params;

  const book = books.find((b) => b.slug === slug);

  if (!book) {
    return notFound(res, "book not found");
  }

  res.json(book);
});

app.post("/books", (req, res) => {
  const info = req.body;
  const result = validateSchema(info);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newBook = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  books.push(newBook);

  res.status(201).json(newBook);
});

app.delete("/books/:id", (req, res) => {
  const { id } = req.params;

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  //Remove book from the array.
  books.splice(bookIndex, 1);

  res.status(200).json({ message: `Book with id ${id} deleted` });
});

app.patch("/books/:id", (req, res) => {
  const { id } = req.params;
  const result = validatePartialSchema(req.body);
  console.log(result);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const bookIndex = books.find((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  const updateBook = {
    ...books[bookIndex],
    ...result.data,
  };

  books[bookIndex] = updateBook;

  res.status(200).json(updateBook);
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}/`);
});
