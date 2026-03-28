import React, { useState } from "react";

const Login = ({ setShowLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async () => {
    const res = await fetch("https://passop-8ewz.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);

      // reset form
      setForm({ email: "", password: "" });

      alert("Login successful");

      // redirect without weird autofill issue
      window.location.href = "/";
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      
      <form 
        autoComplete="off"
       className="flex flex-col gap-5 bg-white p-8 rounded-2xl shadow-lg w-[320px]"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          placeholder="Email"
          autoComplete="off"
          className="border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          name="password"
          type="password"
          value={form.password || ""}
          onChange={handleChange}
          placeholder="Password"
          autoComplete="new-password"
          className="border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="button"
          onClick={login}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-500 transition-all duration-200"
        >
          Login
        </button>

        <p
          onClick={() => setShowLogin(false)}
          className="text-center cursor-pointer text-blue-600"
        >
          New user? Signup
        </p>
      </form>

    </div>
  );
};

export default Login;