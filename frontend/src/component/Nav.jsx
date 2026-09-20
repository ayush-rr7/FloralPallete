import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import {
  ShoppingCart,
  Flower2,
  UserCircle,
  ChevronDown,
  Plus 
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef(null);

  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = async () => {
    setAccountOpen(false);

    await logout();

    navigate("/login");
  };

  // Common link style
  const linkStyle = ({ isActive }) =>
    `px-2.5 sm:px-3 py-2 rounded-lg text-sm sm:text-base font-medium
    whitespace-nowrap transition ${
      isActive
        ? "text-pink-600 bg-pink-50"
        : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
    }`;

  // Navigation links based on user role
  const getNavLinks = () => {
    // NOT LOGGED IN
    if (!user) {
      return [
        { label: "Home", path: "/" },
        { label: "Shop", path: "/products" },
        { label: "Signup", path: "/signup" },
        { label: "Login", path: "/login" },
      ];
    }

    // OWNER
    if (user.role === "owner") {
      return [
        { label: "Dashboard", path: "/admin" },
        // {
        //   label: "Add Product",
        //   path: "/admin/products/create",
        // },
        {
          label: "Products",
          path: "/admin/products",
        },
        {
          label: "Orders",
          path: "/admin/orders",
        },
      ];
    }

    // CUSTOMER
    return [
      { label: "Home", path: "/" },
      { label: "Shop", path: "/products" },
    ];
  };

  const navLinks = getNavLinks();

  // Reusable navigation link
  const NavigationLink = ({ link }) => (
    <NavLink
      to={link.path}
      className={linkStyle}
    >
      {link.label}
    </NavLink>
  );

  // Account dropdown
  const AccountDropdown = () => {
    if (!user) return null;

    const isOwner = user.role === "owner";

    return (
      <div
        ref={accountRef}
        className="relative ml-0.5 sm:ml-1"
      >
        {/* ACCOUNT BUTTON */}

        <button
          type="button"
          onClick={() =>
            setAccountOpen((prev) => !prev)
          }
          aria-label="Account menu"
          aria-expanded={accountOpen}
          className="
            flex items-center
            gap-0.5 sm:gap-1
            px-2 sm:px-3
            py-2
            rounded-lg
            text-gray-700
            hover:text-pink-600
            hover:bg-pink-50
            transition
          "
        >
          <UserCircle
            size={22}
            className="sm:w-6 sm:h-6"
          />

          {/* Text hidden on very small screens */}
          <span className="hidden sm:inline text-sm font-medium">
            Account
          </span>

          <ChevronDown
            size={15}
            className={`
              hidden sm:block
              transition-transform
              ${accountOpen ? "rotate-180" : ""}
            `}
          />
        </button>

        {/* DROPDOWN */}

        {accountOpen && (
          <div
            className="
              absolute
              right-0
              top-full
              mt-2
              w-56
              sm:w-64
              bg-white
              rounded-xl
              border
              shadow-xl
              overflow-hidden
              z-[100]
            "
          >
            {/* HEADER */}

            <div className="px-4 py-3 border-b bg-gray-50">
              <p className="font-semibold text-gray-800">
                Your Account
              </p>

              {user.name && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {user.name}
                </p>
              )}
            </div>

            {/* OWNER DROPDOWN */}

                  {isOwner ? (
          <>
            <button
              onClick={() => {
                navigate("/admin/account");
                setAccountOpen(false);
              }}
              className="
                w-full text-left
                px-4 py-3
                text-gray-700
                hover:bg-gray-50
                transition
              "
            >
              My Account
            </button>

            <button
              onClick={() => {
                navigate("/admin/products/create");
                setAccountOpen(false);
              }}
              className="
                w-full text-left
                px-4 py-3
                text-gray-700
                hover:bg-gray-50
                transition
              "
            >
              Add Product
            </button>
          </>
) : (
              /* CUSTOMER DROPDOWN */
              <>
                <button
                  onClick={() => {
                    navigate("/account");
                    setAccountOpen(false);
                  }}
                  className="
                    w-full text-left
                    px-4 py-3
                    text-gray-700
                    hover:bg-gray-50
                    transition
                  "
                >
                  My Account
                </button>

                <button
                  onClick={() => {
                    navigate("/Favourite");
                    setAccountOpen(false);
                  }}
                  className="
                    w-full text-left
                    px-4 py-3
                    text-gray-700
                    hover:bg-gray-50
                    transition
                  "
                >
                  Favourite
                </button>

                <button
                  onClick={() => {
                    navigate("/orders");
                    setAccountOpen(false);
                  }}
                  className="
                    w-full text-left
                    px-4 py-3
                    text-gray-700
                    hover:bg-gray-50
                    transition
                  "
                >
                  My Orders
                </button>
              </>
            )}

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="
                w-full
                text-left
                px-4
                py-3
                border-t
                text-pink-600
                hover:bg-pink-50
                transition
              "
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };


  
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2.5 sm:py-3">

        <div className="flex items-center justify-between gap-2">

          {/* ================= LOGO ================= */}

          <div
            onClick={() => navigate("/")}
            className="
              flex items-center
              gap-1.5 sm:gap-2
              cursor-pointer
              shrink-0
            "
          >
            <Flower2
              className="text-pink-600"
              size={25}
            />

            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-600">
              Bloom
              <span className="text-gray-800">
                Shop
              </span>
            </div>
          </div>

          {/* ================= NAVIGATION ================= */}

          <div className="flex items-center gap-0.5 sm:gap-1">

            {/* HOME / SHOP / ETC. */}

            {navLinks.map((link) => (
              <NavigationLink
                key={link.path}
                link={link}
              />
            ))}

            {/* ================= CUSTOMER CART ================= */}

            {user && user.role !== "owner" && (
              <NavLink
                to="/cart"
                aria-label="Shopping cart"
                className="
                  relative
                  p-2
                  rounded-lg
                  text-gray-700
                  hover:text-pink-600
                  hover:bg-pink-50
                  transition
                "
              >
                <ShoppingCart
                  size={21}
                  className="sm:w-[23px] sm:h-[23px]"
                />
              </NavLink>
            )}

            {/* ================= ACCOUNT ================= */}

            {user && <AccountDropdown />}

          </div>
        </div>
      </div>
    </nav>
  );
}