import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import register from "../assets/register.webp";
import { registerUser } from "../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { mergeCart } from "../redux/slice/cartSlice";
const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  //Get redirect paramenter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, dispatch, navigate, isCheckoutRedirect, guestId, cart]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Registered: ", { name, email, password });
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex-col justify-center items-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full mx-auto max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium"> Rabbit</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey there! </h2>
          <p className="text-center mb-6">
            Enter your username and password to login
          </p>

          <div className="mb-4">
            <label htmlFor="" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 trainsition"
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
          <p className="mt-6 text-center text-sm">
            Already have an account?
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 ml-1"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={register}
            alt="Login to Account"
            className="h-[675px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
