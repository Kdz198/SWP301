import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertCircleIcon } from "lucide-react";
import { FiCalendar } from "react-icons/fi";
import "../../style/BookingManager.css";
import CopyButton from "../../components/CopyButton";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [customerSearchType, setCustomerSearchType] = useState("customerId");
  const [customerSearchValue, setCustomerSearchValue] = useState("");
  const [bookingSearchType, setBookingSearchType] = useState("bookingId");
  const [bookingSearchValue, setBookingSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const location = useLocation();

  const getAllBookings = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/booking`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response (getAllBookings):", data);
      return data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách booking:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.selectedCustomer)
        setSelectedCustomer(location.state.selectedCustomer);
      if (location.state.customerSearchValue)
        setCustomerSearchValue(location.state.customerSearchValue);
      if (location.state.bookingSearchValue)
        setBookingSearchValue(location.state.bookingSearchValue);
      if (location.state.selectedStatus)
        setSelectedStatus(location.state.selectedStatus);
    }
  }, [location.state]);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      setError("Không thể lấy thông tin đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const customers = Array.from(
    new Map(bookings.map((b) => [b.customer.customerId, b.customer])).values()
  );

  const filteredCustomers = customers.filter((cust) => {
    if (!customerSearchValue) return true; // Nếu không có giá trị tìm kiếm, trả về Tất cả

    const searchValue = customerSearchValue.toLowerCase(); // Chỉ gọi toLowerCase một lần cho giá trị tìm kiếm

    switch (customerSearchType) {
      case "customerId":
        return cust.customerId?.toLowerCase().includes(searchValue) || false;
      case "customerName":
        return `${cust.firstName || ""} ${cust.lastName || ""}`
          .toLowerCase()
          .includes(searchValue);
      case "phone":
        return cust.phoneNumber?.toLowerCase().includes(searchValue) || false;
      case "email":
        return cust.email?.toLowerCase().includes(searchValue) || false;
      default:
        return true;
    }
  });

  let customerBookings = [];
  if (selectedCustomer) {
    customerBookings = bookings.filter(
      (b) => b.customer.customerId === selectedCustomer.customerId
    );
    if (bookingSearchValue) {
      customerBookings = customerBookings.filter((b) => {
        switch (bookingSearchType) {
          case "bookingId":
            return b.bookingId
              .toLowerCase()
              .includes(bookingSearchValue.toLowerCase());
          case "bookingDate":
            return format(new Date(b.bookingDate), "yyyy-MM-dd").includes(
              bookingSearchValue
            );
          default:
            return true;
        }
      });
    }
  }

  const filteredBookings = customerBookings.filter((b) => {
    if (selectedStatus === "all") return true;
    const statusMap = { daDat: 1, daHoanThanh: 2, daHuy: 3 };
    return b.status === statusMap[selectedStatus];
  });

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setBookingSearchValue("");
  };

  useEffect(() => {
    const savedState = localStorage.getItem("bookingsState");
    if (savedState) {
      const {
        selectedCustomer,
        customerSearchValue,
        bookingSearchValue,
        selectedStatus,
      } = JSON.parse(savedState);
      if (selectedCustomer) setSelectedCustomer(selectedCustomer);
      if (customerSearchValue) setCustomerSearchValue(customerSearchValue);
      if (bookingSearchValue) setBookingSearchValue(bookingSearchValue);
      if (selectedStatus) setSelectedStatus(selectedStatus);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "bookingsState",
      JSON.stringify({
        selectedCustomer,
        customerSearchValue,
        bookingSearchValue,
        selectedStatus,
      })
    );
  }, [
    selectedCustomer,
    customerSearchValue,
    bookingSearchValue,
    selectedStatus,
  ]);

  const handleBookingClick = (booking) => {
    navigate(`../booking-detail/${booking.bookingId}`);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 1:
        return { label: "Đã đặt", bgColor: "#dbeafe", textColor: "#1e40af" };
      case 2:
        return {
          label: "Đã hoàn thành",
          bgColor: "#d1fae5",
          textColor: "#065f46",
        };
      case 3:
        return { label: "Đã hủy", bgColor: "#fee2e2", textColor: "#991b1b" };
      default:
        return {
          label: "Không xác định",
          bgColor: "#f3f4f6",
          textColor: "#4b5563",
        };
    }
  };

  if (loading)
    return (
      <div className="loading-container-bookingmanager">
        <div className="loading-content-bookingmanager">
          <div className="spinner-bookingmanager"></div>
          <p>Đang tải thông tin đặt lịch...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="error-container-bookingmanager">
        <div className="error-content-bookingmanager">
          <AlertCircleIcon className="error-icon-bookingmanager" />
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="container-bookingmanager">
      <div className="header-bookingmanager">
        <div className="header-content-bookingmanager">
          <h1 className="header-title-bookingmanager">
            <FiCalendar className="header-icon-bookingmanager" />
            Quản lý lịch tiêm chủng
          </h1>
          <p className="header-subtitle-bookingmanager">
            Tra cứu, quản lý và theo dõi danh sách đặt lịch của khách hàng trong
            hệ thống
          </p>
        </div>
      </div>

      <div className="main-content-bookingmanager">
        <div className="sidebar-bookingmanager">
          <div className="sidebar-content-bookingmanager">
            <div className="sidebar-header-bookingmanager">
              <h2>Danh sách khách hàng</h2>
            </div>
            <div className="search-section-bookingmanager">
              <div className="search-container-bookingmanager">
                <select
                  value={customerSearchType}
                  onChange={(e) => {
                    setCustomerSearchType(e.target.value);
                    setCustomerSearchValue("");
                  }}
                  className="search-select-bookingmanager"
                >
                  <option value="customerId">Mã KH</option>
                  <option value="customerName">Tên KH</option>
                  <option value="phone">SĐT</option>
                  <option value="email">Email</option>
                </select>
                <input
                  type="text"
                  value={customerSearchValue}
                  onChange={(e) => setCustomerSearchValue(e.target.value)}
                  placeholder={`Tìm kiếm ${
                    customerSearchType === "customerId"
                      ? "mã khách hàng"
                      : customerSearchType === "customerName"
                      ? "tên khách hàng"
                      : customerSearchType === "phone"
                      ? "số điện thoại"
                      : "email"
                  }`}
                  className="search-input-bookingmanager"
                />
              </div>
            </div>
            <div className="customer-list-bookingmanager">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <div
                    key={cust.customerId}
                    onClick={() => handleCustomerClick(cust)}
                    className={`customer-item-bookingmanager ${
                      selectedCustomer &&
                      selectedCustomer.customerId === cust.customerId
                        ? "selected-bookingmanager"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="customer-id-bookingmanager">
                        Mã: {cust.customerId}{" "}
                        <span>
                          <CopyButton textToCopy={cust.customerId} />
                        </span>
                      </p>
                      <p>
                        Tên: {cust.firstName} {cust.lastName}
                      </p>
                    </div>
                    <div className="customer-details-bookingmanager">
                      <p>SĐT: {cust.phoneNumber}</p>
                      <p className="customer-email-bookingmanager">
                        Email: {cust.email || "---"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results-bookingmanager">
                  <AlertCircleIcon className="no-results-icon-bookingmanager" />
                  <p>Không có khách hàng phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bookings-section-bookingmanager">
          {selectedCustomer ? (
            <>
              <div className="bookings-header-bookingmanager">
                <h2>
                  Đặt lịch của: {selectedCustomer.firstName}{" "}
                  {selectedCustomer.lastName}
                </h2>
                <div className="search-section-bookingmanager">
                  <div className="search-container-bookingmanager">
                    <select
                      value={bookingSearchType}
                      onChange={(e) => {
                        setBookingSearchType(e.target.value);
                        setBookingSearchValue("");
                      }}
                      className="search-select-bookingmanager"
                    >
                      <option value="bookingId">Mã booking</option>
                      <option value="bookingDate">Ngày đặt</option>
                    </select>
                    {bookingSearchType === "bookingDate" ? (
                      <input
                        type="date"
                        value={bookingSearchValue}
                        onChange={(e) => setBookingSearchValue(e.target.value)}
                        className="search-input-bookingmanager"
                      />
                    ) : (
                      <input
                        type="text"
                        value={bookingSearchValue}
                        onChange={(e) => setBookingSearchValue(e.target.value)}
                        placeholder={`Tìm kiếm ${
                          bookingSearchType === "bookingId"
                            ? "mã booking"
                            : "ngày đặt"
                        }`}
                        className="search-input-bookingmanager"
                      />
                    )}
                  </div>
                </div>
                <div className="status-filter-bookingmanager">
                  <button
                    onClick={() => setSelectedStatus("all")}
                    className={`filter-button-bookingmanager ${
                      selectedStatus === "all"
                        ? "active-all-bookingmanager"
                        : ""
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setSelectedStatus("daDat")}
                    className={`filter-button-bookingmanager ${
                      selectedStatus === "daDat"
                        ? "active-daDat-bookingmanager"
                        : ""
                    }`}
                  >
                    Đã đặt
                  </button>
                  <button
                    onClick={() => setSelectedStatus("daHoanThanh")}
                    className={`filter-button-bookingmanager ${
                      selectedStatus === "daHoanThanh"
                        ? "active-daHoanThanh-bookingmanager"
                        : ""
                    }`}
                  >
                    Đã hoàn thành
                  </button>
                  <button
                    onClick={() => setSelectedStatus("daHuy")}
                    className={`filter-button-bookingmanager ${
                      selectedStatus === "daHuy"
                        ? "active-daHuy-bookingmanager"
                        : ""
                    }`}
                  >
                    Đã hủy
                  </button>
                </div>
              </div>
              <div className="bookings-list-bookingmanager">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const statusInfo = getStatusInfo(booking.status);
                    return (
                      <div
                        key={booking.bookingId}
                        onClick={() => handleBookingClick(booking)}
                        className="booking-item-bookingmanager"
                      >
                        <div>
                          <p className="booking-id-bookingmanager">
                            Mã: {booking.bookingId}
                          </p>
                          <p className="booking-date-bookingmanager">
                            Ngày đặt:{" "}
                            {format(
                              new Date(booking.bookingDate),
                              "dd/MM/yyyy"
                            )}
                          </p>
                        </div>
                        <div className="booking-status-amount-bookingmanager">
                          <span
                            className="status-label-bookingmanager"
                            style={{
                              backgroundColor: statusInfo.bgColor,
                              color: statusInfo.textColor,
                            }}
                          >
                            {statusInfo.label}
                          </span>
                          <p className="booking-amount-bookingmanager">
                            {booking.totalAmount.toLocaleString()} VNĐ
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-results-bookingmanager">
                    <AlertCircleIcon className="no-results-icon-bookingmanager" />
                    <p>Không có booking nào phù hợp</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-customer-selected-bookingmanager">
              <AlertCircleIcon className="no-customer-icon-bookingmanager" />
              <p>Vui lòng chọn khách hàng từ danh sách bên trái</p>
              <p className="hint-bookingmanager">
                Hoặc tìm kiếm khách hàng bằng ô tìm kiếm
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
