import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProductDetail } from "../api/productService";

import {
  addFavourite,
  removeFavourite,
  checkFavourite,
} from "../api/favouriteService";

import { addToCart } from "../api/cartService";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [product, setProduct] = useState(null);

  const [isFavourite, setIsFavourite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [favouriteLoading, setFavouriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getProductDetail(id);

        setProduct(res.data);
      } catch (err) {
        console.log(err);

        setError(
          err.response?.data?.message ||
            "Unable to load product details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // =========================================================
  // CHECK FAVOURITE
  // =========================================================

  useEffect(() => {
    const checkProductFavourite = async () => {
      try {
        const res = await checkFavourite(id);

        setIsFavourite(res.data.isFavourite);
      } catch (err) {
        console.log("Favourite check error:", err);
      }
    };

    if (id) {
      checkProductFavourite();
    }
  }, [id]);

  // =========================================================
  // FAVOURITE
  // =========================================================

  const handleFavourite = async () => {
    if (!product || favouriteLoading) return;

    try {
      setFavouriteLoading(true);

      if (isFavourite) {
        await removeFavourite(product._id);
        setIsFavourite(false);
      } else {
        await addFavourite(product._id);
        setIsFavourite(true);
      }
    } catch (err) {
      console.log("Favourite error:", err);
       if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
    } finally {
      setFavouriteLoading(false);
    }
  };

  // =========================================================
  // QUANTITY
  // =========================================================

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async () => {
  if (
    !product ||
    !product.Available ||
    cartLoading
  ) {
    return;
  }

  try {
    setCartLoading(true);
    
    await addToCart(
      product._id,
      quantity
    );

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
    setCartLoading(false);
  }
};
// =========================================================
// BUY NOW
// =========================================================

const handleBuyNow = () => {
  if (
    !product ||
    !product.Available ||
    cartLoading
  ) {
    return;
  }

  // Buy Now goes directly to checkout
  // with ONLY the selected product.
  navigate("/checkout", {
    state: {
      buyNowItem: {
        productId: product,
        quantity: quantity,
      },
    },
  });
};


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-6 flex justify-center items-center">

        <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl p-10">

          <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-1 h-[500px] bg-gray-200 animate-pulse rounded-2xl" />

            <div className="lg:col-span-2 space-y-6">

              <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-1/2" />

              <div className="h-6 bg-gray-200 animate-pulse rounded-lg w-1/3" />

              <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />

              <div className="h-14 bg-gray-200 animate-pulse rounded-lg" />

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

          <h2 className="text-2xl font-semibold text-gray-800">
            Product Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            {error || "This listing does not exist."}
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl"
          >
            Back to Products
          </button>

        </div>

      </div>
    );
  }

  const images = product.Images || [];

  const isProduct = product.Type === "product";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-3 sm:p-6">

      <div className="w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* =====================================================
            MAIN LAYOUT
        ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3">

          {/* ===================================================
              LEFT - IMAGE
          =================================================== */}

          <div className="relative bg-gray-100">

            <div
              className="relative h-[400px] sm:h-[500px] lg:h-full min-h-[500px] cursor-pointer overflow-hidden"
              onClick={() => {
                if (images.length > 0) {
                  setCurrentIndex(0);
                  setIsOpen(true);
                }
              }}
            >

              {/* BLURRED BACKGROUND */}

              {images.length > 0 && (
                <img
                  src={images[0]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
                />
              )}

              {/* MAIN IMAGE */}

              {images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={product.Name || "Flower product"}
                  className="relative w-full h-full object-contain z-10"
                />
              ) : (
                <div className="relative z-10 w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}

              {/* OVERLAY */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-20 pointer-events-none" />

              {/* TYPE */}

              <div className="absolute top-5 left-5 z-30">

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isProduct
                      ? "bg-white/90 text-pink-600"
                      : "bg-white/90 text-purple-600"
                  }`}
                >
                  {isProduct ? "Product" : "Service"}
                </span>

              </div>

              {/* FAVOURITE */}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavourite();
                }}
                disabled={favouriteLoading}
                className="absolute top-5 right-5 z-40 w-12 h-12 rounded-full bg-white/95 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition disabled:opacity-60"
                aria-label={
                  isFavourite
                    ? "Remove from favourites"
                    : "Add to favourites"
                }
              >
                <span
                  className={`text-2xl ${
                    isFavourite
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {isFavourite ? "♥" : "♡"}
                </span>
              </button>

              {/* NAME */}

              <div className="absolute bottom-6 left-6 right-6 text-white z-30">

                <h1 className="text-2xl sm:text-3xl font-bold">
                  {product.Name}
                </h1>

                <p className="text-sm opacity-90 mt-1 capitalize">
                  {product.Type} • {product.Category}
                </p>

              </div>

              {/* PHOTO COUNT */}

              {images.length > 1 && (
                <div className="absolute bottom-6 right-6 bg-black/70 text-white px-4 py-2 rounded-lg text-sm z-30">
                  +{images.length - 1} Photos
                </div>
              )}

            </div>

            {/* =================================================
                THUMBNAILS
            ================================================= */}

            {images.length > 1 && (

              <div className="p-4 flex gap-3 overflow-x-auto bg-white">

                {images.map((image, index) => (

                  <button
                    key={image + index}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsOpen(true);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentIndex === index
                        ? "border-pink-500"
                        : "border-transparent"
                    }`}
                  >

                    <img
                      src={image}
                      alt={`${product.Name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                  </button>

                ))}

              </div>

            )}

          </div>

          {/* ===================================================
              RIGHT SIDE
          =================================================== */}

          <div className="lg:col-span-2 flex flex-col">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="p-5 sm:p-8 border-b">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-sm text-gray-500 capitalize">
                    {product.Type}
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-1">
                    {product.Name}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {product.Category}
                  </p>

                </div>

                {/* FAVOURITE - DESKTOP/CONTENT */}

                <button
                  type="button"
                  onClick={handleFavourite}
                  disabled={favouriteLoading}
                  className="flex-shrink-0 w-11 h-11 rounded-full border flex items-center justify-center hover:bg-pink-50 transition"
                >
                  <span
                    className={`text-xl ${
                      isFavourite
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {isFavourite ? "♥" : "♡"}
                  </span>
                </button>

              </div>

            </div>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <div className="p-5 sm:p-8">

              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
                Listing Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">

                {/* TYPE */}

                <div>
                  <p className="text-sm text-gray-500">
                    Type
                  </p>

                  <p className="font-medium capitalize mt-1">
                    {product.Type}
                  </p>
                </div>

                {/* CATEGORY */}

                <div>
                  <p className="text-sm text-gray-500">
                    Category
                  </p>

                  <p className="font-medium mt-1">
                    {product.Category}
                  </p>
                </div>

                {/* PRICE */}

                <div>
                  <p className="text-sm text-gray-500">
                    Price
                  </p>

                  <div className="mt-1">

                    {product.Price_Type === "quote" ? (

                      <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                        Contact for Price
                      </span>

                    ) : (

                      <span className="text-xl font-bold text-pink-600">
                        ₹ {product.Price}

                        {product.Price_Type === "starting" &&
                          " onwards"}
                      </span>

                    )}

                  </div>
                </div>

                {/* CUSTOMIZABLE */}

                <div>
                  <p className="text-sm text-gray-500">
                    Customizable
                  </p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                      product.Customizable
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.Customizable
                      ? "Yes"
                      : "No"}
                  </span>
                </div>

                {/* AVAILABILITY */}

                <div>

                  <p className="text-sm text-gray-500">
                    Availability
                  </p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                      product.Available
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.Available
                      ? "Available"
                      : "Currently Unavailable"}
                  </span>

                </div>

              </div>

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div className="px-5 sm:px-8 pb-8">

              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                Description
              </h2>

              <p className="text-gray-600 leading-7">
                {product.Description ||
                  "No description available."}
              </p>

            </div>

            {/* =================================================
                CTA
            ================================================= */}

            <div className="mt-auto p-5 sm:p-8 border-t bg-gray-50">

              {isProduct ? (

                <div className="space-y-4">

                  {/* QUANTITY */}

                  <div className="flex items-center justify-between">

                    <span className="font-semibold text-gray-700">
                      Quantity
                    </span>

                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">

                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={
                          quantity === 1 ||
                          !product.Available
                        }
                        className="w-11 h-10 text-xl hover:bg-gray-100 disabled:text-gray-300"
                      >
                        −
                      </button>

                      <span className="w-12 text-center font-semibold">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={!product.Available}
                        className="w-11 h-10 text-xl hover:bg-gray-100 disabled:text-gray-300"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* TOTAL */}

                  {product.Price != null &&
                    product.Price_Type !== "quote" && (

                      <div className="flex justify-between items-center">

                        <span className="text-gray-600">
                          Estimated Total
                        </span>

                        <span className="text-xl font-bold text-pink-600">
                          ₹{" "}
                          {(
                            Number(product.Price) *
                            quantity
                          ).toLocaleString("en-IN")}
                        </span>

                      </div>

                    )}

                  {/* BUTTONS */}

                  <div className="flex flex-col sm:flex-row gap-3">

                    <button
                      type="button"
                      disabled={
                        !product.Available ||
                        cartLoading
                      }
                      onClick={handleAddToCart}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl shadow-md transition font-medium"
                    >
                      {cartLoading
                        ? "Adding..."
                        : "🛒 Add to Cart"}
                    </button>

                    <button
                      type="button"
                      disabled={
                        !product.Available ||
                        cartLoading
                      }
                      onClick={handleBuyNow}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl shadow-md transition font-medium"
                    >
                      🛍️ Buy Now
                    </button>

                  </div>

                </div>

              ) : (

                // <div className="space-y-3">

                //   <p className="text-sm text-gray-500">
                //     This is a service. Contact the shop
                //     to discuss date, location and
                //     customization requirements.
                //   </p>

                //   <button
                //     type="button"
                //     onClick={() =>
                //       navigate(
                //         `/service-enquiry/${product._id}`
                //       )
                //     }
                //     className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl shadow-md transition font-medium"
                //   >
                //     💬 Enquire / Customize
                //   </button>

                // </div>
                
            <div className="space-y-3">

                <p className="text-sm text-gray-500">
                  Select this service and provide your
                  customization requirements at checkout.
                </p>

                <button
                  type="button"
                  disabled={!product.Available || cartLoading}
                  onClick={handleBuyNow}
                  className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl shadow-md transition font-medium"
                >
                  🛍️ Continue to Checkout
                </button>

              </div>

              )}

            </div>

          </div>

        </div>

        {/* =====================================================
            IMAGE MODAL
        ===================================================== */}

        {isOpen && images.length > 0 && (

          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >

            {/* CLOSE */}

            <button
              type="button"
              className="absolute top-5 right-6 text-white text-4xl z-50"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* PREVIOUS */}

            {images.length > 1 && (

              <button
                type="button"
                className="absolute left-4 sm:left-8 text-white text-5xl z-50"
                onClick={(e) => {
                  e.stopPropagation();

                  setCurrentIndex(
                    (currentIndex - 1 + images.length) %
                      images.length
                  );
                }}
              >
                ‹
              </button>

            )}

            {/* IMAGE */}

            <img
              src={images[currentIndex]}
              alt={product.Name}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* NEXT */}

            {images.length > 1 && (

              <button
                type="button"
                className="absolute right-4 sm:right-8 text-white text-5xl z-50"
                onClick={(e) => {
                  e.stopPropagation();

                  setCurrentIndex(
                    (currentIndex + 1) %
                      images.length
                  );
                }}
              >
                ›
              </button>

            )}

            {/* IMAGE COUNT */}

            {images.length > 1 && (

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default ProductDetail;


// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { getProfileDetail } from "../api/profileService";
// import { connectReq } from "../api/connectionService";
// import { useAuth } from "../context/AuthContext";

// function ProfileDetail() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [users, setUsers] = useState([]);

//   const { id } = useParams();
//   const receiverProfileId = id;

//   const { activeProfileId: senderProfileId } = useAuth();

//   const fetchUser = async () => {
//     try {
//       const res = await getProfileDetail(id);
//       setUsers(res.data);
//       console.log(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, [receiverProfileId]);

//   const sendRequest = async () => {
//     try {
//       const res = await connectReq(
//         senderProfileId,
//         receiverProfileId
//       );
// alert(res.data.message); 
//       // if (!res.data.success) {
//       //   alert(res.data.message);
//       // }
//     } catch (err) {
//       console.log(err);
//         alert("Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-6 flex justify-center">
//       <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl overflow-hidden">

//         {/* MAIN LAYOUT */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[700px]">

          
//           {/* LEFT VERTICAL CONTAINER - IMAGE */}
          
//           <div className="relative bg-gray-100 flex flex-col">

//             <div
//               className="relative flex-1 cursor-pointer mx-"
//               onClick={() => {
//                 setCurrentIndex(0);
//                 setIsOpen(true);
//               }}
//             >
//               {/* blurred background */}
//               <img
//                 src={users?.Images?.[0]}
//                 alt=""
//                 className="absolute inset-0 w-full h-full object-cover blur-md scale-100"
//               />

//               {/* main image */}
//               <img
//                 src={users?.Images?.[0]}
//                 alt=""
//                 className="relative w-full h-full object-contain z-10"
//               />

//               {/* overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-20"></div>

//               {/* name */}
//               <div className="absolute bottom-6 left-6 text-white z-30">
//                 <h1 className="text-3xl font-bold">{users.Name}</h1>
//                 <p className="text-sm opacity-90 mt-1">
//                   {users.Age} yrs • {users.Location}
//                 </p>
//               </div>

//               {/* photo count */}
//               {users?.Images?.length > 1 && (
//                 <div className="absolute bottom-6 right-6 bg-black/70 text-white px-4 py-2 rounded-lg text-sm z-30">
//                   +{users.Images.length - 1} Photos
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* RIGHT SIDE */}
          
         
//           <div className="lg:col-span-2 flex flex-col">

//             {/* TOP RIGHT CONTAINER */}
//             <div className="p-8 border-b">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//                 Basic Information
//               </h2>

//               <div className="grid md:grid-cols-2 gap-5">
//                 <p>
//                   <span className="font-semibold">Gender:</span>{" "}
//                   {users.Gender}
//                 </p>

//                 <p>
//                   <span className="font-semibold">Age:</span>{" "}
//                   {users.Age}
//                 </p>

//                 <p>
//                   <span className="font-semibold">Height:</span>{" "}
//                   {users.Height_Ft} ft {users.Height_In} in
//                 </p>

//                 <p>
//                   <span className="font-semibold">Weight:</span>{" "}
//                   {users.Weight}
//                 </p>

//                 <p>
//                   <span className="font-semibold">Status:</span>{" "}
//                   <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
//                     {users.Martial_Status}
//                   </span>
//                 </p>

//                 <p>
//                   <span className="font-semibold">Religion:</span>{" "}
//                   {users.Religion}
//                 </p>
//               </div>
//             </div>

//             {/* BOTTOM RIGHT CONTAINER */}
//             <div className="p-8 flex flex-col justify-between flex-1">
//               <div>
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//                   Professional & Personal Details
//                 </h2>

//                 <div className="grid md:grid-cols-2 gap-5">
//                   <p>
//                     <span className="font-semibold">Caste:</span>{" "}
//                     {users.Caste}
//                   </p>

//                   <p>
//                     <span className="font-semibold">Education:</span>{" "}
//                     {users.Education}
//                   </p>

//                   <p>
//                     <span className="font-semibold">Job:</span>{" "}
//                     {users.Job_Details}
//                   </p>

//                   <p>
//                     <span className="font-semibold">Income:</span>{" "}
//                     <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
//                       ₹ {users.Income}
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               {/* CTA */}
//               <div className="pt-10">
//                 <button
//                   onClick={sendRequest}
//                   className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-xl shadow-md transition duration-300"
//                 >
//                   Connect Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================================= */}
//         {/* IMAGE MODAL */}
//         {/* ================================= */}
//         {isOpen && (
//           <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

//             <button
//               className="absolute top-5 right-6 text-white text-4xl"
//               onClick={() => setIsOpen(false)}
//             >
//               ✕
//             </button>

//             <button
//               className="absolute left-6 text-white text-5xl"
//               onClick={() =>
//                 setCurrentIndex(
//                   (currentIndex - 1 + users.Images.length) %
//                     users.Images.length
//                 )
//               }
//             >
//               ‹
//             </button>

//             <img
//               src={users.Images[currentIndex]}
//               alt=""
//               className="max-h-[85%] object-contain"
//             />

//             <button
//               className="absolute right-6 text-white text-5xl"
//               onClick={() =>
//                 setCurrentIndex(
//                   (currentIndex + 1) % users.Images.length
//                 )
//               }
//             >
//               ›
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProfileDetail;