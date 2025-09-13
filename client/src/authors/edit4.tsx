import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Book = {
  id: number;
  title: string;
};

type Author = {
  id: number;
  name: string;
  books: Book[];
};

type FormData = {
  name: string;
  bookIds: number[]; // IDs of selected books
};

export default function EditAuthorForm4() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      bookIds: [],
    },
    mode: "onSubmit"
  });

  // Fetch all books for multi-select
  useEffect(() => {
    axios
      .get<Book[]>("http://localhost:5149/api/books/")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch author details and pre-fill form
  useEffect(() => {
    if (!id) return;

    axios
      .get<Author[]>(
        `http://localhost:5149/api/authors/get-author-with-books/${id}`
      )
      .then((res) => {
        const author = res.data[0];
        reset({
          name: author.name,
          bookIds: author.books.map((b) => b.id),
        });
      })
      .catch((err) => console.error(err));
  }, [id, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.post("http://localhost:5149/api/authors", {
        id: Number(id),
        name: data.name.trim(),
        bookIds: data.bookIds,
      });

      toast.success("Author updated successfully!");
      navigate("/authors");
    } catch (error) {
      console.error("Error updating author:", error);
      toast.error("Failed to update author!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Edit Author {id}</h2>

      <form
        onSubmit={handleSubmit(
          onSubmit,
          (errors) => {
            // if (errors.name?.message) {
            //   toast.error(errors.name.message);
            // }

            // Trigger a toast for each error
            Object.values(errors).forEach((err) => {
              if (err?.message) {
                toast.error(err.message);
              }
            });
          })}
        className="flex flex-col gap-4"
      >
        {/* Author Name */}
        <div>
          <input
            {...register("name", {
              required: "Name is required",
              validate: value => value.trim() !== "" || "Name is required"
            })}
            type="text"
            placeholder="Author Name"
            className="form-control p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <span className="fw-bold text-danger text-sm">{errors.name.message}</span>
          )}
        </div>

        {/* Books Multi-select */}
        <div>
          {/* <Controller
            control={control}
            name="bookIds"
            render={({ field }) => (
              <select
                {...field}
                multiple
                className="form-select p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            )}
          /> */}
          <Controller
            name="bookIds"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                multiple
                className="form-control"
                value={field.value.map(String)} // convert numbers to strings
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => Number(option.value)
                  );
                  field.onChange(values);
                }}
              >
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <Link to="/authors" type="button" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
