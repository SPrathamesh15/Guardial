import React, { useState, useEffect } from "react";
import {
  PhoneIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "../config/axiosConfig";
import AddContactModal from "./AddContactModal";
import EditContactModal from "./EditContactModal";
import ConfirmationModal from "./ConfirmationModal";
import { toast } from "react-toastify";

function CallerList() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const contactsPerPage = 16;

  useEffect(() => {
    fetchContacts();
  }, [currentPage]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `/api/contacts?page=${currentPage}&limit=${contactsPerPage}`
      );
      setContacts(response.data.contacts);
      setTotalContacts(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleAddContact = async () => {
    await fetchContacts();
  };

  const handleEditContact = (contact) => {
    setContactToEdit(contact);
    setEditModalOpen(true);
  };

  const handleUpdateContact = async (updatedContact) => {
    try {
      await axios.put(`/api/contacts/${updatedContact.id}`, updatedContact);
      await fetchContacts();
      setEditModalOpen(false);
      toast.success(`Contact updated successfully`);
    } catch (error) {
      toast.error(
        `${error.response?.data?.error}` || "Falied to update contact"
      );
      console.error("Error updating contact:", error);
    }
  };

  const handleDeleteContact = (contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (contactToDelete) {
      try {
        await axios.delete(`/api/contacts/${contactToDelete.id}`);
        await fetchContacts();
        setDeleteModalOpen(false);
        setContactToDelete(null);
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(totalContacts / contactsPerPage))
    );
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const totalPages = Math.ceil(totalContacts / contactsPerPage);

  return (
    <>
      <div className="md:px-6 md:py-6 relative bg-white rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-[#807dbd]">Caller List</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center bg-[#9e9cde] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#8681d8] transition duration-200"
          >
            <PlusCircleIcon className="w-6 h-6 text-white mr-2" />
            Add Contact
          </button>
        </div>

        <p className="text-gray-500 mb-4">
          This section will display your saved contacts.
        </p>

        <AddContactModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onAddContact={handleAddContact}
        />

        {/* Edit Contact Modal */}
        {contactToEdit && (
          <EditContactModal
            isOpen={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            contact={contactToEdit}
            onUpdateContact={handleUpdateContact}
          />
        )}

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDeleteContact}
          message="Are you sure you want to delete this contact?"
        />

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <li
                key={contact.id}
                className="flex items-center justify-between p-4 bg-[#F7F7FC] rounded-lg shadow-md hover:bg-[#EBEBF7] transition duration-200 ease-in-out"
              >
                <div className="flex items-center">
                  <PhoneIcon className="w-6 h-6 text-[#B7B5F3] mr-3" />
                  <div>
                    <span className="font-medium text-gray-900">
                      {contact.name}
                    </span>
                    <p className="text-gray-600">{contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  {contact.isSpammer === 1 && (
                    <div className="flex items-center relative group">
                      <ExclamationTriangleIcon
                        className="w-6 h-6 text-red-500 mr-1"
                        title="Spammer"
                      />
                      {/* Tooltip text */}
                      <span className="absolute hidden group-hover:block text-red-500 bg-white p-1 rounded-md shadow-lg -top-8 left-0">
                        Spammer
                      </span>
                    </div>
                  )}

                  {/* Edit and Delete buttons */}
                  <button
                    onClick={() => handleEditContact(contact)}
                    className="ml-2 text-gray-600 hover:text-blue-600 transition duration-200"
                  >
                    <PencilSquareIcon className="w-5 h-5 text-indigo-400 hover:text-indigo-700" />
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact)}
                    className="ml-2 text-red-400 hover:text-red-700 transition duration-200"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">No contacts found.</li>
          )}
        </ul>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="hidden md:inline ml-2">Previous</span>
          </button>

          <span className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl">
            {`Page ${currentPage} of ${totalPages}`}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className={`flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200 ${
              currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="hidden md:inline mr-2">Next</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}

export default CallerList;
