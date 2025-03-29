import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleNavDrawerOpen = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    // console.log(drawerOpen);
    setDrawerOpen(!drawerOpen);
  };
  return (
    <>
      <nav className="container mx-auto flex item-center justify-between py-6 px-6">
        {/**Left - Logo */}
        <div>
          <Link to="/" className="text-2xl font-medium">
            SKY
          </Link>
        </div>
        {/**Center - Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            MEN
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            WOMEN
          </Link>{" "}
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            TOP WEAR
          </Link>{" "}
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            BOTTOM WEAR
          </Link>
        </div>

        {/**Right icon */}
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="block px-2  bg-black rounded text-sm text-white"
            >
              Admin
            </Link>
          )}
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          <button
            className="relative hover:text-black"
            onClick={toggleCartDrawer}
          >
            <HiOutlineShoppingBag className="h-6 text-gray-700 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute bg-sky-600 text-xs rounded-full px-2 py-0.5 text-white -top-1">
                {cartItemCount}
              </span>
            )}
          </button>
          {/**Search */}
          <SearchBar />
          <button className="md:hidden" onClick={toggleNavDrawerOpen}>
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>
      <CartDrawer
        drawerOpen={drawerOpen}
        toggleCartDrawer={toggleCartDrawer}
      ></CartDrawer>
      {/* Moile Navigation */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w1/3 h-full bg-white transform transition-transform duration-300 z-50 shadow-lg
        ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawerOpen}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawerOpen}
              className="block text-gray-600 hover:text-black"
            >
              Men
            </Link>

            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawerOpen}
              className="block text-gray-600 hover:text-black"
            >
              Women
            </Link>

            <Link
              to="/collections/all?category=Top Wear"
              onClick={toggleNavDrawerOpen}
              className="block text-gray-600 hover:text-black"
            >
              Top Wear
            </Link>

            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={toggleNavDrawerOpen}
              className="block text-gray-600 hover:text-black"
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
