import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Book = {
  id: number;
  title: string;
};

type Author = {
  id: number;
  name: string;
  books: Book[];
};

type PagedResponse = {
  currentPage: number;
  rowsPerPage: number;
  totalPages: number;
  totalRows: number;
  data: Author[];
};

function AuthorsIndex() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  const loadData = (page: number) => {
    axios
      .get<PagedResponse>(
        `http://localhost:5149/api/authors/get-paged-authors-with-books/${page}/${pageSize}`
      )
      .then((response) => {
        setAuthors(response.data.data);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadData(page);
    }
  };

  return (
    <div className="container mt-3">
      <h2>Authors Index</h2>

      <Link
        to="/createauthor"
        style={{ color: "white" }}
        className="btn btn-primary m-2"
      >
        Create New
      </Link>

      <table className="table table-hover table-bordered">
        <thead className="table-light">
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
                {author.books.length > 0
                  ? author.books.map((book, index) => (
                      <span key={index}>
                        {book.title}
                        <br />
                      </span>
                    ))
                  : "No books"}
              </td>
              <td>
                <Link
                  to={`/editauthor/${author.id}`}
                  style={{ color: "white" }}
                  className="btn btn-sm btn-warning me-1"
                >
                  Edit
                </Link>
                <button className="btn btn-sm btn-info me-1">Details</button>
                <button className="btn btn-sm btn-danger me-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      {/* <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>

        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn mx-1 ${
                currentPage === page ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div> */}

      <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => goToPage(1)}
        >
          First
        </button>

        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>

        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>

        <button
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(totalPages)}
        >
          Last
        </button>
      </div>
    </div>
  );
}

export default AuthorsIndex;
