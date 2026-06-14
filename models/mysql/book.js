import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "booksdeb",
};

const connection = await mysql.createConnection(config);

export class BooksModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();

      const [genres] = await connection.query(
        `SELECT id, name FROM genres WHERE LOWER(name) = ?`,
        [lowerCaseGenre],
      );

      if (genres.length === 0) return [];

      const [{ id }] = genres;

      const [books] = await connection.query(
        `SELECT DISTINCT b.* 
              FROM books b
              INNER JOIN book_genres bg ON b.id = bg.book_id
              WHERE bg.genre_id = ?`,
        [id],
      );

      const nameBooks = books.map((b) => b.slug);

      return nameBooks;
    }

    const [books] = await connection.query("SELECT * FROM books");

    const namesBooks = books.map((b) => b.slug);

    return namesBooks;
  };

  static getBySlug = async ({ slug }) => {
    const lowerCaseSlug = slug.toLowerCase();

    const [book] = await connection.query(
      `SELECT * FROM books WHERE slug = ?`,
      [lowerCaseSlug],
    );

    return book;
  };

  static createBook = async ({ info }) => {
    try {
      //Insertar el libro principal
      const [result] = await connection.query(
        `INSERT INTO books (name, author, conflict, year, image, slug, summary,
            description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          info.name,
          info.author,
          info.conflict,
          info.year,
          info.image,
          info.slug,
          info.summary,
          info.description,
        ],
      );
      const bookId = result.insertId;

      //Géneros-relación.
      for (const genreName of info.genre) {
        const [existing] = await connection.query(
          `SELECT id FROM genres WHERE name = ?`,
          [genreName],
        );

        const genreId =
          existing.length > 0
            ? existing[0].id
            : (
                await connection.query(`INSERT INTO genres (name) VALUES (?)`, [
                  genreName,
                ])
              )[0].insertId;

        await connection.query(
          `INSERT INTO book_genres (book_id, genre_id) VALUES (?, ?)`,
          [bookId, genreId],
        );
      }

      // Personajes - relación
      for (const characterName of info.characters) {
        const [existing] = await connection.query(
          `SELECT id FROM characters WHERE name = ?`,
          [characterName],
        );

        const characterId =
          existing.length > 0
            ? existing[0].id
            : (
                await connection.query(
                  `INSERT INTO characters (name) VALUES (?)`,
                  [characterName],
                )
              )[0].insertId;

        await connection.query(
          `INSERT INTO book_characters (book_id, character_id) VALUES (?,?)`,
          [bookId, characterId],
        );
      }

      //Retornar datos.
      return { id: bookId, ...info };
    } catch (error) {
      throw error;
    }
  };

  static deleteBook = async ({ id }) => {
    const [book] = await connection.query(`SELECT id FROM books WHERE id = ?`, [
      id,
    ]);

    if (book.length === 0) return null;

    const [result] = await connection.query(`DELETE FROM books WHERE id = ?`, [
      id,
    ]);

    return result.affectedRows;
  };

  static updateBook = async ({ id, info }) => {
    const [book] = await connection.query(`SELECT id FROM books WHERE id = ?`, [
      id,
    ]);

    if (book.length === 0) return null;

    const fields = [];
    const values = [];

    if (info.name) {
      fields.push("name = ?");
      values.push(info.name);
    }
    if (info.author) {
      fields.push("author = ?");
      values.push(info.author);
    }
    if (info.conflict) {
      fields.push("conflict = ?");
      values.push(info.conflict);
    }
    if (info.year) {
      fields.push("year = ?");
      values.push(info.year);
    }
    if (info.image) {
      fields.push("image = ?");
      values.push(info.image);
    }
    if (info.slug) {
      fields.push("slug = ?");
      values.push(info.slug);
    }
    if (info.summary) {
      fields.push("summary = ?");
      values.push(info.summary);
    }
    if (info.description) {
      fields.push("description = ?");
      values.push(info.description);
    }

    if (fields.length > 0) {
      values.push(id);
      await connection.query(
        `UPDATE books SET ${fields.join(", ")} WHERE id = ?`,
        values,
      );
    }

    if (info.genre) {
      await connection.query(`DELETE FROM book_genres WHERE book_id = ?`, [id]);

      for (const genreName of info.genre) {
        const [existing] = await connection.query(
          `SELECT id FROM genres WHERE name = ?`,
          [genreName],
        );

        const genreId =
          existing.length > 0
            ? existing[0].id
            : (
                await connection.query(`INSERT INTO genres (name) VALUES (?)`, [
                  genreName,
                ])
              )[0].insertId;

        await connection.query(
          `INSERT INTO book_genres (book_id, genre_id) VALUES (?, ?)`,
          [id, genreId],
        );
      }
    }

    if (info.characters) {
      await connection.query(`DELETE FROM book_characters WHERE book_id = ?`, [
        id,
      ]);

      for (const characterName of info.characters) {
        const [existing] = await connection.query(
          `SELECT id FROM characters WHERE name = ?`,
          [characterName],
        );

        const characterId =
          existing.length > 0
            ? existing[0].id
            : (
                await connection.query(
                  `INSERT INTO characters (name) VALUES (?)`,
                  [characterName],
                )
              )[0].insertId;

        await connection.query(
          `INSERT INTO book_characters (book_id, character_id) VALUES (?,?)`,
          [id, characterId],
        );
      }
    }

    const [updatedBook] = await connection.query(
      `SELECT * FROM books WHERE id = ?`,
      [id],
    );
    return updatedBook[0];
  };
}
