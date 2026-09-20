import { useState, useEffect } from "react";
import {
  createProducts,
  getProductDetail,
  editProducts,
} from "../api/productService";
import { useParams, useNavigate } from "react-router-dom";
import {
  PackagePlus,
  ImagePlus,
  FileText,
  Tag,
  IndianRupee,
  Settings2,
  CheckCircle2,
} from "lucide-react";
import "../index.css";

function CreateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    Name: "",
    Type: "",
    Category: "",
    Description: "",
    Price: "",
    Price_Type: "",
    Customizable: "",
    Available: "true",
  });

  const [selectedFile, setSelectedFile] = useState([]);

  // ---------------- FETCH PRODUCT ----------------
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        const res = await getProductDetail(id);
        const data = res.data;

        setFormData({
          Name: data.Name || "",
          Type: data.Type || "",
          Category: data.Category || "",
          Description: data.Description || "",
          Price: data.Price || "",
          Price_Type: data.Price_Type || "",
          Customizable: data.Customizable || "",
          Available:
            data.Available !== undefined
              ? data.Available.toString()
              : "true",
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);

  const productCategories = [
    "Bouquet",
    "Jaimala",
    "Flower Jewellery",
    "Other",
  ];

  const serviceCategories = [
    "Wedding Decoration",
    "Car Decoration",
    "Home Decoration",
    "Festival Decoration",
    "Pratima Decoration",
    "Stage Decoration",
    "Other",
  ];

  // ---------------- HANDLE INPUT ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------- HANDLE FILE ----------------
  const handleFileChange = (e) => {
    setSelectedFile((prev) => [
      ...prev,
      ...e.target.files,
    ]);
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = new FormData();

      Object.keys(formData).forEach((key) => {
        userData.append(key, formData[key]);
      });

      selectedFile.forEach((file) => {
        userData.append("imageURL", file);
      });

      let res;

      if (isEditMode) {
        res = await editProducts(id, userData);
      } else {
        res = await createProducts(userData);
      }

      alert(
        `Product ${res.data.Name} ${
          isEditMode ? "updated" : "created"
        } successfully`
      );

      navigate("/admin");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const star = <span className="text-red-500">*</span>;

  const inputClass =
    "w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-400";

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4 sm:px-6">

      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-7">
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-pink-100 flex items-center justify-center">
              <PackagePlus className="w-5 h-5 text-pink-600" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {isEditMode
                  ? "Edit Listing"
                  : "Add New Listing"}
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                {isEditMode
                  ? "Update your product or service details"
                  : "Add flowers, products or decoration services"}
              </p>
            </div>

          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">

          <form onSubmit={handleSubmit}>

            {/* Form Header */}
            <div className="px-5 sm:px-7 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-pink-600" />

                <h2 className="text-sm font-semibold text-gray-800">
                  Listing Information
                </h2>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Provide the basic information customers will see.
              </p>
            </div>

            {/* Form Body */}
            <div className="p-5 sm:p-7">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-7">

                {/* LEFT COLUMN */}
                <div className="space-y-5">

                  {/* Name */}
                  <div>
                    <label className={labelClass}>
                      Listing Name {star}
                    </label>

                    <input
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      placeholder="e.g. Red Rose Bouquet"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className={labelClass}>
                      Listing Type {star}
                    </label>

                    <select
                      name="Type"
                      value={formData.Type}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          Type: e.target.value,
                          Category: "",
                        }));
                      }}
                      required
                      className={inputClass}
                    >
                      <option value="">
                        Select Type
                      </option>

                      <option value="product">
                        Product
                      </option>

                      <option value="service">
                        Service
                      </option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className={labelClass}>
                      Category {star}
                    </label>

                    <select
                      name="Category"
                      value={formData.Category}
                      onChange={handleChange}
                      required
                      disabled={!formData.Type}
                      className={`${inputClass} ${
                        !formData.Type
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <option value="">
                        {formData.Type
                          ? "Select Category"
                          : "Select Type First"}
                      </option>

                      {(formData.Type === "product"
                        ? productCategories
                        : formData.Type === "service"
                        ? serviceCategories
                        : []
                      ).map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                    </select>

                    {formData.Category === "Other" && (
                      <input
                        type="text"
                        name="Other_Category"
                        value={formData.Other_Category || ""}
                        onChange={handleChange}
                        placeholder={
                          formData.Type === "product"
                            ? "Enter custom product category"
                            : "Enter custom service category"
                        }
                        required
                        className={`${inputClass} mt-2.5`}
                      />
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className={labelClass}>
                      Price {star}
                    </label>

                    <div className="relative">
                      <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                      <input
                        type="number"
                        name="Price"
                        value={formData.Price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        required
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <label className={labelClass}>
                      Product Images {star}
                    </label>

                    <label className="flex items-center gap-3 w-full min-h-20 px-4 rounded-xl border border-dashed border-pink-200 bg-pink-50/50 hover:bg-pink-50 cursor-pointer transition">

                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-pink-100">
                        <ImagePlus className="w-5 h-5 text-pink-500" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">
                          Choose images
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">
                          JPG, PNG or WEBP · Multiple images allowed
                        </p>
                      </div>

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {selectedFile.length > 0 && (
                      <p className="text-xs text-green-600 mt-2">
                        {selectedFile.length} image
                        {selectedFile.length > 1 ? "s" : ""} selected
                      </p>
                    )}
                  </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-5">

                  {/* Description */}
                  <div>
                    <label className={labelClass}>
                      Description {star}
                    </label>

                    <textarea
                      name="Description"
                      value={formData.Description}
                      onChange={handleChange}
                      placeholder="Describe your product or service..."
                      required
                      rows="5"
                      className="w-full px-3.5 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-400 resize-none"
                    />
                  </div>

                  {/* Price Type */}
                  <div>
                    <label className={labelClass}>
                      Price Type {star}
                    </label>

                    <select
                      name="Price_Type"
                      value={formData.Price_Type}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">
                        Select Price Type
                      </option>

                      <option value="fixed">
                        Fixed Price
                      </option>

                      <option value="starting">
                        Starting From
                      </option>

                      <option value="quote">
                        Contact for Price
                      </option>
                    </select>
                  </div>

                  {/* Customization */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                    <div className="flex items-center gap-2 mb-3">
                      <Settings2 className="w-4 h-4 text-pink-500" />

                      <p className="text-sm font-medium text-gray-700">
                        Customization Available? {star}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">

                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="radio"
                          name="Customizable"
                          value="true"
                          checked={
                            formData.Customizable === "true"
                          }
                          onChange={handleChange}
                          className="accent-pink-500"
                        />

                        Yes
                      </label>

                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="radio"
                          name="Customizable"
                          value="false"
                          checked={
                            formData.Customizable === "false"
                          }
                          onChange={handleChange}
                          className="accent-pink-500"
                        />

                        No
                      </label>

                    </div>
                  </div>

                  {/* Availability */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-pink-500" />

                      <p className="text-sm font-medium text-gray-700">
                        Availability {star}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">

                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="radio"
                          name="Available"
                          value="true"
                          checked={
                            formData.Available === "true"
                          }
                          onChange={handleChange}
                          className="accent-pink-500"
                        />

                        Available
                      </label>

                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="radio"
                          name="Available"
                          value="false"
                          checked={
                            formData.Available === "false"
                          }
                          onChange={handleChange}
                          className="accent-pink-500"
                        />

                        Not Available
                      </label>

                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="px-5 sm:px-7 py-4 bg-gray-50/60 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">

              <p className="text-xs text-gray-400">
                Fields marked with <span className="text-red-500">*</span>{" "}
                are required
              </p>

              <div className="flex items-center gap-3 w-full sm:w-auto">

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 sm:flex-none px-5 h-10 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-6 h-10 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold shadow-sm transition"
                >
                  {isEditMode
                    ? "Update Listing"
                    : "Add Listing"}
                </button>

              </div>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
