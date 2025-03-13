import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiUser,
  FiBarChart2,
  FiShield,
  FiBox,
  FiHome,
  FiMessageSquare,
  FiActivity,
  FiAlertTriangle,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { RiSyringeLine } from "react-icons/ri";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FaCashRegister } from "react-icons/fa";
import "../../style/AdminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, isLoggedIn, logout, isLoading } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isVaccineActive =
    location.pathname.startsWith("/admin/vaccines") ||
    location.pathname.startsWith("/admin/vaccine-combos");

  return (
    <div className="container-adminpage">
      {/* Sidebar */}
      <aside
        className={`sidebar-adminpage ${
          sidebarOpen ? "sidebar-open-adminpage" : "sidebar-closed-adminpage"
        }`}
      >
        {sidebarOpen ? (
          <div className="sidebar-header-adminpage">
            <div className="sidebar-logo-adminpage">
              <div className="icon-circle-adminpage">
                <RiSyringeLine className="syringe-icon-adminpage" />
              </div>
              <h1 className="sidebar-title-adminpage">Quản Trị Viên</h1>
            </div>
            <button onClick={toggleSidebar} className="toggle-btn-adminpage">
              <FiX size={24} />
            </button>
          </div>
        ) : (
          <div className="sidebar-header-closed-adminpage">
            <button onClick={toggleSidebar} className="toggle-btn-adminpage">
              <FiMenu size={24} />
            </button>
          </div>
        )}

        <nav className="nav-adminpage">
          <ul className="nav-list-adminpage">
            {sidebarOpen && (
              <li className="nav-section-adminpage">
                <p className="nav-section-title-adminpage">Tổng quan</p>
              </li>
            )}

            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiGrid
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Bảng Điều Khiển</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">Bảng Điều Khiển</span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/staffs"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiUser
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Quản Lý Nhân viên</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">
                    Quản Lý Nhân viên
                  </span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/customers"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiUsers
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Quản Lý Khách Hàng</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">
                    Quản Lý Khách Hàng
                  </span>
                )}
              </NavLink>
            </li>

            {sidebarOpen && (
              <li className="nav-section-adminpage">
                <p className="nav-section-title-adminpage">
                  Quản lý tiêm chủng
                </p>
              </li>
            )}

            <li>
              <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiCalendar
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Lịch Đăng Ký Tiêm</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">
                    Lịch Đăng Ký Tiêm
                  </span>
                )}
              </NavLink>
            </li>

            <li className="nav-group-adminpage">
              <div
                className={`nav-item-adminpage ${
                  isVaccineActive ? "nav-item-active-adminpage" : ""
                }`}
              >
                <RiSyringeLine
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Vaccine</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">Vaccine</span>
                )}
              </div>
              <ul
                className={`nav-sublist-adminpage ${
                  isVaccineActive ? "nav-sublist-active-adminpage" : ""
                }`}
              >
                <li>
                  <NavLink
                    to="/admin/vaccines"
                    className={({ isActive }) =>
                      `nav-subitem-adminpage ${
                        isActive ? "nav-item-active-adminpage" : ""
                      }`
                    }
                  >
                    <FiShield className="nav-icon-adminpage" />
                    {sidebarOpen && (
                      <span className="nav-text-adminpage">
                        Quản Lý Vaccine
                      </span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/vaccine-combos"
                    className={({ isActive }) =>
                      `nav-subitem-adminpage ${
                        isActive ? "nav-item-active-adminpage" : ""
                      }`
                    }
                  >
                    <FiBox className="nav-icon-adminpage" />
                    {sidebarOpen && (
                      <span className="nav-text-adminpage">Gói Vaccine</span>
                    )}
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <NavLink
                to="/admin/records"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiActivity
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Báo Cáo Phản Ứng</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">
                    Báo Cáo Phản Ứng
                  </span>
                )}
              </NavLink>
            </li>

            {sidebarOpen && (
              <li className="nav-section-adminpage">
                <p className="nav-section-title-adminpage">Hệ thống</p>
              </li>
            )}

            <li>
              <NavLink
                to="/admin/feedbacks"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiMessageSquare
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Phản Hồi</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">Phản Hồi</span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/marketing-campaigns"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiBarChart2
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">
                    Chiến Dịch Marketing
                  </span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">
                    Chiến Dịch Marketing
                  </span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/payments"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FaCashRegister
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Quản Lý Hóa Đơn</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">Quản Lý Hóa Đơn</span>
                )}
              </NavLink>
            </li>

            <li>
              <div
                onClick={handleLogout}
                className="nav-item-adminpage nav-logout-adminpage"
              >
                <FiLogOut
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Đăng Xuất</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">Đăng Xuất</span>
                )}
              </div>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Header */}
      <header
        className="header-adminpage"
        style={{
          left: sidebarOpen ? "16rem" : "4rem",
          right: "0",
        }}
      >
        <div className="header-content-adminpage">
          <div className="header-left-adminpage">
            <h1 className="header-title-adminpage">
              Trang Quản Trị Trung Tâm Tiêm Chủng
            </h1>
            <p className="header-date-adminpage">
              {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        className={`main-adminpage ${
          sidebarOpen ? "main-open-adminpage" : "main-closed-adminpage"
        }`}
      >
        <main className="content-adminpage">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="footer-adminpage">
          <p className="footer-text-adminpage">
            © 2025 VaccineCare - Hệ thống quản lý tiêm chủng | Phiên bản 1.0.2
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminPage;
