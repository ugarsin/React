// books/edit.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Author = {
  id: number;
  name: string;
};

type FormData = {
  title: string;
  authorIds: number[];
};

type Book = {
  id: number;
  title: string;
  authors: Author[];
};

export default function EditBookForm2() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [authors, setAuthors] = useState<Author[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      authorIds: [],
    },
  });

  // Fetch all authors
  useEffect(() => {
    axios
      .get<Author[]>("http://localhost:5149/api/authors/")
      .then((res) => setAuthors(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch book data
  useEffect(() => {
    if (!id) return;
    axios
      .get<Book[]>(`http://localhost:5149/api/books/get-book-with-authors/${id}`)
      .then((res) => {
        const book = res.data[0];
        const authorIds = book.authors.map((a) => a.id);
        reset({ title: book.title, authorIds });
      })
      .catch((err) => console.error(err));
  }, [id, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.post("http://localhost:5149/api/books", {
        id: id,
        title: data.title.trim(),
        authorIds: data.authorIds,
      });
      toast.success("Book updated successfully!");
      navigate("/books");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update book!");
    }
  };

  const cancel = () => navigate("/books");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Edit Book {id}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Book Title */}
        <div>
          <input
            {...register("title", { required: "Title is required" })}
            type="text"
            placeholder="Book Title"
            className="form-control p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title.message}</span>
          )}
        </div>

        {/* Authors Selection */}
        <div>
          <Controller
            name="authorIds"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                multiple
                className="form-select p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={field.value.map(String)} // convert number[] to string[] for select
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => Number(option.value)
                  );
                  field.onChange(values);
                }}
              >
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
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
          <button type="button" className="btn btn-secondary" onClick={cancel}>
            Cancel
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
