import React, { useState } from "react";

const Signup = ({ setShowLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signup = async () => {
    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.msg) {
      alert("Signup successful");

      // reset form
      setForm({ email: "", password: "" });

      setShowLogin(true); // go to login
    } else {
      alert("Signup failed");
    }
  };

  return (
   <div className="flex justify-center items-center h-full">
      
      <form 
        autoComplete="off"
        className="flex flex-col gap-5 bg-white p-8 rounded-2xl shadow-lg w-[320px]"
      >
        <h2 className="text-xl font-bold text-center">Signup</h2>

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
          onClick={signup}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-500 transition cursor-pointer "
        >
          Signup
        </button>

        <p
          onClick={() => setShowLogin(true)}
          className="text-center cursor-pointer text-blue-600"
        >
          Already have an account? Login
        </p>
      </form>

    </div>
  );
};

export default Signup;