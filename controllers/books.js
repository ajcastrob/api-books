import books from "../data.json" with { type: "json" };
import crypto from "node:crypto";
import { validateSchema, validatePartialSchema } from "../schema/books.js";

const notFound = (res, message) => {
  return res.status(404).json({ error: message });
};

export class booksController {
  static getAll = (req, res) => {
    const { genre } = req.query;

    if (genre) {
      const booksForGenre = books.filter((book) =>
        book.genre.includes(genre.toLowerCase()),
      );

      return res.status(200).json(booksForGenre);
    }

    const nameBooks = books.map((book) => book.slug);

    res.json(nameBooks);
  };

  static getBySlug = (req, res) => {
    const { slug } = req.params;

    const book = books.find((b) => b.slug === slug);

    if (!book) {
      return notFound(res, "book not found");
    }

    res.json(book);
  };

  static createBook = (req, res) => {
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
  };

  static deleteBook = (req, res) => {
    const { id } = req.params;

    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found" });
    }

    //Remove book from the array.
    books.splice(bookIndex, 1);

    res.status(200).json({ message: `Book with id ${id} deleted` });
  };

  static updateBook = (req, res) => {
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
  };
}
