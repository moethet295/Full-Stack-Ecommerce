import {
  useState,
} from "react";

import {
  Loader2,
  Package,
  Search,
} from "lucide-react";

import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  type Order,
  type OrderItem,
  type OrderStatus,
} from "@/store/slices/orderApi";

// =====================================
// STATUS OPTIONS
// =====================================

const statusOptions:
  OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

// =====================================
// COMPONENT
// =====================================

function OrderManagement() {

  // =====================================
  // SEARCH
  // =====================================

  const [
    search,
    setSearch,
  ] =
    useState<string>("");

  // =====================================
  // GET ORDERS
  // =====================================

  const {
    data,
    isLoading,
    isError,
  } =
    useGetAllOrdersQuery();

  // =====================================
  // TYPE ORDERS
  // =====================================

  const orders:
    Order[] =
    data ?? [];

  // =====================================
  // UPDATE ORDER
  // =====================================

  const [
    updateOrderStatus,
    {
      isLoading:
        isUpdating,
    },
  ] =
    useUpdateOrderStatusMutation();

  // =====================================
  // FILTER ORDERS
  // =====================================

  const filteredOrders:
    Order[] =
    orders.filter(
      (
        order:
          Order
      ) => {

        const keyword =
          search
            .trim()
            .toLowerCase();

        if (!keyword) {
          return true;
        }

        // ===============================
        // PRODUCT NAMES
        // ===============================

        const products =
          order.orderItems
            .map(
              (
                item:
                  OrderItem
              ) =>
                item.name
            )
            .join(" ")
            .toLowerCase();

        // ===============================
        // CUSTOMER
        // ===============================

        const customer =
          order
            .shippingAddress
            ?.fullName
            ?.toLowerCase() ??
          "";

        // ===============================
        // SEARCH
        // ===============================

        return (
          order._id
            .toLowerCase()
            .includes(
              keyword
            ) ||

          customer.includes(
            keyword
          ) ||

          products.includes(
            keyword
          )
        );
      }
    );

  // =====================================
  // PAID SALES
  // =====================================

  const paidSales:
    number =
    orders
      .filter(
        (
          order:
            Order
        ) =>
          order.paymentStatus ===
          "paid"
      )
      .reduce(
        (
          total:
            number,
          order:
            Order
        ) =>
          total +
          order.totalPrice,
        0
      );

  // =====================================
  // PENDING COUNT
  // =====================================

  const pendingCount:
    number =
    orders.filter(
      (
        order:
          Order
      ) =>
        order.orderStatus ===
        "pending"
    ).length;

  // =====================================
  // DELIVERED COUNT
  // =====================================

  const deliveredCount:
    number =
    orders.filter(
      (
        order:
          Order
      ) =>
        order.orderStatus ===
        "delivered"
    ).length;

  // =====================================
  // UPDATE STATUS
  // =====================================

  const statusHandler =
    async (
      id:
        string,
      orderStatus:
        OrderStatus
    ) => {

      try {

        await updateOrderStatus({
          id,
          orderStatus,
        }).unwrap();

      } catch (error) {

        console.error(
          "Update status error:",
          error
        );
      }
    };

  // =====================================
  // LOADING
  // =====================================

  if (isLoading) {

    return (
      <div
        className="
          flex
          min-h-100
          items-center
          justify-center
        "
      >

        <Loader2
          className="
            h-7
            w-7
            animate-spin
          "
        />

      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (isError) {

    return (
      <div
        className="
          rounded-xl
          border
          border-red-200
          bg-red-50
          p-5
          text-sm
          text-red-600
        "
      >
        Unable to load orders.
      </div>
    );
  }

  // =====================================
  // RETURN
  // =====================================

  return (
    <section
      className="
        space-y-6
      "
    >

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div>

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Order Management
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >
          View and manage
          customer orders.
        </p>

      </div>

      {/* ================================= */}
      {/* STATS */}
      {/* ================================= */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <StatCard
          title="Total Orders"
          value={
            orders.length
              .toString()
          }
        />

        <StatCard
          title="Pending"
          value={
            pendingCount
              .toString()
          }
        />

        <StatCard
          title="Delivered"
          value={
            deliveredCount
              .toString()
          }
        />

        <StatCard
          title="Paid Sales"
          value={
            `$${paidSales.toLocaleString()}`
          }
        />

      </div>

      {/* ================================= */}
      {/* SEARCH */}
      {/* ================================= */}

      <div
        className="
          flex
          items-center
          rounded-xl
          border
          bg-white
          px-4
        "
      >

        <Search
          className="
            h-4
            w-4
            text-gray-400
          "
        />

        <input
          type="text"

          value={
            search
          }

          onChange={
            (
              event:
                React.ChangeEvent<HTMLInputElement>
            ) =>
              setSearch(
                event.target.value
              )
          }

          placeholder="Search order, customer or product..."

          className="
            w-full
            bg-transparent
            px-3
            py-3
            text-sm
            outline-none
          "
        />

      </div>

      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          bg-white
        "
      >

        <div
          className="
            overflow-x-auto
          "
        >

          <table
            className="
              w-full
              min-w-250
              text-left
            "
          >

            {/* =========================== */}
            {/* TABLE HEADER */}
            {/* =========================== */}

            <thead
              className="
                border-b
                bg-gray-50
              "
            >

              <tr
                className="
                  text-xs
                  uppercase
                  text-gray-500
                "
              >

                <th
                  className="
                    px-5
                    py-4
                  "
                >
                  Order
                </th>

                <th
                  className="
                    px-5
                    py-4
                  "
                >
                  Customer
                </th>

                <th
                  className="
                    px-5
                    py-4
                  "
                >
                  Products
                </th>

                <th
                  className="
                    px-5
                    py-4
                  "
                >
                  Total
                </th>

                <th
                  className="
                    px-5
                    py-4
                  "
                >
                  Payment
                </th>

                <th
                  className="
                    px-5
                    py-4
                  "
                >
                  Order Status
                </th>

                <th
                  className="
                    px-5
                    py-4
                  "
                >
                  Date
                </th>

              </tr>

            </thead>

            {/* =========================== */}
            {/* TABLE BODY */}
            {/* =========================== */}

            <tbody
              className="
                divide-y
              "
            >

              {filteredOrders.map(
                (
                  order:
                    Order
                ) => {

                  // =======================
                  // TOTAL QUANTITY
                  // =======================

                  const totalQuantity:
                    number =
                    order.orderItems
                      .reduce(
                        (
                          total:
                            number,
                          item:
                            OrderItem
                        ) =>
                          total +
                          item.quantity,
                        0
                      );

                  return (

                    <tr
                      key={
                        order._id
                      }

                      className="
                        hover:bg-gray-50
                      "
                    >

                      {/* ================= */}
                      {/* ORDER ID */}
                      {/* ================= */}

                      <td
                        className="
                          px-5
                          py-4
                        "
                      >

                        <p
                          className="
                            text-sm
                            font-semibold
                          "
                        >
                          #
                          {order._id
                            .slice(
                              -8
                            )
                            .toUpperCase()}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-gray-400
                          "
                        >
                          {totalQuantity}
                          {" "}
                          item
                          {totalQuantity !==
                          1
                            ? "s"
                            : ""}
                        </p>

                      </td>

                      {/* ================= */}
                      {/* CUSTOMER */}
                      {/* ================= */}

                      <td
                        className="
                          px-5
                          py-4
                        "
                      >

                        <p
                          className="
                            text-sm
                            font-medium
                          "
                        >
                          {order
                            .shippingAddress
                            ?.fullName ??
                            "Customer"}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-gray-500
                          "
                        >
                          {order
                            .shippingAddress
                            ?.phone ??
                            "-"}
                        </p>

                      </td>

                      {/* ================= */}
                      {/* PRODUCTS */}
                      {/* ================= */}

                      <td
                        className="
                          px-5
                          py-4
                        "
                      >

                        <div
                          className="
                            space-y-2
                          "
                        >

                          {order
                            .orderItems
                            .map(
                              (
                                item:
                                  OrderItem,
                                index:
                                  number
                              ) => (

                                <div
                                  key={
                                    `${item.productId}-${index}`
                                  }

                                  className="
                                    flex
                                    items-center
                                    gap-2
                                  "
                                >

                                  {/* IMAGE */}

                                  {item.image ? (

                                    <img
                                      src={
                                        item.image
                                      }

                                      alt={
                                        item.name
                                      }

                                      className="
                                        h-9
                                        w-9
                                        rounded-md
                                        border
                                        object-cover
                                      "
                                    />

                                  ) : (

                                    <div
                                      className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-md
                                        bg-gray-100
                                      "
                                    >

                                      <Package
                                        className="
                                          h-4
                                          w-4
                                          text-gray-400
                                        "
                                      />

                                    </div>

                                  )}

                                  {/* PRODUCT INFO */}

                                  <div>

                                    <p
                                      className="
                                        max-w-45
                                        truncate
                                        text-xs
                                        font-medium
                                      "
                                    >
                                      {item.name}
                                    </p>

                                    <p
                                      className="
                                        text-[11px]
                                        text-gray-500
                                      "
                                    >
                                      {item.size}

                                      {" / "}

                                      {item.color}

                                      {" × "}

                                      {item.quantity}
                                    </p>

                                  </div>

                                </div>

                              )
                            )}

                        </div>

                      </td>

                      {/* ================= */}
                      {/* TOTAL */}
                      {/* ================= */}

                      <td
                        className="
                          px-5
                          py-4
                          text-sm
                          font-semibold
                        "
                      >
                        $
                        {order
                          .totalPrice
                          .toLocaleString()}
                      </td>

                      {/* ================= */}
                      {/* PAYMENT */}
                      {/* ================= */}

                      <td
                        className="
                          px-5
                          py-4
                        "
                      >

                        <StatusBadge
                          status={
                            order.paymentStatus
                          }
                        />

                      </td>

                      {/* ================= */}
                      {/* ORDER STATUS */}
                      {/* ================= */}

                      <td
                        className="
                          px-5
                          py-4
                        "
                      >

                        <select
                          value={
                            order.orderStatus
                          }

                          disabled={
                            isUpdating
                          }

                          onChange={
                            (
                              event:
                                React.ChangeEvent<HTMLSelectElement>
                            ) =>
                              statusHandler(
                                order._id,
                                event
                                  .target
                                  .value as
                                  OrderStatus
                              )
                          }

                          className="
                            rounded-lg
                            border
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-medium
                            outline-none
                            focus:ring-2
                            focus:ring-black/10
                            disabled:opacity-50
                          "
                        >

                          {statusOptions.map(
                            (
                              status:
                                OrderStatus
                            ) => (

                              <option
                                key={
                                  status
                                }

                                value={
                                  status
                                }
                              >
                                {formatStatus(
                                  status
                                )}
                              </option>

                            )
                          )}

                        </select>

                      </td>

                      {/* ================= */}
                      {/* DATE */}
                      {/* ================= */}

                      <td
                        className="
                          px-5
                          py-4
                          text-xs
                          text-gray-500
                        "
                      >
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </td>

                    </tr>

                  );
                }
              )}

            </tbody>

          </table>

        </div>

        {/* ================================= */}
        {/* EMPTY */}
        {/* ================================= */}

        {filteredOrders.length ===
          0 && (

          <div
            className="
              py-16
              text-center
            "
          >

            <Package
              className="
                mx-auto
                h-10
                w-10
                text-gray-300
              "
            />

            <p
              className="
                mt-3
                text-sm
                font-medium
              "
            >
              No orders found
            </p>

          </div>

        )}

      </div>

    </section>
  );
}

// =====================================
// STAT CARD PROPS
// =====================================

interface StatCardProps {
  title:
    string;

  value:
    string;
}

// =====================================
// STAT CARD
// =====================================

function StatCard({
  title,
  value,
}: StatCardProps) {

  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-5
      "
    >

      <p
        className="
          text-sm
          text-gray-500
        "
      >
        {title}
      </p>

      <p
        className="
          mt-2
          text-2xl
          font-bold
        "
      >
        {value}
      </p>

    </div>
  );
}

// =====================================
// STATUS BADGE
// =====================================

function StatusBadge({
  status,
}: {
  status:
    string;
}) {

  let className =
    "bg-gray-100 text-gray-600";

  if (
    status ===
    "paid"
  ) {

    className =
      "bg-green-100 text-green-700";
  }

  if (
    status ===
    "failed"
  ) {

    className =
      "bg-red-100 text-red-700";
  }

  if (
    status ===
    "refunded"
  ) {

    className =
      "bg-orange-100 text-orange-700";
  }

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        capitalize
        ${className}
      `}
    >
      {status}
    </span>
  );
}

// =====================================
// FORMAT STATUS
// =====================================

function formatStatus(
  status:
    string
): string {

  return (
    status
      .charAt(0)
      .toUpperCase() +
    status.slice(1)
  );
}

export default OrderManagement;