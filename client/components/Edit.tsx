"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Edit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [token, setToken] = useState(localStorage.getItem('token'))
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/blogs/${id}`);
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (error) { }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      title: title,
      content: content,
    };
    try {
      const res = await fetch(`http://localhost:8000/api/blogs/${id}`, {
        method: "PATCH",

        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await res.json();
      alert(data.message);
      router.replace("/admin");
    } catch (error) { }
  };
  return (
    <div className="max-w-6xl mx-auto min-h-screen">
      <div className="bg-blue-400 h-auto text-white w-[35rem] mx-auto p-5 rounded-md">
        <h1 className="text-xl font-bold mb-2">Edit</h1>
        <form
          action="submit"
          className="flex flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <label className="text-xl font-normal" htmlFor="">
            Title
          </label>
          <input
            className="border border-gray-300 text-black p-2 rounded-md mx-1"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="text-xl font-normal" htmlFor="">
            Password
          </label>
          <textarea
            className="border border-gray-300 text-black p-2 rounded-md mx-1"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="p-3 bg-blue-500 text-white font-semibold text-xl mt-1 rounded-md">
            Edit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
