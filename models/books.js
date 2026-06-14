import books from "../data.json" with { type: "json" };
import crypto from "crypto";

export class BooksModel {
  static getAll = ({ genre }) => {
    if (genre) {
      return books.filter((book) => book.genre.includes(genre.toLowerCase()));
    }

    const nameBooks = books.map((book) => book.slug);

    return nameBooks;
  };

  static getBySlug = ({ slug }) => {
    const book = books.find((b) => b.slug === slug);

    return book;
  };

  static createBook = ({ info }) => {
    const newBook = {
      id: crypto.randomUUID(),
      ...info,
    };

    books.push(newBook);

    return newBook;
  };

  static deleteBook = ({ id }) => {
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex < 0) return false;

    //Remove book from the array.
    books.splice(bookIndex, 1);

    return bookIndex;
  };

  static updateBook = ({ id, info }) => {
    const bookIndex = books.find((book) => book.id === id);

    if (!bookIndex) return false;

    const updateBook = {
      ...books[bookIndex],
      ...info,
    };

    books[bookIndex] = updateBook;

    return updateBook;
  };
}
