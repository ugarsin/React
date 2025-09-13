import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Author = {
  id: number;
  name: string;
};

type Book = {
  id: number;
  title: string;
  authors: Author[];
};

type Page = {
  currentPage: number;
  rowsPerPage: number;
  totalPages: number;
  totalRows: number;
  data: Book[];
};

function BooksIndex() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const loadData = (page: number) => {
    axios
      .get<Page>(
        `http://localhost:5149/api/books/get-paged-books-with-authors/${page}/${pageSize}`
      )
      .then((response) => {
        setBooks(response.data.data);
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
      <h2>Books Index</h2>

      <Link
        to="/createbook"
        style={{ color: "white" }}
        className="btn btn-primary m-2"
      >
        Create New
      </Link>

      <table className="table table-hover table-bordered">
        <thead className="table-light">
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
                {book.authors.length > 0
                  ? book.authors.map((author, index) => (
                      <span key={index}>
                        {author.name}
                        <br />
                      </span>
                    ))
                  : "No authors"}
              </td>
              <td>
                <Link to={`/editbook2/${book.id}`} style={{ color: "white" }} className="btn btn-sm btn-warning me-1">Edit</Link>
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

export default BooksIndex;
