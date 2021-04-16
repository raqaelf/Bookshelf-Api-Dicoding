/* eslint linebreak-style: ["error", "windows"]*/

const {nanoid} = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const id = nanoid(16);
  const finished = (pageCount === readPage) ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};
const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;
  let filtered;
  if (name) {
    filtered = 'byName';
  } else if (reading) {
    filtered = 'byReading';
  } else if (finished) {
    filtered = 'byFinished';
  } else {
    filtered = 'none';
  }
  switch (filtered) {
    case 'byName': {
      const response = h
          .response({
            status: 'success',
            data: {
              books: books
                  .filter((book) => book.name
                      .toLowerCase()
                      .includes(name.toLowerCase()))
                  .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                  })),
            },
          })
          .code(200);
      return response;
    }
    case 'byReading': {
      const response = h
          .response({
            status: 'success',
            data: {
              books: books
                  .filter((book) => book.reading == reading)
                  .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                  })),
            },
          })
          .code(200);
      return response;
    }
    case 'byFinished': {
      const response = h
          .response({
            status: 'success',
            data: {
              books: books
                  .filter((book) => book.finished == finished)
                  .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                  })),
            },
          })
          .code(200);
      return response;
    }
    default: {
      const response = h
          .response({
            status: 'success',
            data: {
              books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              })),
            },
          })
          .code(200);
      return response;
    }
  }
};
const getBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const book = books.filter((book) => book.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const updatedAt = new Date().toISOString();
  const finished = (pageCount === readPage) ? true : false;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
