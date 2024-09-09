"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Blog {
  title: string;
  content: string;
  creationtime: string;
  id: number;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/blogs");
        const data = await res.json();
        console.log(data);
        setBlogs(data);
      } catch (error) { }
    };
    fetchBlogs();
  }, []);
  return (
    <div className="p-5">
      <h1 className="text-6xl font-bold my-4">Personal Blog</h1>
      <div className="divide-y divide-gray-800 border-b-white p-4">
        {blogs.map(({ id, title }) => (
          <BlogHeader
            key={id}
            id={id}
            title={title}
            setBlogs={setBlogs}
            blogs={blogs}
          />
        ))}
      </div>
    </div>
  )
};

const BlogHeader = ({
  title,
  id,
  blogs,
  setBlogs,
}: {
  title: string;
  id: number;
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
  blogs: Blog[];
}) => {
  const token = localStorage.getItem("token");
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      alert(data.message);
      router.refresh();
      router.replace(`/admin`);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-between my-4 pt-4">
      <h1>{title}</h1>
      <div className="flex justify-between gap-10">
        <Link href={`admin/edit/${id}`}>
          <button>edit</button>
        </Link>
        <button onClick={handleDelete}>delete</button>
      </div>
    </div>
  );
};

export default AdminBlogs;
