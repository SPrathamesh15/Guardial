import React, { useState, useEffect } from 'react';

function EditContactModal({ isOpen, onClose, contact, onUpdateContact }) {
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone);
    }
  }, [contact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateContact({ ...contact, name, phone });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 px-4 flex items-center bg-gray-900 bg-opacity-40 justify-center z-50">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-96">
        <h2 className="text-2xl text-[#8681d8] font-bold mb-4">Edit Contact</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              pattern="\d{10}"
              maxLength="10"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#9e9cde] hover:bg-[#8681d8] text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditContactModal;
