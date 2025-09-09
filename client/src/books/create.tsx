import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormData = {
  title: string;
  authorIds?: Author[]; // optional array of IDs
};

type Author = {
  id: number;
  name: string;
};

export default function BookForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [authors, setAuthors] = useState<Author[]>([]);
  const navigate = useNavigate();

  // Fetch authors
  useEffect(() => {
    axios.get<Author[]>("http://localhost:5149/api/authors/")
      .then(res => setAuthors(res.data))
      .catch(err => console.error(err));
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!data.title || data.title.trim() === "") return;

    // Convert authorIds from string[] to number[]
    const authorIds = data.authorIds
      ? (Array.isArray(data.authorIds) ? data.authorIds.map(Number) : [Number(data.authorIds)])
      : [];

    try {
      await axios.post("http://localhost:5149/api/books", {
        id: 0,
        title: data.title.trim(),
        authorIds,
      });

      toast.success("Book submitted successfully!");
      reset();

      // Navigate to /books after submission
      setTimeout(() => { navigate("/books") }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit book!");
    }
  };

  const cancel = () => navigate("/books");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Add a Book</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* Book Title */}
        <div>
          <input
            {...register("title", { required: "Title is required" })}
            type="text"
            placeholder="Book Title"
            className="form-control p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
        </div>

        {/* Authors Selection */}
        <div>
          <select
            {...register("authorIds", {
              setValueAs: v => Array.isArray(v) ? v.map(Number) : [Number(v)],
            })}
            multiple
            className="form-select p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            {authors.map(author => (
              <option key={author.id} value={author.id}>{author.name}</option>
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
