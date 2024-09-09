"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
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
        {blogs.map(({ id, title, creationtime }) => (
          <BlogHeader key={id} id={id} title={title} date={creationtime} />
        ))}
      </div>
    </div>
  );
};

const BlogHeader = ({ title, date, id }: { title: string; date: string; id: number }) => {
  return (
    <Link href={`/article/${id}`}>
      <div className="flex justify-between my-4 pt-4">
        <h1>{title}</h1>
        <p>{date}</p>
      </div>
    </Link>
  );
};

export default Blogs;
