import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
const NewArrivals = () => {
  // const newArrivals = [
  //   {
  //     _id: "1",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500/?random=1",
  //         altText: "Stylish Jacket",
  //       },
  //     ],
  //   },

  //   {
  //     _id: "2",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500/?random=2",
  //         altText: "Stylish Jacket",
  //       },
  //     ],
  //   },
  //   {
  //     _id: "3",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500/?random=3",
  //         altText: "Stylish Jacket",
  //       },
  //     ],
  //   },
  //   {
  //     _id: "4",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500/?random=4",
  //         altText: "Stylish Jacket",
  //       },
  //     ],
  //   },
  //   {
  //     _id: "5",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500/?random=5",
  //         altText: "Stylish Jacket",
  //       },
  //     ],
  //   },
  //   {
  //     _id: "6",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500/?random=6",
  //         altText: "Stylish Jacket",
  //       },
  //     ],
  //   },
  //   {
  //     _id: "7",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500/?random=7",
  //         altText: "Stylish Jacket",
  //       },
  //     ],
  //   },
  //   {
  //     _id: "8",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     image: [
  //       {
  //         url: "https://picsum.photos/500/500/?random=8",
  //         altText: "Stylish Jacket",
  //       },
  //     ],
  //   },
  // ];

  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [newArrivals, setnewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setnewArrivals(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNewArrivals();
  }, []);

  // Hàm cuộn sang trái
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };

  // Hàm cuộn sang phải
  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
  };

  // Kéo chuột để cuộn
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX; // Nhân 2 để tăng tốc độ kéo
    scrollRef.current.scrollLeft -= walk;
  };

  // Dừng kéo
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const checkScrollPosition = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    console.log(scrollLeft);
    setIsAtStart(scrollLeft === 0);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
  };

  useEffect(() => {
    const div = scrollRef.current;
    div.addEventListener("scroll", checkScrollPosition);
    return () => {
      div.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return (
    <section className="px-6">
      <div className="container mx-auto text-center mb-10 relative ">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the latest styles straight off the rnway, freshly addedto
          keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* Scroll Buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={handleScrollLeft}
            className={`p-2 rounded border border-gray-300 ${
              isAtStart
                ? "bg-gray-300 text-gray-600"
                : "bg-white text-black cursor-pointer"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={handleScrollRight}
            className={`p-2 rounded border border-gray-300 ${
              isAtEnd
                ? "bg-gray-300 text-gray-600"
                : "bg-white text-black cursor-pointer"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
        {/* Scrollable Content */}
      </div>
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="container mx-auto overflow-x-scroll flex space-x-6 relative "
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
          >
            <img
              src={product.images[0]?.url}
              className="w-full  h-[500px] object-cover rounded-lg"
              alt={product.images[0]?.altText || product.name}
            />
            <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md text-white p-4 rounded-b-lg text-left">
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-medium">{product.name}</h4>
                <p className="mt-1">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
