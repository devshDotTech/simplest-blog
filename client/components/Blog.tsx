"use client";
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    id: 0,
    creationtime: "",
  })
  useEffect( () => {
    const fetchBlog = async () => {
      const res = await fetch(`http://localhost:8000/api/blogs/${id}`);
      const data = await res.json();
      setBlog(data);
    }
    fetchBlog();
  }, [id])
  return (
    <div className='p-5'>
      <h1 className="text-6xl font-bold my-4">{blog.title}</h1>
      <p className='p-5 text-lg'>{blog.creationtime}</p>
      <p className='my-4 font-base text-2xl p-3'>{blog.content}</p>
      </div>
  )
}

export default Blog
