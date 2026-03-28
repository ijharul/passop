import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const token = localStorage.getItem("token");

const Manager = () => {
  const ref = useRef();
  const passwordref = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);

const getPasswords = async () => {
  try {
    const token = localStorage.getItem("token");

    let req = await fetch("https://passop-8ewz.onrender.com", {
      headers: {
        Authorization: token  
      }
    });

    let passwords = await req.json();

    if (Array.isArray(passwords)) {
      setpasswordArray(passwords);
    } else {
      console.log("Not array:", passwords);
      setpasswordArray([]);
    }

  } catch (err) {
    console.log(err);
    setpasswordArray([]);
  }
};

  useEffect(() => {
   getPasswords();
  }, []);

  const copyText = (text) => {
    toast("Copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const showPassword = () => {
    passwordref.current.type = "text";
    if (ref.current.src.includes("ceye.svg")) {
      ref.current.src = "icons/oeye.svg";
      passwordref.current.type = "text";
    } else {
      ref.current.src = "icons/ceye.svg";
      passwordref.current.type = "password";
    }
  };

const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      console.log(form);

      //if any such id exists in the db then delete it
     
      if(form.id){
        await fetch("https://passop-8ewz.onrender.com",{
          method:"DELETE",
           headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token")
  },
          body:JSON.stringify({id:form.id})
        })
      }

      
      const newId = uuidv4();

      setpasswordArray([...passwordArray, {...form, id: newId}]);

     await fetch("https://passop-8ewz.onrender.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token") 
  },
  body: JSON.stringify({...form, id: newId})
});
      // localStorage.setItem("passwords", JSON.stringify([...passwordArray, {...form,id: uuidv4()}]));
      setform({ site: "", username: "", password: "" });
      console.log([...passwordArray, form]);
      toast("Password Saved!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast("ERROR!! Password Not Saved!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const deletePassword = async (id) => {
    console.log(`delete pass of ${id}`);
    let c = confirm("Do you really want to delete?");
    if (c) {
      setpasswordArray(passwordArray.filter((item) => item.id !== id));
      // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item=>item.id!==id)));
      let res = await fetch("https://passop-8ewz.onrender.com", {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token") // 🔥
  },
  body: JSON.stringify({id})
});
    toast("Password Deleted!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };}

  const editPassword = (id) => {
    console.log(`edit pass of ${id}`);
    setform({ ...passwordArray.filter((i) => i.id === id)[0], id: id });
    setpasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      <div className="absolute inset-0  -z-10 h-full w-full  bg-green-50 dark:bg-gray-800 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="p-3 md:p-0 max-w-6xl mx-auto min-h-[86vh]">
        <div className="flex justify-end p-4">
  <button 
    onClick={()=>{
      localStorage.removeItem("token");
      window.location.reload();
    }}
    className="bg-red-500 text-white px-4 py-1 rounded"
  >
    Logout
  </button>
</div>
        <h1 className="text-4xl text font-bold text-center mb-4">
          <span className="text-green-700"> &lt;</span>
          Pass
          <span className="text-green-700">OP/&gt;</span>
        </h1>
        <p
          className="text-green-900 text-lg
         text-center "
        >
          Your own Password Manager
        </p>

        <div className="text-white flex flex-col p-4 gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter Website URL "
            className="rounded-full border border-green-500 w-full bg-white text-black px-4 py-1"
            type="text"
            name="site"
            id=""
          />
          <div className="flex flex-col md:flex-row w-full gap-4">
            <input
              value={form.username || ""}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full bg-white text-black px-4 py-1"
              type="text"
              autoComplete="off"
              name="username"
            />
            <div className="relative">
              <input
                ref={passwordref}
                value={form.password || ""}
                onChange={handleChange}
                placeholder="Enter Password"
                autoComplete="new-password"
                className="rounded-full border border-green-500 w-full bg-white  text-black  px-4 py-1"
                type="password"
                name="password"
              />
              <span
                className="absolute right-0 text-black px-1 cursor-pointer w-9 my-0.5"
                onClick={showPassword}
              >
                <img ref={ref} src="icons/ceye.svg" alt="eye" />
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="text-black gap-4 flex justify-center items-center bg-green-600 rounded-full px-8 py-2 
          w-fit border border-green-900 hover:bg-green-400
          cursor-pointer"
          >
            <lord-icon
              src="https://cdn.lordicon.com/reuxrwkr.json"
              trigger="hover"
            ></lord-icon>
            Save Password
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div className="text-center text-gray-500 py-10">
  No passwords saved yet 🔐
</div>}
          {passwordArray.length != 0 && (
            <div className="overflow-x-auto rounded-lg">
              <table className="table-auto w-full  rounded-md  mb-10">
                <thead className=" bg-green-800 text-white">
                  <tr>
                    <th className="py-2">Site</th>
                    <th className="py-2">Username</th>
                    <th className="py-2">Password</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-green-100 ">
                  {passwordArray.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="border border-white py-2 w-32">
                          <div className="flex items-center justify-center gap-2">
                            <a
                              href={item.site}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.site}
                            </a>

                            <img
                              className="w-5 h-5 cursor-pointer iconcopy "
                              onClick={() => {
                                copyText(item.site);
                              }}
                              src="icons/copy.svg"
                              alt="copy"
                            />
                          </div>
                        </td>
                        <td className=" border border-white py-2 text-center w-32">
                          <div className="flex items-center justify-center gap-2">
                            {item.username}
                            <img
                              className="w-5 h-5 cursor-pointer iconcopy "
                              onClick={() => {
                                copyText(item.username);
                              }}
                              src="icons/copy.svg"
                              alt="copy"
                            />
                          </div>
                        </td>
                        <td className=" border border-white py-2 text-center w-32">
                          <div className="flex items-center justify-center gap-2">
                            {item.password}
                            <img
                              className="w-5 h-5 cursor-pointer iconcopy "
                              onClick={() => {
                                copyText(item.password);
                              }}
                              src="icons/copy.svg"
                              alt="copy"
                            />
                          </div>
                        </td>
                        <td className="  border border-white py-2 text-center w-22">
                          <div className="flex justify-center gap-4">
                            {/* //edit  */}
                            <span>
                              {" "}
                              <img
                                onClick={() => {
                                  editPassword(item.id);
                                }}
                                className="w-5 h-5 cursor-pointer"
                                src="icons/edit.svg"
                                alt=""
                              />{" "}
                            </span>
                            {/* //delete */}
                            <span>
                              {" "}
                              <img
                                onClick={() => {
                                  deletePassword(item.id);
                                }}
                                className="w-5 h-5 cursor-pointer"
                                src="icons/delete.svg"
                                alt=""
                              />{" "}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
