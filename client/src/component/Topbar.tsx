import {
  ShoppingCart,
  LogIn,
  User,
  LayoutDashboard,
} from "lucide-react";

import SearchBox
  from "../common/SearchBox";

import DarkLight
  from "../component/Theme/DarkLight";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import type {
  RootState,
} from "@/store";

import {
  Button,
} from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  clearUserInfo,
} from "@/store/slices/auth";

import {
  useLogoutMutation,
} from "@/store/slices/userApi";

// =====================================
// PROPS
// =====================================

interface TopbarProps {
  toggleCard: () => void;
}

// =====================================
// COMPONENT
// =====================================

function Topbar({
  toggleCard,
}: TopbarProps) {

  // =====================================
  // REDUX USER
  // =====================================

  const userInfo =
    useSelector(
      (state: RootState) =>
        state.auth.userInfo
    );

  // =====================================
  // REDUX CART
  // =====================================

  const cartItems =
    useSelector(
      (state: RootState) =>
        state.cart.cartItems
    );

  // =====================================
  // TOTAL CART QUANTITY
  // =====================================

  const cartQuantity =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total + item.quantity,
      0
    );

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  // =====================================
  // LOGOUT
  // =====================================

  const [
    logoutMutation,
    {
      isLoading,
    },
  ] = useLogoutMutation();

  const logoutHandler =
    async () => {

      try {

        await logoutMutation(
          undefined
        ).unwrap();

        dispatch(
          clearUserInfo()
        );

        navigate(
          "/login"
        );

      } catch (error) {

        console.log(
          error
        );

      }
    };

  // =====================================
  // ADMIN PANEL
  // =====================================

  const goToManageHandler =
    () => {

      navigate(
        "/admin"
      );

    };

  // =====================================
  // CHECK ROLE
  // =====================================

  const isAdmin =
    userInfo?.role === "admin";

  const isCustomer =
    userInfo?.role === "customer";

  // =====================================
  // RETURN
  // =====================================

  return (
    <main
      className="
        bg-black
        py-5
        text-white
      "
    >

      <div
        className="
          mx-auto
          flex
          max-w-6xl
          items-center
          justify-between
        "
      >

        {/* ================================= */}
        {/* LOGO */}
        {/* ================================= */}

        <Link to="/">

          <h2
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            FASHION KING
          </h2>

        </Link>

        {/* ================================= */}
        {/* SEARCH */}
        {/* ================================= */}

        <SearchBox />

        {/* ================================= */}
        {/* RIGHT SIDE */}
        {/* ================================= */}

        <div
          className="
            flex
            items-center
            gap-6
          "
        >

          {/* ================================= */}
          {/* ADMIN - GO TO MANAGE */}
          {/* ================================= */}

          {isAdmin && (

            <Button
              type="button"
              onClick={
                goToManageHandler
              }
              variant="secondary"
              className="
                flex
                items-center
                gap-2
                font-medium
              "
            >

              <LayoutDashboard
                className="
                  h-4
                  w-4
                "
              />

              Go to Manage

            </Button>

          )}

          {/* ================================= */}
          {/* CART - CUSTOMER ONLY */}
          {/* ================================= */}

          {isCustomer && (

            <button
              type="button"
              onClick={
                toggleCard
              }
              className="
                relative
                cursor-pointer
                text-white
              "
            >

              <ShoppingCart
                className="
                  h-6
                  w-6
                "
              />

              {/* ================================= */}
              {/* CART QUANTITY BADGE */}
              {/* ================================= */}

              {cartQuantity > 0 && (

                <span
                  className="
                    absolute
                    -right-3
                    -top-3
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1
                    text-[11px]
                    font-bold
                    text-white
                  "
                >

                  {cartQuantity > 99
                    ? "99+"
                    : cartQuantity}

                </span>

              )}

            </button>

          )}

          {/* ================================= */}
          {/* USER MENU */}
          {/* ================================= */}

          {userInfo ? (

            <DropdownMenu>

              <DropdownMenuTrigger
                className="
                  cursor-pointer
                  text-white
                "
              >

                <User
                  className="
                    h-6
                    w-6
                  "
                />

              </DropdownMenuTrigger>

              <DropdownMenuContent>

                <DropdownMenuGroup>

                  {/* EMAIL */}

                  <DropdownMenuItem>

                    {userInfo.email}

                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* PROFILE */}

                  <DropdownMenuItem
                    className="
                      cursor-pointer
                    "
                  >

                    <Link
                      to="/profile"
                      className="
                        w-full
                      "
                    >
                      Profile
                    </Link>

                  </DropdownMenuItem>

                  {/* LOGOUT */}

                  <DropdownMenuItem
                    className="
                      cursor-pointer
                    "
                    onClick={
                      logoutHandler
                    }
                    disabled={
                      isLoading
                    }
                  >

                    {isLoading
                      ? "Logging out..."
                      : "Logout"}

                  </DropdownMenuItem>

                </DropdownMenuGroup>

              </DropdownMenuContent>

            </DropdownMenu>

          ) : (

            // =================================
            // NOT LOGGED IN
            // =================================

            <Link
              to="/login"
              className="
                text-white
              "
            >

              <LogIn
                className="
                  h-6
                  w-6
                "
              />

            </Link>

          )}

          {/* ================================= */}
          {/* LIGHT / DARK MODE */}
          {/* ================================= */}

          <DarkLight />

        </div>

      </div>

    </main>
  );
}

export default Topbar;