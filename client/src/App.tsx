import { Link, Route, Routes } from "react-router-dom";
import BooksIndex from "./books";
import "./App.css";
import BookForm from "./books/create";
import EditBookForm from "./books/edit";
import AuthorsIndex from "./authors";
import AuthorForm from "./authors/create";
import EditAuthorForm from "./authors/edit";

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            MySite
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" style={{ margin: "0 1rem", color: "white" }}>Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/books" style={{ margin: "0 1rem", color: "white" }}>Books</Link>
              </li>
              <li className="nav-item">
                <Link to="/authors" style={{ margin: "0 1rem", color: "white" }}>Authors</Link>
              </li>
              <li className="nav-item">
                <Link to="/" style={{ margin: "0 1rem", color: "white" }}>About</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome Home</h1>} />
        <Route path="/books" element={<BooksIndex />} />
        <Route path="/createbook" element={<BookForm />} />
        <Route path="/editbook/:id" element={<EditBookForm />} />
        <Route path="/authors" element={<AuthorsIndex />} />
        <Route path="/editauthor/:id" element={<EditAuthorForm />} />
        <Route path="/createauthor" element={<AuthorForm />} />
      </Routes>
    </>
  );
}

export default App;
