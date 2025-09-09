import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Book = {
  id: number;
  title: string;
};

type Author = {
  id: number;
  name: string;
  books: Book[];
};

function AuthorsIndex() {
  const [authors, setAuthors] = useState<Author[]>([]);
  
  useEffect(() => {
    axios.get<Author[]>('http://localhost:5149/api/authors/get-paged-authors-with-books/1/5')
      .then(response => setAuthors(response.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className='container mt-3'>
      <h2>Authors Index</h2>
      
      <Link to="/createauthor" style={{ color: "white" }} className='btn btn-primary m-2'>
        Create New
      </Link>

      <table className='table table-hover table-bordered'>
        <thead className='table-light'>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Books</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.id}</td>
              <td>{author.name}</td>
              <td>
                {author.books.length > 0 ? (
                  author.books.map((Book, index) => (
                    <span key={index}>
                      {Book.title}<br/>
                    </span>
                  ))
                ) : (
                  "No books"
                )}
              </td>
              <td>
                <Link to={`/editauthor/${author.id}`} style={{ color: "white" }} className='btn btn-sm btn-warning me-1'>
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

export default AuthorsIndex;
