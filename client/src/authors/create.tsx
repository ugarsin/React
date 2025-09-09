import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormData = {
  name: string;
  bookIds?: Book[]; // optional array of IDs
};

type Book = {
  id: number;
  title: string;
};

export default function AuthorForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  // Fetch books
  useEffect(() => {
    axios.get<Book[]>("http://localhost:5149/api/books/")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!data.name || data.name.trim() === "") return;

    const bookIds = data.bookIds
      ? (Array.isArray(data.bookIds) ? data.bookIds.map(Number) : [Number(data.bookIds)])
      : [];

    try {
      await axios.post("http://localhost:5149/api/authors", {
        id: 0,
        name: data.name.trim(),
        bookIds,
      });

      toast.success("Author information submitted successfully!");
      reset();

      // Navigate to /books after submission
      setTimeout(() => { navigate("/authors") }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit author information!");
    }
  };

  const cancel = () => navigate("/authors");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Add an Author</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* Author Name */}
        <div>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            placeholder="Author Name"
            className="form-control p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        {/* Authors Selection */}
        <div>
          <select
            {...register("bookIds", {
              setValueAs: v => Array.isArray(v) ? v.map(Number) : [Number(v)],
            })}
            multiple
            className="form-select p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            {books.map(book => (
              <option key={book.id} value={book.id}>{book.title}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={cancel}>Cancel</button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
