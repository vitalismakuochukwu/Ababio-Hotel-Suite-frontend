import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { BiLoader } from "react-icons/bi";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const WorkerLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const [loginData, setLoginData] = useState({
    Email: "",
    Password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!loginData.Email || !loginData.Password) {
        toast.error("Please enter both email and password");
        return;
      }

      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/worker/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: loginData.Email, Password: loginData.Password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('worker-token', data.token);
        localStorage.setItem('workerEmail', loginData.Email);
        localStorage.setItem('workerName', data.Name);
        localStorage.setItem('workerPassword', loginData.Password);
        toast.success("Login successful! Redirecting to dashboard...");
        setTimeout(() => navigate("/worker-dashboard"), 1500);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex lg:items-center lg:justify-center w-full lg:flex-row flex-col">
      <ToastContainer />
      <div
        style={{
          backgroundImage: `url("../assets/logo.png")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: window.innerWidth > 768 ? "fixed" : "scroll"
        }}
        className="lg:w-1/2 relative bg-gradient-to-r from-green-500 to-blue-500 lg:h-screen"
      >
        <div className="hidden lg:flex lg:absolute static top-1/3 left-0 px-12 -translate-1/2 z-1 flex-col gap-3 items-center">
          <img className="h-24 w-24" src={logo} alt="" />
          <h2 className="text-3xl text-black">Welcome to ABABIO HOSTELS & SUITS</h2>
          <p className="text-black font-normal text-center">
            Manage hotel operations efficiently with our worker dashboard
          </p>
        </div>
      </div>

      <form
        className="h-screen lg:h-auto flex flex-col justify-center gap-3 lg:w-1/2 lg:pl-24 pt-0 lg:pt-auto bg-white lg:bg-none px-6 lg:px-auto"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="lg:hidden flex flex-col gap-4 items-center pb-12">
          <img className="h-12 w-12" src={logo} alt="" />
          <h2 className="lg:hidden text-lg text-black text-center">
            Welcome to ABABIO HOSTELS & SUITS
          </h2>
        </div>

        <h2 className="lg:text-3xl text-2xl text-justify lg:pb-8 font-bold">
          Worker Log in to Hotel Management
        </h2>

        <div className="flex flex-col gap-3 items-start">
          <label htmlFor="Email" className="font-semibold">
            Email Address
          </label>
          <input
            className="rounded-md border-2 p-2 lg:w-[400px] w-full"
            type="email"
            name="Email"
            value={loginData.Email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="Password" className="font-semibold">
            Password
          </label>
          <div className="relative rounded-md border-2 p-2 lg:w-[400px] w-full bg-white">
            <input
              className="border-none outline-none bg-transparent"
              type={seePassword ? "text" : "password"}
              name="Password"
              value={loginData.Password}
              onChange={handleChange}
              required
            />
            <div
              onClick={() => {
                setSeePassword((prev) => !prev);
              }}
            >
              {seePassword ? (
                <IoEyeOffOutline className="absolute top-1/3 right-3" />
              ) : (
                <IoEyeOutline className="absolute top-1/3 right-3" />
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`rounded-md flex items-center justify-center gap-4 p-2 px-4 text-white lg:w-[400px] text-center w-full mt-4 ${
            isLoading
              ? `bg-gray-400 hover:bg-gray-400 cursor-not-allowed`
              : `bg-purple-900 cursor-pointer hover:bg-purple-800`
          }`}
        >
          Sign in
          {isLoading && <BiLoader className="animate-spin" />}
        </button>


      </form>
    </div>
  );
};

export default WorkerLogin;
