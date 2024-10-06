import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../style/style.css";
import { AuthContext } from "../context/authContext";
import CallerList from "../components/CallerList";
import GlobalSearch from "../components/GlobalSearch";
import ConfirmationModal from "../components/ConfirmationModal";

function Home() {
  const [selectedTab, setSelectedTab] = useState("Caller list");
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    setModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#B7B5F3]">
      {/* Header */}
      <div className="bg-white sticky p-4 md:p-4 px-4 mt-4 md:mt-6 rounded-xl md:px-8 mx-4 md:mx-10 shadow-lg flex justify-between items-center">
        {/* Logo */}
        <div className="md:text-3xl text-xl font-bold text-[#7f7bd2] righteous-regular cursor-pointer">
          Guardial
        </div>
        {/* Welcome Message with Logout */}
        <h1
          className="md:text-2xl text-lg font-bold text-center text-[#8681d8] cursor-pointer"
          onClick={handleLogout}
        >
          Welcome{" "}
          {currentUser
            ? window.innerWidth < 768
              ? currentUser.name.length > 10
                ? `${currentUser.name.slice(0, 10)}...`
                : currentUser.name
              : currentUser.name
            : "User"}
          !
        </h1>
      </div>

      {/* Tabs */}
      <ul className="tabs group md:mx-auto mt-10">
        <li className={selectedTab === "Caller list" ? "active" : ""}>
          <a href="#caller-list" onClick={() => setSelectedTab("Caller list")}>
            Caller list
          </a>
        </li>
        <li className={selectedTab === "Global search" ? "active" : ""}>
          <a
            href="#global-search"
            onClick={() => setSelectedTab("Global search")}
          >
            Global search
          </a>
        </li>
      </ul>

      {/* Section Content */}
      <div className="flex-1 bg-white mx-4 md:mx-10 mb-10 md:mb-10 rounded-3xl shadow-md">
        <div className="rounded-b-3xl p-6">
          {selectedTab === "Caller list" && <CallerList />}
          {selectedTab === "Global search" && <GlobalSearch />}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmLogout}
        message="Are you sure you want to logout?"
      />
    </div>
  );
}

export default Home;
