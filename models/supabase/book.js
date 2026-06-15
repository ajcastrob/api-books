import { supabase } from "./client.js";

export class BooksModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();

      const { data: genres } = await supabase
        .from("genres")
        .select("id")
        .ilike("name", lowerCaseGenre)
        .limit(1);

      if (!genres || genres.length === 0) return [];

      const { data: bookGenres } = await supabase
        .from("book_genres")
        .select("book_id")
        .eq("genre_id", genres[0].id);

      if (!bookGenres || bookGenres.length === 0) return [];

      const bookIds = bookGenres.map((bg) => bg.book_id);

      const { data: books } = await supabase
        .from("books")
        .select("slug")
        .in("id", bookIds);

      return books ? books.map((b) => b.slug) : [];
    }

    const { data: books } = await supabase.from("books").select("slug");

    return books ? books.map((b) => b.slug) : [];
  };

  static getBySlug = async ({ slug }) => {
    const lowerCaseSlug = slug.toLowerCase();

    const { data: book } = await supabase
      .from("books")
      .select("*")
      .ilike("slug", lowerCaseSlug)
      .limit(1)
      .single();

    return book || null;
  };

  static createBook = async ({ info }) => {
    const { data: book, error: bookError } = await supabase
      .from("books")
      .insert({
        name: info.name,
        author: info.author,
        conflict: info.conflict,
        year: info.year,
        image: info.image,
        slug: info.slug,
        summary: info.summary,
        description: info.description,
      })
      .select()
      .single();

    if (bookError) throw bookError;

    const bookId = book.id;

    for (const genreName of info.genre) {
      const { data: existing } = await supabase
        .from("genres")
        .select("id")
        .eq("name", genreName)
        .limit(1)
        .single();

      let genreId;

      if (existing) {
        genreId = existing.id;
      } else {
        const { data: newGenre } = await supabase
          .from("genres")
          .insert({ name: genreName })
          .select("id")
          .single();
        genreId = newGenre.id;
      }

      await supabase
        .from("book_genres")
        .insert({ book_id: bookId, genre_id: genreId });
    }

    for (const characterName of info.characters) {
      const { data: existing } = await supabase
        .from("characters")
        .select("id")
        .eq("name", characterName)
        .limit(1)
        .single();

      let characterId;

      if (existing) {
        characterId = existing.id;
      } else {
        const { data: newCharacter } = await supabase
          .from("characters")
          .insert({ name: characterName })
          .select("id")
          .single();
        characterId = newCharacter.id;
      }

      await supabase
        .from("book_characters")
        .insert({ book_id: bookId, character_id: characterId });
    }

    return { id: bookId, ...info };
  };

  static deleteBook = async ({ id }) => {
    const { data: book } = await supabase
      .from("books")
      .select("id")
      .eq("id", id)
      .limit(1)
      .single();

    if (!book) return null;

    await supabase.from("book_genres").delete().eq("book_id", id);
    await supabase.from("book_characters").delete().eq("book_id", id);

    const { error } = await supabase.from("books").delete().eq("id", id);

    if (error) throw error;

    return 1;
  };

  static updateBook = async ({ id, info }) => {
    const { data: book } = await supabase
      .from("books")
      .select("id")
      .eq("id", id)
      .limit(1)
      .single();

    if (!book) return null;

    const updateData = {};
    if (info.name) updateData.name = info.name;
    if (info.author) updateData.author = info.author;
    if (info.conflict) updateData.conflict = info.conflict;
    if (info.year) updateData.year = info.year;
    if (info.image) updateData.image = info.image;
    if (info.slug) updateData.slug = info.slug;
    if (info.summary) updateData.summary = info.summary;
    if (info.description) updateData.description = info.description;

    if (Object.keys(updateData).length > 0) {
      await supabase.from("books").update(updateData).eq("id", id);
    }

    if (info.genre) {
      await supabase.from("book_genres").delete().eq("book_id", id);

      for (const genreName of info.genre) {
        const { data: existing } = await supabase
          .from("genres")
          .select("id")
          .eq("name", genreName)
          .limit(1)
          .single();

        let genreId;

        if (existing) {
          genreId = existing.id;
        } else {
          const { data: newGenre } = await supabase
            .from("genres")
            .insert({ name: genreName })
            .select("id")
            .single();
          genreId = newGenre.id;
        }

        await supabase
          .from("book_genres")
          .insert({ book_id: id, genre_id: genreId });
      }
    }

    if (info.characters) {
      await supabase.from("book_characters").delete().eq("book_id", id);

      for (const characterName of info.characters) {
        const { data: existing } = await supabase
          .from("characters")
          .select("id")
          .eq("name", characterName)
          .limit(1)
          .single();

        let characterId;

        if (existing) {
          characterId = existing.id;
        } else {
          const { data: newCharacter } = await supabase
            .from("characters")
            .insert({ name: characterName })
            .select("id")
            .single();
          characterId = newCharacter.id;
        }

        await supabase
          .from("book_characters")
          .insert({ book_id: id, character_id: characterId });
      }
    }

    const { data: updatedBook } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    return updatedBook;
  };
}
