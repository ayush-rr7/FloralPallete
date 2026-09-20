import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  updateAvailability,
} from "../api/productService.js";

import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../api/favouriteService.js";
import { addToCart } from "../api/cartService";

import { SkeletonCard } from "../component/skeleton.jsx";
import { optimizeImage } from "../utils/ImgOptimizer.js";

function ProductList() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [favouriteIds, setFavouriteIds] = useState(new Set());
const [cartLoading, setCartLoading] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  // Prevent same page from being requested multiple times
  const [loadingMore, setLoadingMore] = useState(false);

   const navigate = useNavigate();

  // =========================================================
  // FETCH FAVOURITES
  // =========================================================

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await getFavourites();

        const ids = new Set(
          (res.data || []).map((product) => product._id)
        );

        setFavouriteIds(ids);
      } catch (err) {
        console.log("Favourite fetch error:", err);
      }
    };

    fetchFavourites();
  }, []);

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    const fetchProducts = async () => {
      if (loadingMore) return;

      try {
        setLoadingMore(true);

        console.log("FETCHING PAGE:", page);

        const res = await getProducts(page);

        console.log("RESPONSE:", res.data);

        if (!Array.isArray(res.data) || res.data.length === 0) {
          setHasMore(false);
          return;
        }

        setProducts((prev) => {
          // Prevent duplicate products
          const existingIds = new Set(
            prev.map((product) => product._id)
          );

          const newProducts = res.data.filter(
            (product) => !existingIds.has(product._id)
          );

          return [...prev, ...newProducts];
        });

        // Backend page size is assumed to be 12
        if (res.data.length < 12) {
          setHasMore(false);
        }
      } catch (err) {
        console.log("Product fetch error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();
  }, [page]);

  // =========================================================
  // FAVOURITE TOGGLE
  // =========================================================

  const handleFavourite = async (e, productId) => {
    // Don't open product detail when clicking heart
    e.preventDefault();
    e.stopPropagation();

    const isFavourite = favouriteIds.has(productId);

    try {
      if (isFavourite) {
        await removeFavourite(productId);

        setFavouriteIds((prev) => {
          const updated = new Set(prev);
          updated.delete(productId);
          return updated;
        });
      } else {
        await addFavourite(productId);

        setFavouriteIds((prev) => {
          const updated = new Set(prev);
          updated.add(productId);
          return updated;
        });
      }
    } catch (err) {
      console.log("Favourite error:", err);
       if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
    }
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async (product) => {
  if (!product || !product.Available || cartLoading) {
    return;
  }

  try {
    setCartLoading(product._id);

    await addToCart(product._id, 1);

    alert("Added to cart successfully");
  } catch (err) {
    console.log("Cart error:", err);
     
    if (err.response?.status === 401) {
    navigate("/login");
    return;
  }
    alert(
      err.response?.data?.message ||
        "Unable to add product to cart"
    );
  } finally {
    setCartLoading(null);
  }
};

  // =========================================================
  // OWNER - UPDATE AVAILABILITY
  // =========================================================

  const handleAvailability = async (product) => {
    try {
      const newAvailability = !product.Available;

      await updateAvailability(
        product._id,
        newAvailability
      );

      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item._id === product._id
            ? {
                ...item,
                Available: newAvailability,
              }
            : item
        )
      );
    } catch (err) {
      console.log("Availability error:", err);
      alert("Failed to update availability");
    }
  };

  // =========================================================
  // LOAD MORE
  // =========================================================

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-4 sm:py-6 px-3 sm:px-4">

      {/* ================= HEADER ================= */}

      <div className="text-center mb-5 sm:mb-6">

        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Our Products & Services
        </h1>

        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Flowers, bouquets, decorations and more
        </p>

      </div>

      <div className="max-w-6xl mx-auto">

        {/* ================= INITIAL LOADING ================= */}

        {loading && products.length === 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-[430px] sm:auto-rows-[470px]">

            {Array(12)
              .fill()
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}

          </div>

        ) : (

          <InfiniteScroll
            dataLength={products.length}
            next={loadMore}
            hasMore={hasMore}
            scrollThreshold="95%"
            loader={
              <div className="col-span-full h-[200px] bg-gray-100 animate-pulse rounded-2xl mt-6" />
            }
            endMessage={
              <p className="text-center text-gray-500 mt-6 text-sm sm:text-base">
                No more products or services
              </p>
            }
          >

            {/* ================= PRODUCT GRID ================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-[430px] sm:auto-rows-[470px]">

              {products.map((product, index) => {

                const isFavourite = favouriteIds.has(
                  product._id
                );

                return (

                  <div
                    key={product._id}
                    className="h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 active:scale-[0.98] flex flex-col"
                  >

                    {/* ================= IMAGE ================= */}

                    <div className="relative overflow-hidden aspect-[4/3]">

                      <Link
                        to={`/product/${product._id}`}
                        className="block w-full h-full"
                      >

                        <img
                          src={optimizeImage(
                            product.Images?.[0]
                          )}
                          alt={product.Name}
                          loading={
                            index === 0
                              ? "eager"
                              : "lazy"
                          }
                          fetchPriority={
                            index === 0
                              ? "high"
                              : "auto"
                          }
                          decoding="async"
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                      </Link>

                      {/* ================= FAVOURITE ================= */}

                      <button
                        type="button"
                        onClick={(e) =>
                          handleFavourite(
                            e,
                            product._id
                          )
                        }
                        aria-label={
                          isFavourite
                            ? "Remove from favourites"
                            : "Add to favourites"
                        }
                        className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition"
                      >

                        <span
                          className={`text-xl leading-none ${
                            isFavourite
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {isFavourite
                            ? "♥"
                            : "♡"}
                        </span>

                      </button>

                      {/* ================= TYPE ================= */}

                      <div className="absolute top-3 left-3">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.Type === "product"
                              ? "bg-white/90 text-pink-600"
                              : "bg-white/90 text-purple-600"
                          }`}
                        >
                          {product.Type === "product"
                            ? "Product"
                            : "Service"}
                        </span>

                      </div>

                      {/* ================= CATEGORY ================= */}

                      <div className="absolute top-12 left-3">

                        <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                          {product.Category}
                        </span>

                      </div>

                      {/* ================= NAME ================= */}

                      <Link
                        to={`/product/${product._id}`}
                        className="absolute bottom-3 left-3 right-3 text-white"
                      >

                        <h2 className="text-base sm:text-lg font-semibold line-clamp-1">
                          {product.Name}
                        </h2>

                      </Link>

                    </div>

                    {/* ================= CONTENT ================= */}

                    <div className="p-3 sm:p-4 space-y-3 flex-1">

                      {/* ================= PRICE ================= */}

                      <div className="flex items-center gap-2">

                        {product.Price_Type === "quote" ? (

                          <span className="text-base sm:text-lg font-bold text-pink-600">
                            Get Quote
                          </span>

                        ) : (

                          <>
                            <span className="text-lg sm:text-xl font-bold text-pink-600">
                              ₹{product.Price}
                            </span>

                            {product.Price_Type === "starting" && (
                              <span className="text-xs sm:text-sm text-gray-500">
                                onwards
                              </span>
                            )}
                          </>

                        )}

                      </div>

                      {/* ================= DESCRIPTION ================= */}

                      <Link
                        to={`/product/${product._id}`}
                        className="block"
                      >

                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                          {product.Description}
                        </p>

                      </Link>

                      {/* ================= DETAILS ================= */}

                      <div className="flex flex-wrap gap-2">

                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.Type === "product"
                              ? "bg-pink-100 text-pink-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {product.Category}
                        </span>

                        {product.Customizable && (

                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                            Customizable
                          </span>

                        )}

                      </div>

                      {/* ================= AVAILABILITY ================= */}

                      <div>

                        {product.Available ? (

                          <span className="text-green-600 text-xs sm:text-sm font-medium">
                            ● Available
                          </span>

                        ) : (

                          <span className="text-red-500 text-xs sm:text-sm font-medium">
                            ● Currently Unavailable
                          </span>

                        )}

                      </div>

                   
{/* ================= BUTTONS ================= */}

<div className="pt-2 mt-auto space-y-2">

  {/* ================= OWNER ================= */}

  {user?.role === "owner" ? (
    <>
      <div className="flex items-center gap-2">

        {/* Edit */}
        <Link
          to={`/admin/products/edit/${product._id}`}
          className="flex-1 border border-rose-200 text-rose-600 py-2 rounded-lg hover:bg-rose-50 transition text-sm text-center font-medium"
        >
          Edit
        </Link>

        {/* Delete */}
        <button
          type="button"
          onClick={() => handleDelete(product._id)}
          className="flex-1 border border-red-200 text-red-500 py-2 rounded-lg hover:bg-red-50 transition text-sm font-medium"
        >
          Delete
        </button>

      </div>

      {/* Availability */}
      <div className="flex items-center justify-between px-1 pt-1">

        <span className="text-xs text-gray-500">
          Availability
        </span>

        <button
          type="button"
          onClick={() => handleAvailability(product)}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            product.Available
              ? "bg-green-500"
              : "bg-gray-300"
          }`}
          aria-label={
            product.Available
              ? "Make unavailable"
              : "Make available"
          }
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
              product.Available
                ? "translate-x-5"
                : "translate-x-0"
            }`}
          />
        </button>

      </div>
    </>
  ) : (

    /* ================= CUSTOMER ================= */

    <>
      {product.Type === "product" ? (
        
         <button
  type="button"
  onClick={() => handleAddToCart(product)}
  disabled={
    !product.Available || cartLoading === product._id
  }
  className={`w-full py-2 rounded-lg transition text-sm sm:text-base ${
    product.Available && cartLoading !== product._id
      ? "bg-pink-600 text-white hover:bg-pink-700"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  {cartLoading === product._id
    ? "Adding..."
    : product.Available
      ? "Add to Cart"
      : "Currently Unavailable"}
</button>
      ) : (
        <Link
          to={`/product/${product._id}`}
          className="block w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition text-sm sm:text-base text-center"
        >
          View Service
        </Link>
      )}
    </>
  )}

</div>


                    </div>

                  </div>

                );

              })}

            </div>

          </InfiniteScroll>

        )}

      </div>

    </div>
  );
}

export default ProductList;
