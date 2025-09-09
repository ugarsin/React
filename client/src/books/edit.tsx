import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditBookForm() {
    const { id } = useParams();

    // useEffect(() => {
    // console.log('id=='+id);
    // }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [selectedAuthors, setSelectedAuthors] = useState<number[]>([]);
  //const [selectedBook, setSelectedBook] = useState<number[]>([]);

  type Book = {
    id: number;
    title: string;
    authors: Author[];
  };

  type Author = {
    id: number;
    name: string;
  };

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [Authors, setAuthors] = useState([]);

  const cancel = () => {
    navigate("/books");
  };

  useEffect(() => {
    axios
      .get<Author[]>("http://localhost:5149/api/authors/")
      .then((response) => {
        setAuthors(response.data);
        console.log(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
        .get<Book[]>(`http://localhost:5149/api/books/get-book-with-authors/${id}`)
        .then((response) => {
            const book = response.data[0];
            setTitle(book.title); // sets InputBookTitle
            const authorIds = book.authors.map((author) => author.id);
            setSelectedAuthors(authorIds); // sets SelectedAuthors
            console.log(book);
            })      
            .catch((err) => console.error(err));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:5149/api/books`, {
        id: id,
        title: title,
        authorIds: selectedAuthors,
      });

      console.log("Book submitted:", response.data);
      toast.success("Book submitted successfully!");
      setTitle("");
      setSelectedAuthors([]);

      navigate('/books');
    } catch (error) {
      console.error("Error submitting book:", error);
      toast.error("Failed to submit book!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Edit a Book {id}</h2>
      <form onSubmit={save} className="flex flex-col gap-4">
        <div>
          <input
            {...register("title", { required: "Title is required" })}
            type="text"
            id="InputBookTitle"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              setSelectedAuthors(values);
            }}
          >
            {Authors.map((s: Book) => (
              <option 
                key={s.id} 
                value={s.id}
                selected={selectedAuthors.includes(s.id)}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <Link to="/books" type="button" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
