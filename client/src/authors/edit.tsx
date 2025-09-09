import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditAuthorForm() {
    const { id } = useParams();

    // useEffect(() => {
    // console.log('id=='+id);
    // }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  //const [selectedBook, setSelectedBook] = useState<number[]>([]);

  type Author = {
    id: number;
    name: string;
    books: Book[];
  };

  type Book = {
    id: number;
    title: string;
  };

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [Books, setBooks] = useState([]);

  const cancel = () => {
    navigate("/authors");
  };

  useEffect(() => {
    axios
      .get<Book[]>("http://localhost:5149/api/books/")
      .then((response) => {
        setBooks(response.data);
        console.log(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
        .get<Author[]>(`http://localhost:5149/api/authors/get-author-with-books/${id}`)
        .then((response) => {
            const author = response.data[0];
            setName(author.name);
            const bookIds = author.books.map((book) => book.id);
            setSelectedBooks(bookIds); // sets SelectedAuthors
            console.log(author);
            })      
            .catch((err) => console.error(err));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:5149/api/authors`, {
        id: id,
        name: name,
        bookIds: selectedBooks,
      });

      console.log("Author submitted:", response.data);
      toast.success("Author submitted successfully!");
      setName("");
      setSelectedBooks([]);

      navigate('/authors');
    } catch (error) {
      console.error("Error submitting book:", error);
      toast.error("Failed to submit book!");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Edit an Author {id}</h2>
      <form onSubmit={save} className="flex flex-col gap-4">
        <div>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            id="InputAuthorName"
            placeholder="Author Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            multiple
            id="SelectedAuthors"
            name="SelectedAuthors"
            className="form-select"
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, (option) =>
                parseInt(option.value)
              );
              setSelectedBooks(values);
            }}
          >
            {Books.map((s: Author) => (
              <option 
                key={s.id} 
                value={s.id}
                selected={selectedBooks.includes(s.id)}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <Link to="/authors" type="button" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
