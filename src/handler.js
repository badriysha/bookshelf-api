const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    // create validation
    if (!name || name === '') {
        return h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku'
            })
            .code(400);
    }
    if (readPage > pageCount) {
        return h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            })
            .code(400);
    }

    const id = nanoid(16);
    const finished = Boolean(readPage === pageCount);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt
    }

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        return h
            .response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id
                }
            })
            .code(201);
    }
    return h
        .response({
            status: 'error',
            message: 'Buku gagal ditambahkan'
        })
        .code(500);
}

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let getBooks = books;

    if (name) {
        getBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (reading) {
        const hasReading = reading === "1";
        getBooks = books.filter((book) => book.reading === hasReading);
    }
    if (finished) {
        const hasFinished = finished === "1";
        getBooks = books.filter((book) => book.finished === hasFinished);
    }

    return h
    .response({
        status: 'success',
        data: {
            books: getBooks.map((book) => {
                return {
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }
            }),
        }
    })
    .code(200);
}

getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter((book) => book.id === id)[0];

    if (book !== undefined) {
        return  {
            status: 'success',
            data: {
                book,
            },
        }
    }

    return h
        .response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        })
        .code(404);
}

const updateBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const { name, pageCount, readPage} = request.payload;

    if (!name || name === '') {
        return h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            })
            .code(400);
    }
    if (readPage > pageCount) {
        return h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            })
            .code(400);
    }

    const updatedAt = new Date().toISOString();
    const booksIndex = books.findIndex((book) => book.id === id);

    if (booksIndex !== -1) {
        books[booksIndex] = {
            ...books[booksIndex],
            ...request.payload,
            updatedAt,
        }

        return h
            .response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            })
            .code(200);
    }

    return h
        .response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        })
        .code(404);
}

const deleteBookHandler = (request, h) => {
    const { id } = request.params;
    const booksIndex = books.findIndex((book) => book.id === id);

    if (booksIndex !== -1) {
        books.splice(booksIndex, 1);

        return h
            .response({
                status: 'success',
                message: 'Buku berhasil dihapus'
            })
            .code(200);
    }

    return h
        .response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        })
        .code(404);
}

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookHandler,
}