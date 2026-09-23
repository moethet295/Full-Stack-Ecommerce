import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

interface Page {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const pages: Page[] = [
  // =====================================
  // DASHBOARD
  // =====================================

  {
    name: "Dashboard",
    path: "/admin",
    icon: (
      <LayoutDashboard className="h-5 w-5" />
    ),
  },

  // =====================================
  // PRODUCT MANAGEMENT
  // =====================================

  {
    name: "Product Management",
    path: "/admin/manage-products",
    icon: (
      <Package className="h-5 w-5" />
    ),
  },

  // =====================================
  // USER MANAGEMENT
  // =====================================

  {
    name: "User Management",
    path: "/admin/manage-users",
    icon: (
      <Users className="h-5 w-5" />
    ),
  },

  // =====================================
  // ORDER MANAGEMENT
  // =====================================

  {
    name: "Order Management",
    path: "/admin/manage-orders",
    icon: (
      <ShoppingCart className="h-5 w-5" />
    ),
  },
];

function Sidebar() {

  const location =
    useLocation();

  return (
    <aside className="w-64 px-2">

      <div className="flex flex-col gap-2">

        {pages.map(
          (page) => {

            const isActive =
              location.pathname ===
              page.path;

            return (
              <Link
                key={
                  page.path
                }

                to={
                  page.path
                }

                className={`
                  flex
                  items-center
                  gap-2
                  px-2
                  py-1
                  text-base
                  font-semibold
                  whitespace-nowrap
                  transition-colors

                  ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >

                {page.icon}

                <span className="whitespace-nowrap">
                  {page.name}
                </span>

              </Link>
            );
          }
        )}

      </div>

    </aside>
  );
}

export default Sidebar;