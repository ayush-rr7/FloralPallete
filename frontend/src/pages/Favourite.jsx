import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getFavourites,
  removeFavourite,
} from "../api/favouriteService.js";
import { optimizeImage } from "../utils/ImgOptimizer.js";

function FavouriteList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    try {
      const res = await getFavourites();

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFavourite(productId);

      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Loading favourites...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-6 px-4">

 
  <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-10">

  {/* ================= HEADER ================= */}
  <div className="mb-8 text-center sm:mb-10">

    <div className="mb-3 flex items-center justify-center gap-3">
      <span className="h-px w-8 bg-rose-300 sm:w-12" />

      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-500 sm:text-xs">
        Picked with love
      </span>

      <span className="h-px w-8 bg-rose-300 sm:w-12" />
    </div>

    <h1 className="font-serif text-3xl font-medium tracking-tight text-[#402c32] sm:text-4xl">
      My <span className="text-rose-500">Favourites</span>
    </h1>

    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8c747b] sm:text-base">
      A little collection of the flowers and services
      that have captured your heart.
    </p>

    <div className="mt-5 flex items-center justify-center gap-2">
      <span className="h-1 w-1 rounded-full bg-rose-300" />
      <span className="h-1.5 w-8 rounded-full bg-rose-400" />
      <span className="h-1 w-1 rounded-full bg-rose-300" />
    </div>

  </div>

  {/* ================= EMPTY STATE ================= */}
  {products.length === 0 ? (
    <div className="mx-auto max-w-xl rounded-2xl border border-rose-100/80 bg-white/75 px-5 py-12 text-center shadow-sm sm:px-10 sm:py-16">

      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-100">
        <span className="font-serif text-5xl leading-none text-rose-400">
          ♡
        </span>
      </div>

      <h2 className="font-serif text-2xl font-medium text-[#402c32] sm:text-3xl">
        Nothing here just yet
      </h2>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#8c747b] sm:text-base">
        Your favourite blooms deserve a place here.
        Explore our collection and save the ones you love.
      </p>

      {/* Optional: connect this to your existing products route */}
      <button
        type="button"
        onClick={() => window.location.href = "/products"}
        className="mt-7 inline-flex items-center justify-center rounded-full bg-rose-500 px-7 py-3 text-sm font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
      >
        Explore Collection
        <span className="ml-2 text-lg leading-none">→</span>
      </button>

    </div>
  ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {products.map((product) => (

              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >

                <div className="relative">

                  <Link to={`/product/${product._id}`}>

                    <img
                      src={optimizeImage(product.Images?.[0])}
                      alt={product.Name}
                      className="w-full h-64 object-cover"
                    />

                  </Link>

                  <button
                    onClick={() =>
                      handleRemove(product._id)
                    }
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-md text-red-500 text-xl hover:bg-red-50"
                  >
                    ♥
                  </button>

                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                      product.Type === "product"
                        ? "bg-white text-pink-600"
                        : "bg-white text-purple-600"
                    }`}
                  >
                    {product.Type === "product"
                      ? "Product"
                      : "Service"}
                  </span>

                </div>

                <div className="p-4">

                  <Link to={`/product/${product._id}`}>

                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {product.Name}
                    </h2>

                  </Link>

                  <p className="text-sm text-gray-500 mt-1">
                    {product.Category}
                  </p>

                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {product.Description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">

                    {product.Price_Type === "quote" ? (
                      <span className="font-bold text-pink-600">
                        Get Quote
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-pink-600">
                        ₹{product.Price}
                        {product.Price_Type === "starting" && (
                          <span className="text-xs text-gray-500 ml-1">
                            onwards
                          </span>
                        )}
                      </span>
                    )}

                    <Link
                      to={`/product/${product._id}`}
                      className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600"
                    >
                      View
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default FavouriteList;