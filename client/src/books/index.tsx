import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Book = {
  id: number;
  title: string;
  authors: Author[];
};

type Author = {
  id: number;
  name: string;
};

type Page = {
  currentPage: number;
  rowsPerPage: number;
  totalPages: number;
  totalRows: number;
  data: Book[];
}

function BooksIndex() {
  const [books, setBooks] = useState<Book[]>([]);
  
  useEffect(() => {
    axios.get<Page[]>('http://localhost:5149/api/books/get-paged-books-with-authors/1/5')
      .then(response => setBooks(response.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className='container mt-3'>
      <h2>Books Index</h2>
      
      <Link to="/createbook" style={{ color: "white" }} className='btn btn-primary m-2'>
        Create New
      </Link>

      <table className='table table-hover table-bordered'>
        <thead className='table-light'>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Authors</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>
                {book.authors.length > 0 ? (
                  book.authors.map((Author, index) => (
                    <span key={index}>
                      {Author.name}<br/>
                    </span>
                  ))
                ) : (
                  "No authors"
                )}
              </td>
              <td>
                <Link to={`/editbook/${book.id}`} style={{ color: "white" }} className='btn btn-sm btn-warning me-1'>
                  Edit
                </Link>
                <button className="btn btn-sm btn-info me-1">Details</button>
                <button className="btn btn-sm btn-danger me-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BooksIndex;
