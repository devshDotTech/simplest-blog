"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      username: username,
      password: password,
    };
    const res = await fetch(`http://localhost:8000/api/admin/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await res.json();
    setToken(data.token);
    console.log(data.token)
    localStorage.setItem('token', data.token);
    setUsername("");
    setPassword("");
    router.replace(`/admin`);
  };
  return (
    <div className="p-5 pt-20">
      <div className="bg-blue-400 h-auto text-white w-[35rem] mx-auto p-5 rounded-md">
        <h1 className="text-xl font-bold mb-2">Login</h1>
        <form
          action="submit"
          className="flex flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <label className="text-xl font-normal" htmlFor="">
            username
          </label>
          <input
            className="border border-gray-300 text-black p-2 rounded-md mx-1"
            type="text"
            name="username"
            value={username}
             onChange={(e) => setUsername(e.target.value)}
          />
          <label className="text-xl font-normal" htmlFor="">
            Password
          </label>
          <input
            className="border border-gray-300 text-black p-2 rounded-md mx-1"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link href={`/admin/signup`}>sign Up</Link>
          <button className="p-3 bg-blue-500 text-white font-semibold text-xl mt-1 rounded-md">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
