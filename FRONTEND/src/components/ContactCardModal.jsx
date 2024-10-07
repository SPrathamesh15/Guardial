import React, { useState } from "react";
import {
  PhoneIcon,
  EnvelopeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import BlueTickIcon from "../assets/icons/blueTick.png";
import { FaExclamationTriangle } from "react-icons/fa";
import axios from "../config/axiosConfig";
import { toast } from "react-toastify";

const ContactCardModal = ({ contact }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmSpam, setIsConfirmSpam] = useState(false);
  const [isConfirmAdd, setIsConfirmAdd] = useState(false);
  console.log("contacts", contact);

  const handleMarkAsSpam = async () => {
    try {
      await axios.post("/api/mark-spam", { phone: contact.phone });
      toast.success("Contact marked as spam successfully!");
      setIsConfirmSpam(false);
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to mark as spam";
      toast.error(errorMessage);
    }
  };

  const handleAddContact = async () => {
    try {
      await axios.post("/api/contacts", {
        name: contact.name,
        phone: contact.phone,
        isSpammer: contact.isSpammer || false,
        spamLikelihood: contact.usersMarkedSpam || 0,
      });
      toast.success("Contact added successfully!");
      setIsConfirmAdd(false);
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to add contact";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {/* Contact Card */}
      <li
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer flex flex-col p-4 bg-[#F7F7FC] rounded-lg shadow-md hover:bg-[#EBEBF7] transition duration-200 ease-in-out"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium text-gray-900 flex items-center">
              <h3 className="text-xl font-semibold text-[#807dbd] flex">
                <span className="truncate" style={{ maxWidth: "150px" }}>
                  {contact.name.length > 12
                    ? `${contact.name.substring(0, 12)}...`
                    : contact.name}
                </span>
                {contact.isVerified && (
                  <img src={BlueTickIcon} alt="Verified" className="w-5 h-5" />
                )}
              </h3>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Phone and Spam Likelihood */}
            <div className="flex items-center">
              <PhoneIcon className="w-5 h-5 text-[#B7B5F3] mr-1" />
              <p className="text-gray-600">{contact.phone}</p>
            </div>

            {/* Spam Likelihood Progress Bar */}
            <div className="relative w-10 h-10 group hover:scale-110 transition-transform duration-300">
              <svg
                className="transform -rotate-90 w-full h-full"
                viewBox="0 0 36 36"
              >
                {/* Background circle */}
                <circle
                  className="text-gray-300"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="16"
                  cx="18"
                  cy="18"
                />
                {/* Foreground circle (progress) */}
                <circle
                  className="text-pink-500"
                  strokeWidth="4"
                  strokeDasharray="100, 100"
                  strokeDashoffset={100 - contact.spamLikelihood}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="16"
                  cx="18"
                  cy="18"
                />
              </svg>

              {/* Centered Percentage Text */}
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-600 group-hover:text-pink-500 transition-all duration-300">
                {contact.spamLikelihood}%
              </div>
            </div>
          </div>
        </div>

        {/* Show email if registered */}
        {contact.email && (
          <div className="flex items-center mt-2">
            <EnvelopeIcon className="w-5 h-5 text-[#B7B5F3] mr-1" />
            <p className="text-[#6d6d6d]">{contact.email}</p>
          </div>
        )}
      </li>

      {/* Modal for full details */}
      {isModalOpen && (
        <div className="fixed inset-0 px-4 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-lg max-w-lg w-full">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-[#807dbd]">
                {contact.name}
              </h3>
              {contact.isVerified && (
                <img src={BlueTickIcon} alt="Verified" className="w-6 h-6" />
              )}
            </div>

            {/* Contact Details */}
            <p className="mt-2 text-gray-600">{contact.phone}</p>
            {contact.email && (
              <p className="mt-1 text-gray-600">Email: {contact.email}</p>
            )}

            {/* Spam Likelihood with Circular Progress Bar */}
            <div className="flex items-center mt-4">
              <p className="text-gray-600 text-sm mr-2">Spam Likelihood:</p>

              {/* Circle Wrapper */}
              <div className="relative w-12 h-12 group hover:scale-110 transition-transform duration-300">
                <svg
                  className="transform -rotate-90 w-full h-full"
                  viewBox="0 0 36 36"
                >
                  {/* Background circle */}
                  <circle
                    className="text-gray-300"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="16"
                    cx="18"
                    cy="18"
                  />
                  {/* Foreground circle (progress) */}
                  <circle
                    className="text-pink-500"
                    strokeWidth="4"
                    strokeDasharray="100, 100"
                    strokeDashoffset={100 - contact.spamLikelihood}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="16"
                    cx="18"
                    cy="18"
                  />
                </svg>

                {/* Centered Percentage Text */}
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-600 group-hover:text-pink-500 transition-all duration-300">
                  {contact.spamLikelihood}%
                </div>
              </div>
            </div>

            {/* Buttons Section */}
            <div className="flex space-x-4 mt-4">
              {/* Mark as Spam Button */}
              <button
                onClick={() => setIsConfirmSpam(true)}
                className="px-8 py-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 shadow-md flex items-center"
              >
                <FaExclamationTriangle className="mr-2" size={24} />
                <span className="md:inline font-semibold hidden">
                  Mark as Spam
                </span>
              </button>

              {/* Add to Contacts Button */}
              <button
                onClick={() => setIsConfirmAdd(true)}
                className="px-8 py-2 rounded-full bg-indigo-50 text-indigo-500 hover:bg-indigo-100 shadow-md flex items-center"
              >
                <PlusCircleIcon className="mr-2 w-8 h-8" />
                <span className="md:inline font-semibold hidden">
                  Add to Contacts
                </span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-[#9e9cde] text-white py-2 px-4 rounded-md hover:bg-[#8681d8] transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation for marking as spam */}
      {isConfirmSpam && (
        <div className="fixed px-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-lg max-w-md w-full">
            <p>Are you sure you want to mark this contact as spam?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmSpam(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsSpam}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation for adding contact */}
      {isConfirmAdd && (
        <div className="fixed px-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-lg max-w-md w-full">
            <p>Are you sure you want to add this contact?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmAdd(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactCardModal;
