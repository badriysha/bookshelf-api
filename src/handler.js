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

module.exports = {
    addBookHandler,
}