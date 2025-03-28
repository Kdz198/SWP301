import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  ShieldIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

import "../../style/BookingDetail.css";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [groupedDetails, setGroupedDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canCancel, setCanCancel] = useState(true);
  const navigate = useNavigate();

  const [isBookingInfoOpen, setIsBookingInfoOpen] = useState(true);
  const [isCustomerInfoOpen, setIsCustomerInfoOpen] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [detailIdToConfirm, setDetailIdToConfirm] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [reactionInput, setReactionInput] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const getStatusTextAndIcon = (status) => {
    switch (status) {
      case 1:
        return {
          text: "Đã đặt",
          icon: <ClockIcon className="status-icon-bookingdetailmanager" />,
        };
      case 2:
        return {
          text: "Đã hoàn thành",
          icon: (
            <CheckCircleIcon className="status-icon-bookingdetailmanager" />
          ),
        };
      case 3:
        return {
          text: "Đã huỷ",
          icon: (
            <AlertCircleIcon className="status-icon-bookingdetailmanager" />
          ),
        };
      default:
        return { text: "Không xác định", icon: null };
    }
  };

  const getBookingDetailsByBookID = async (bookingId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/bookingdetail/findbybooking?id=${bookingId}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch booking details");
      return await response.json();
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  };

  const confirmBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/bookingdetail/confirmdate?id=${bookingId}`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to confirm booking");
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi xác nhận booking:", error);
      throw error;
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/booking/cancel?bookingId=${bookingId}`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to cancel booking");
      console.log("Hủy đặt lịch thành công.");
    } catch (error) {
      console.error("Lỗi khi hủy đặt lịch:", error);
      throw error;
    }
  };

  const updateReactionNote = async (detailId, reaction) => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/bookingdetail/updatereaction?id=${detailId}&reaction=${encodeURIComponent(
          reaction
        )}`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to update reaction note");
      return await response.json();
    } catch (error) {
      console.error("Error updating reaction note:", error);
      throw error;
    }
  };

  const fetchBookingData = async () => {
    try {
      const detailsData = await getBookingDetailsByBookID(bookingId);
      setBookingDetails(detailsData);
      if (detailsData.length > 0) {
        setBooking(detailsData[0].booking);
        setCanCancel(detailsData.some((detail) => detail.booking.status === 1));
      }
      const groups = detailsData.reduce((acc, detail) => {
        const childKey = detail.child.firstName + " " + detail.child.lastName;
        acc[childKey] = acc[childKey] || [];
        acc[childKey].push(detail);
        return acc;
      }, {});
      setGroupedDetails(groups);
    } catch (err) {
      setError("Không thể lấy thông tin chi tiết đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [bookingId]);

  const handleConfirm = (detailId) => {
    setDetailIdToConfirm(detailId);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    setShowConfirmModal(false);
    const loadingToast = toast.loading("Đang xử lý xác nhận tiêm...");
    try {
      const updatedDetail = await confirmBooking(detailIdToConfirm);
      setBookingDetails((prev) =>
        prev.map((d) =>
          d.bookingDetailId === detailIdToConfirm ? updatedDetail : d
        )
      );
      const updatedGroups = bookingDetails
        .map((d) =>
          d.bookingDetailId === detailIdToConfirm ? updatedDetail : d
        )
        .reduce((acc, detail) => {
          const childKey = detail.child.firstName + " " + detail.child.lastName;
          acc[childKey] = acc[childKey] || [];
          acc[childKey].push(detail);
          return acc;
        }, {});
      await fetchBookingData();
      setGroupedDetails(updatedGroups);
      toast.update(loadingToast, {
        render: "Xác nhận tiêm thành công",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(loadingToast, {
        render: "Xác nhận tiêm thất bại. Vui lòng thử lại.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleCancel = () => setShowCancelModal(true);

  const confirmCancelAction = async () => {
    setShowCancelModal(false);
    const loadingToast = toast.loading("Đang xử lý hủy đặt lịch...");
    try {
      await cancelBooking(bookingId);
      toast.update(loadingToast, {
        render: "Hủy đặt lịch thành công",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      toast.update(loadingToast, {
        render: "Hủy đặt lịch thất bại. Vui lòng thử lại.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleReaction = (detailId) => {
    const detail = bookingDetails.find((d) => d.bookingDetailId === detailId);
    setSelectedDetailId(detailId);
    setReactionInput(detail.reactionNote || "");
    setShowReactionModal(true);
  };

  const handleReactionSubmit = async () => {
    if (!selectedDetailId) return;
    setShowReactionModal(false);
    const loadingToast = toast.loading("Đang cập nhật phản ứng sau tiêm...");
    try {
      const updatedDetail = await updateReactionNote(
        selectedDetailId,
        reactionInput
      );
      setBookingDetails((prev) =>
        prev.map((d) =>
          d.bookingDetailId === selectedDetailId ? updatedDetail : d
        )
      );
      const updatedGroups = bookingDetails
        .map((d) =>
          d.bookingDetailId === selectedDetailId ? updatedDetail : d
        )
        .reduce((acc, detail) => {
          const childKey = detail.child.firstName + " " + detail.child.lastName;
          acc[childKey] = acc[childKey] || [];
          acc[childKey].push(detail);
          return acc;
        }, {});
      setGroupedDetails(updatedGroups);
      toast.update(loadingToast, {
        render: "Cập nhật phản ứng sau tiêm thành công",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(loadingToast, {
        render: "Cập nhật phản ứng sau tiêm thất bại. Vui lòng thử lại.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const filteredGroupedDetails = Object.keys(groupedDetails).reduce(
    (acc, childKey) => {
      const filteredDetails = groupedDetails[childKey].filter((detail) => {
        const isAdministered = !!detail.administeredDate;
        if (statusFilter === "all") return true;
        if (statusFilter === "administered") return isAdministered;
        if (statusFilter === "notAdministered") return !isAdministered;
        return true;
      });
      if (filteredDetails.length > 0) acc[childKey] = filteredDetails;
      return acc;
    },
    {}
  );

  if (loading)
    return (
      <div className="loading-container-bookingdetailmanager">
        <div className="loading-content-bookingdetailmanager">
          <div className="spinner-bookingdetailmanager"></div>
          <p className="loading-text-bookingdetailmanager">
            Đang tải thông tin đặt lịch...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="error-container-bookingdetailmanager">
        <div className="error-content-bookingdetailmanager">
          <AlertCircleIcon className="error-icon-bookingdetailmanager" />
          <p className="error-text-bookingdetailmanager">{error}</p>
        </div>
      </div>
    );

  if (!booking)
    return (
      <div className="not-found-container-bookingdetailmanager">
        <div className="not-found-content-bookingdetailmanager">
          <AlertCircleIcon className="not-found-icon-bookingdetailmanager" />
          <p className="not-found-text-bookingdetailmanager">
            Không tìm thấy thông tin đặt lịch.
          </p>
        </div>
      </div>
    );

  return (
    <div className="container-bookingdetailmanager">
      <div className="header-bookingdetailmanager">
        <div className="header-content-bookingdetailmanager">
          <h1 className="header-title-bookingdetailmanager">
            <CalendarIcon className="header-icon-bookingdetailmanager" />
            Chi tiết lịch tiêm chủng của khách hàng {
              booking.customer.firstName
            }{" "}
            {booking.customer.lastName}
          </h1>
          <div className="booking-status-bookingdetailmanager">
            {getStatusTextAndIcon(booking.status).icon}
            <span className={`status-text-${booking.status}`}>
              {getStatusTextAndIcon(booking.status).text}
            </span>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay-bookingdetailmanager">
          <div className="modal-content-bookingdetailmanager">
            <h3 className="modal-title-bookingdetailmanager">Xác nhận tiêm</h3>
            <p className="modal-text-bookingdetailmanager">
              Bạn có chắc chắn muốn xác nhận tiêm không?
            </p>
            <div className="modal-buttons-bookingdetailmanager">
              <button
                onClick={confirmAction}
                className="modal-confirm-button-bookingdetailmanager"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="modal-cancel-button-bookingdetailmanager"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="modal-overlay-bookingdetailmanager">
          <div className="modal-content-bookingdetailmanager">
            <h3 className="modal-title-bookingdetailmanager">Hủy Đặt Lịch</h3>
            <p className="modal-text-bookingdetailmanager">
              Bạn có thật sự muốn hủy đặt lịch tiêm này không?
            </p>
            <div className="modal-buttons-bookingdetailmanager">
              <button
                onClick={() => setShowCancelModal(false)}
                className="modal-cancel-button-bookingdetailmanager"
              >
                Hủy
              </button>
              <button
                onClick={confirmCancelAction}
                className="modal-confirm-button-bookingdetailmanager"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {showReactionModal && (
        <div className="modal-overlay-bookingdetailmanager">
          <div className="modal-content-bookingdetailmanager">
            <h3 className="modal-title-bookingdetailmanager">
              Phản ứng sau tiêm
            </h3>
            <textarea
              value={reactionInput}
              onChange={(e) => setReactionInput(e.target.value)}
              className="reaction-textarea-bookingdetailmanager"
              placeholder="Nhập phản ứng sau tiêm"
            />
            <div className="modal-buttons-bookingdetailmanager">
              <button
                onClick={() => setShowReactionModal(false)}
                className="modal-cancel-button-bookingdetailmanager"
              >
                Hủy
              </button>
              <button
                onClick={handleReactionSubmit}
                className="modal-confirm-button-bookingdetailmanager"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="main-content-bookingdetailmanager">
        <div className="sidebar-bookingdetailmanager">
          <div className="sidebar-content-bookingdetailmanager">
            <div className="booking-id-section-bookingdetailmanager">
              <div className="booking-id-header-bookingdetailmanager">
                <span className="booking-id-label-bookingdetailmanager">
                  Mã đặt lịch
                </span>
                <span className="booking-id-value-bookingdetailmanager">
                  #{booking.bookingId}
                </span>
              </div>
            </div>

            <div className="section-bookingdetailmanager">
              <button
                onClick={() => setIsBookingInfoOpen(!isBookingInfoOpen)}
                className="section-toggle-bookingdetailmanager"
              >
                <h3 className="section-title-bookingdetailmanager">
                  <CalendarIcon className="section-icon-bookingdetailmanager" />
                  Thông tin đặt lịch
                </h3>
                {isBookingInfoOpen ? (
                  <ChevronUpIcon className="toggle-icon-bookingdetailmanager" />
                ) : (
                  <ChevronDownIcon className="toggle-icon-bookingdetailmanager" />
                )}
              </button>
              {isBookingInfoOpen && (
                <div className="section-content-bookingdetailmanager">
                  <ul className="info-list-bookingdetailmanager">
                    <li className="info-item-bookingdetailmanager">
                      <span className="info-label-bookingdetailmanager">
                        Ngày đặt:
                      </span>
                      <span className="info-value-bookingdetailmanager">
                        {format(new Date(booking.bookingDate), "dd/MM/yyyy")}
                      </span>
                    </li>
                    <li className="info-item-bookingdetailmanager">
                      <span className="info-label-bookingdetailmanager">
                        Tổng tiền:
                      </span>
                      <span className="info-value-price-bookingdetailmanager">
                        {booking.totalAmount.toLocaleString()} VNĐ
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="section-bookingdetailmanager">
              <button
                onClick={() => setIsCustomerInfoOpen(!isCustomerInfoOpen)}
                className="section-toggle-bookingdetailmanager"
              >
                <h3 className="section-title-bookingdetailmanager">
                  <UserIcon className="section-icon-bookingdetailmanager" />
                  Thông tin khách hàng
                </h3>
                {isCustomerInfoOpen ? (
                  <ChevronUpIcon className="toggle-icon-bookingdetailmanager" />
                ) : (
                  <ChevronDownIcon className="toggle-icon-bookingdetailmanager" />
                )}
              </button>
              {isCustomerInfoOpen && (
                <div className="section-content-bookingdetailmanager">
                  <div className="customer-info-bookingdetailmanager">
                    <div className="info-block-bookingdetailmanager">
                      <div className="info-label-bookingdetailmanager">
                        Họ và tên:
                      </div>
                      <div className="info-value-bookingdetailmanager">
                        {booking.customer.firstName} {booking.customer.lastName}
                      </div>
                    </div>
                    <div className="info-block-bookingdetailmanager">
                      <div className="info-label-bookingdetailmanager">
                        Mã khách hàng:
                      </div>
                      <div className="info-value-bookingdetailmanager">
                        #{booking.customer.customerId}
                      </div>
                    </div>
                    <div className="info-block-bookingdetailmanager">
                      <div className="info-label-bookingdetailmanager">
                        Số điện thoại:
                      </div>
                      <div className="info-value-with-icon-bookingdetailmanager">
                        <PhoneIcon className="small-icon-bookingdetailmanager" />
                        {booking.customer.phoneNumber}
                      </div>
                    </div>
                    <div className="info-block-bookingdetailmanager">
                      <div className="info-label-bookingdetailmanager">
                        Email:
                      </div>
                      <div className="info-value-with-icon-bookingdetailmanager">
                        <MailIcon className="small-icon-bookingdetailmanager" />
                        <span className="truncate-bookingdetailmanager">
                          {booking.customer.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {canCancel && (
              <button
                onClick={handleCancel}
                className="cancel-booking-button-bookingdetailmanager"
              >
                Hủy đặt lịch
              </button>
            )}
          </div>
        </div>

        <div className="details-content-bookingdetailmanager">
          <div className="filter-buttons-bookingdetailmanager">
            <button
              onClick={() => setStatusFilter("all")}
              className={`filter-button-bookingdetailmanager ${
                statusFilter === "all" ? "active-all-bookingdetailmanager" : ""
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter("administered")}
              className={`filter-button-bookingdetailmanager ${
                statusFilter === "administered"
                  ? "active-administered-bookingdetailmanager"
                  : ""
              }`}
            >
              Đã tiêm
            </button>
            <button
              onClick={() => setStatusFilter("notAdministered")}
              className={`filter-button-bookingdetailmanager ${
                statusFilter === "notAdministered"
                  ? "active-not-administered-bookingdetailmanager"
                  : ""
              }`}
            >
              Chưa tiêm
            </button>
            <div className="back-button-container-bookingdetailmanager">
              <button
                onClick={() => navigate(-1)}
                className="back-button-bookingdetailmanager"
              >
                Quay lại
              </button>
            </div>
          </div>

          {Object.keys(filteredGroupedDetails).length > 0 ? (
            <div className="details-list-bookingdetailmanager">
              {Object.keys(filteredGroupedDetails).map((childKey) => (
                <div
                  key={childKey}
                  className="child-section-bookingdetailmanager"
                >
                  <div className="child-header-bookingdetailmanager">
                    <h2 className="child-title-bookingdetailmanager">
                      <UserIcon className="child-icon-bookingdetailmanager" />
                      {childKey}
                    </h2>
                    <span className="child-count-bookingdetailmanager">
                      {filteredGroupedDetails[childKey].length} mũi tiêm
                    </span>
                  </div>
                  <div className="child-details-bookingdetailmanager">
                    {filteredGroupedDetails[childKey].map((detail) => {
                      const isAdministered = !!detail.administeredDate;
                      const isCancelled = booking.status === 3;
                      const canConfirm = !isCancelled && !isAdministered;
                      const canReact = isAdministered;

                      return (
                        <div
                          key={detail.bookingDetailId}
                          className={`detail-item-bookingdetailmanager ${
                            isAdministered ? "administered" : "not-administered"
                          }`}
                        >
                          <div className="detail-header-bookingdetailmanager">
                            <div className="vaccine-info">
                              <span className="vaccine-name">
                                {detail.vaccine.name}
                              </span>
                            </div>
                            <div className="action-buttons-bookingdetailmanager">
                              <button
                                onClick={() =>
                                  canConfirm &&
                                  handleConfirm(detail.bookingDetailId)
                                }
                                className={`confirm-button ${
                                  !canConfirm ? "disabled" : ""
                                }`}
                                disabled={!canConfirm}
                              >
                                <CheckCircleIcon className="button-icon" />
                                Xác nhận tiêm
                              </button>
                              <button
                                onClick={() =>
                                  canReact &&
                                  handleReaction(detail.bookingDetailId)
                                }
                                className={`reaction-button-bookingdetailmanager ${
                                  !canReact ? "disabled" : ""
                                }`}
                                disabled={!canReact}
                              >
                                Phản ứng sau tiêm
                              </button>
                            </div>
                          </div>
                          <div className="detail-body-bookingdetailmanager">
                            <div className="schedule-info">
                              <span className="schedule-label">
                                Ngày dự kiến
                              </span>
                              <span className="schedule-value">
                                <CalendarIcon className="schedule-icon" />
                                {format(
                                  new Date(detail.scheduledDate),
                                  "dd/MM/yyyy"
                                )}
                              </span>
                            </div>
                            {isAdministered && (
                              <div className="administered-info">
                                <span className="administered-label">
                                  Ngày tiêm
                                </span>
                                <span className="administered-value">
                                  <CheckCircleIcon className="administered-icon" />
                                  {format(
                                    new Date(detail.administeredDate),
                                    "dd/MM/yyyy"
                                  )}
                                </span>
                              </div>
                            )}
                            {detail.feedback && (
                              <div className="feedback-info">
                                <span className="feedback-label">Ghi chú</span>
                                <span className="feedback-value">
                                  "{detail.feedback}"
                                </span>
                              </div>
                            )}
                            {detail.reactionNote.trim() !== "none" &&
                              detail.reactionNote &&
                              detail.reactionNote.trim() && (
                                <div className="reaction-info-bookingdetailmanager">
                                  <span className="reaction-label-bookingdetailmanager">
                                    Phản ứng sau tiêm
                                  </span>
                                  <span className="reaction-value-bookingdetailmanager">
                                    "{detail.reactionNote}"
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-details-bookingdetailmanager">
              <AlertCircleIcon className="no-details-icon-bookingdetailmanager" />
              <p className="no-details-text-bookingdetailmanager">
                Không có chi tiết đặt lịch nào phù hợp.
              </p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookingDetail;
