import {
  useMemo,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  PackageOpen,
  Search,
} from "lucide-react";

import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";

import {
  fakeOrder,
} from "@/lib/fakeOrder";

// =====================================
// FAKE ORDERS
// =====================================

const orders: Order[] =
  fakeOrder(15);

// =====================================
// ORDER STATUS STYLE
// =====================================

function getOrderStatusClass(
  status: OrderStatus
): string {

  switch (status) {

    case "pending":
      return `
        border-yellow-200
        bg-yellow-50
        text-yellow-700
        dark:border-yellow-900
        dark:bg-yellow-950
        dark:text-yellow-400
      `;

    case "processing":
      return `
        border-blue-200
        bg-blue-50
        text-blue-700
        dark:border-blue-900
        dark:bg-blue-950
        dark:text-blue-400
      `;

    case "shipped":
      return `
        border-purple-200
        bg-purple-50
        text-purple-700
        dark:border-purple-900
        dark:bg-purple-950
        dark:text-purple-400
      `;

    case "delivered":
      return `
        border-green-200
        bg-green-50
        text-green-700
        dark:border-green-900
        dark:bg-green-950
        dark:text-green-400
      `;

    case "cancelled":
      return `
        border-red-200
        bg-red-50
        text-red-700
        dark:border-red-900
        dark:bg-red-950
        dark:text-red-400
      `;

    default:
      return "";
  }
}

// =====================================
// PAYMENT STATUS STYLE
// =====================================

function getPaymentStatusClass(
  status: PaymentStatus
): string {

  switch (status) {

    case "paid":
      return `
        border-green-200
        bg-green-50
        text-green-700
        dark:border-green-900
        dark:bg-green-950
        dark:text-green-400
      `;

    case "pending":
      return `
        border-yellow-200
        bg-yellow-50
        text-yellow-700
        dark:border-yellow-900
        dark:bg-yellow-950
        dark:text-yellow-400
      `;

    case "failed":
      return `
        border-red-200
        bg-red-50
        text-red-700
        dark:border-red-900
        dark:bg-red-950
        dark:text-red-400
      `;

    case "refunded":
      return `
        border-gray-200
        bg-gray-50
        text-gray-700
        dark:border-gray-800
        dark:bg-gray-950
        dark:text-gray-400
      `;

    default:
      return "";
  }
}

// =====================================
// CAPITALIZE STATUS
// =====================================

function formatStatus(
  status: string
) {

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

// =====================================
// ORDER TABLE
// =====================================

function OrderTable() {

  // =====================================
  // SEARCH
  // =====================================

  const [
    search,
    setSearch,
  ] = useState("");

  // =====================================
  // PAGINATION
  // =====================================

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const itemsPerPage = 5;

  // =====================================
  // FILTER ORDERS
  // =====================================

  const filteredOrders =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return orders;
      }

      return orders.filter(
        (order: Order) => {

          const orderId =
            order._id
              .toLowerCase();

          const customerName =
            order.shippingAddress
              .fullName
              .toLowerCase();

          const phone =
            order.shippingAddress
              .phone
              .toLowerCase();

          const city =
            order.shippingAddress
              .city
              .toLowerCase();

          const orderStatus =
            order.orderStatus
              .toLowerCase();

          const paymentStatus =
            order.paymentStatus
              .toLowerCase();

          return (
            orderId.includes(keyword) ||
            customerName.includes(keyword) ||
            phone.includes(keyword) ||
            city.includes(keyword) ||
            orderStatus.includes(keyword) ||
            paymentStatus.includes(keyword)
          );
        }
      );

    }, [search]);

  // =====================================
  // TOTAL PAGES
  // =====================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredOrders.length /
          itemsPerPage
      )
    );

  // =====================================
  // START INDEX
  // =====================================

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  // =====================================
  // PAGINATED ORDERS
  // =====================================

  const paginatedOrders =
    filteredOrders.slice(
      startIndex,
      startIndex +
        itemsPerPage
    );

  // =====================================
  // SEARCH HANDLER
  // =====================================

  const handleSearch = (
    value: string
  ) => {

    setSearch(value);

    setCurrentPage(1);
  };

  // =====================================
  // PREVIOUS PAGE
  // =====================================

  const previousPage = () => {

    setCurrentPage(
      (page) =>
        Math.max(
          page - 1,
          1
        )
    );
  };

  // =====================================
  // NEXT PAGE
  // =====================================

  const nextPage = () => {

    setCurrentPage(
      (page) =>
        Math.min(
          page + 1,
          totalPages
        )
    );
  };

  // =====================================
  // RETURN
  // =====================================

  return (

    <Card className="w-full">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <CardHeader>

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <CardTitle>
              Recent Orders
            </CardTitle>

            <CardDescription
              className="mt-1"
            >
              Manage and view customer orders
            </CardDescription>

          </div>

          {/* SEARCH */}

          <div
            className="
              relative
              w-full
              sm:w-[300px]
            "
          >

            <Search
              className="
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <Input
              type="text"

              value={
                search
              }

              onChange={
                (event) =>
                  handleSearch(
                    event.target.value
                  )
              }

              placeholder="Search orders..."

              className="pl-9"
            />

          </div>

        </div>

      </CardHeader>

      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <CardContent>

        <div
          className="
            overflow-hidden
            rounded-lg
            border
          "
        >

          <div className="overflow-x-auto">

            <Table>

              {/* =========================== */}
              {/* TABLE HEADER */}
              {/* =========================== */}

              <TableHeader>

                <TableRow>

                  <TableHead
                    className="
                      whitespace-nowrap
                    "
                  >
                    Order ID
                  </TableHead>

                  <TableHead>
                    Customer
                  </TableHead>

                  <TableHead>
                    Items
                  </TableHead>

                  <TableHead>
                    Total
                  </TableHead>

                  <TableHead>
                    Payment
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead
                    className="
                      whitespace-nowrap
                    "
                  >
                    Date
                  </TableHead>

                  <TableHead
                    className="
                      w-[60px]
                      text-right
                    "
                  >
                    Action
                  </TableHead>

                </TableRow>

              </TableHeader>

              {/* =========================== */}
              {/* TABLE BODY */}
              {/* =========================== */}

              <TableBody>

                {paginatedOrders.length >
                0 ? (

                  paginatedOrders.map(
                    (
                      order: Order
                    ) => {

                      // =====================
                      // TOTAL ITEMS
                      // =====================

                      const totalItems =
                        order.orderItems
                          .reduce(
                            (
                              total,
                              item
                            ) =>
                              total +
                              item.quantity,
                            0
                          );

                      return (

                        <TableRow
                          key={
                            order._id
                          }
                        >

                          {/* ================= */}
                          {/* ORDER ID */}
                          {/* ================= */}

                          <TableCell
                            className="
                              whitespace-nowrap
                              font-semibold
                            "
                          >
                            {order._id}
                          </TableCell>

                          {/* ================= */}
                          {/* CUSTOMER */}
                          {/* ================= */}

                          <TableCell>

                            <div
                              className="
                                flex
                                min-w-[180px]
                                flex-col
                              "
                            >

                              <span
                                className="
                                  text-sm
                                  font-medium
                                "
                              >
                                {
                                  order
                                    .shippingAddress
                                    .fullName
                                }
                              </span>

                              <span
                                className="
                                  text-xs
                                  text-muted-foreground
                                "
                              >
                                {
                                  order
                                    .shippingAddress
                                    .phone
                                }
                              </span>

                            </div>

                          </TableCell>

                          {/* ================= */}
                          {/* ITEMS */}
                          {/* ================= */}

                          <TableCell>

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <PackageOpen
                                className="
                                  h-4
                                  w-4
                                  text-muted-foreground
                                "
                              />

                              <span
                                className="
                                  font-medium
                                "
                              >
                                {
                                  totalItems
                                }
                              </span>

                            </div>

                          </TableCell>

                          {/* ================= */}
                          {/* TOTAL PRICE */}
                          {/* ================= */}

                          <TableCell
                            className="
                              whitespace-nowrap
                              font-semibold
                            "
                          >
                            $
                            {
                              order
                                .totalPrice
                                .toLocaleString()
                            }
                          </TableCell>

                          {/* ================= */}
                          {/* PAYMENT STATUS */}
                          {/* ================= */}

                          <TableCell>

                            <Badge
                              variant="outline"

                              className={
                                getPaymentStatusClass(
                                  order.paymentStatus
                                )
                              }
                            >
                              {
                                formatStatus(
                                  order.paymentStatus
                                )
                              }
                            </Badge>

                          </TableCell>

                          {/* ================= */}
                          {/* ORDER STATUS */}
                          {/* ================= */}

                          <TableCell>

                            <Badge
                              variant="outline"

                              className={
                                getOrderStatusClass(
                                  order.orderStatus
                                )
                              }
                            >
                              {
                                formatStatus(
                                  order.orderStatus
                                )
                              }
                            </Badge>

                          </TableCell>

                          {/* ================= */}
                          {/* CREATED DATE */}
                          {/* ================= */}

                          <TableCell>

                            <div
                              className="
                                flex
                                flex-col
                                whitespace-nowrap
                              "
                            >

                              <span
                                className="
                                  text-sm
                                  font-medium
                                "
                              >

                                {new Date(
                                  order.createdAt
                                ).toLocaleDateString(
                                  "en-US",
                                  {
                                    day:
                                      "2-digit",

                                    month:
                                      "short",

                                    year:
                                      "numeric",
                                  }
                                )}

                              </span>

                              <span
                                className="
                                  text-xs
                                  text-muted-foreground
                                "
                              >

                                {new Date(
                                  order.createdAt
                                ).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour:
                                      "2-digit",

                                    minute:
                                      "2-digit",
                                  }
                                )}

                              </span>

                            </div>

                          </TableCell>

                          {/* ================= */}
                          {/* ACTION */}
                          {/* ================= */}

                          <TableCell
                            className="
                              text-right
                            "
                          >

                            <DropdownMenu>

                              <DropdownMenuTrigger>

                                <Button
                                  type="button"

                                  variant="ghost"

                                  size="icon"

                                  className="
                                    h-8
                                    w-8
                                  "
                                >

                                  <MoreHorizontal
                                    className="
                                      h-4
                                      w-4
                                    "
                                  />

                                </Button>

                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                align="end"
                              >

                                <DropdownMenuLabel>
                                  Actions
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>

                                  <DropdownMenuItem
                                    className="
                                      cursor-pointer
                                    "
                                  >

                                    <Eye
                                      className="
                                        mr-2
                                        h-4
                                        w-4
                                      "
                                    />

                                    View Order

                                  </DropdownMenuItem>

                                </DropdownMenuGroup>

                              </DropdownMenuContent>

                            </DropdownMenu>

                          </TableCell>

                        </TableRow>

                      );
                    }
                  )

                ) : (

                  // =========================
                  // EMPTY STATE
                  // =========================

                  <TableRow>

                    <TableCell
                      colSpan={8}

                      className="
                        h-48
                        text-center
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          items-center
                          justify-center
                        "
                      >

                        <div
                          className="
                            mb-3
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-muted
                          "
                        >

                          <PackageOpen
                            className="
                              h-5
                              w-5
                              text-muted-foreground
                            "
                          />

                        </div>

                        <p
                          className="
                            text-sm
                            font-semibold
                          "
                        >
                          No orders found
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-muted-foreground
                          "
                        >
                          {
                            search
                              ? `No orders match "${search}".`
                              : "No orders are available."
                          }
                        </p>

                      </div>

                    </TableCell>

                  </TableRow>

                )}

              </TableBody>

            </Table>

          </div>

        </div>

        {/* ================================= */}
        {/* PAGINATION */}
        {/* ================================= */}

        {filteredOrders.length >
          0 && (

          <div
            className="
              mt-4
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            {/* RESULT COUNT */}

            <p
              className="
                text-sm
                text-muted-foreground
              "
            >

              Showing{" "}

              <span
                className="
                  font-semibold
                  text-foreground
                "
              >
                {startIndex + 1}
              </span>

              {" - "}

              <span
                className="
                  font-semibold
                  text-foreground
                "
              >
                {
                  Math.min(
                    startIndex +
                      itemsPerPage,

                    filteredOrders.length
                  )
                }
              </span>

              {" of "}

              <span
                className="
                  font-semibold
                  text-foreground
                "
              >
                {
                  filteredOrders.length
                }
              </span>

              {" orders"}

            </p>

            {/* PAGINATION BUTTONS */}

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Button
                type="button"

                variant="outline"

                size="sm"

                onClick={
                  previousPage
                }

                disabled={
                  currentPage === 1
                }
              >

                <ChevronLeft
                  className="
                    mr-1
                    h-4
                    w-4
                  "
                />

                Previous

              </Button>

              <div
                className="
                  flex
                  h-9
                  min-w-9
                  items-center
                  justify-center
                  rounded-md
                  bg-primary
                  px-3
                  text-sm
                  font-medium
                  text-primary-foreground
                "
              >
                {currentPage}
              </div>

              <span
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                of {totalPages}
              </span>

              <Button
                type="button"

                variant="outline"

                size="sm"

                onClick={
                  nextPage
                }

                disabled={
                  currentPage ===
                  totalPages
                }
              >

                Next

                <ChevronRight
                  className="
                    ml-1
                    h-4
                    w-4
                  "
                />

              </Button>

            </div>

          </div>

        )}

      </CardContent>

    </Card>
  );
}

export default OrderTable;