import React, { useState } from 'react';
import { UserIcon, PhoneIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import axios from '../config/axiosConfig';
import { toast } from 'react-toastify';

function AddContactModal({ isOpen, onClose, onAddContact }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/contacts', {
        name,
        phone,
        isSpammer: false,
        spamLikelihood: 0,
      });
      
      onAddContact(response.data); 

      setName('');
      setPhone('');
      onClose();
      toast.success('Contact added successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to add contact!';
      toast.error(errorMessage);
      console.error('Error adding contact:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed px-4 inset-0 w-full bg-gray-900 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-lg relative">
        {/* Title with Icon */}
        <div className="flex items-center justify-center mb-6">
          <PlusCircleIcon className="w-8 h-8 text-[#8681d8] mr-2" />
          <h2 className="text-2xl font-semibold text-[#8681d8]">Add Contact</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <div className="relative">
              <UserIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9e9cde] focus:border-[#9e9cde] transition"
                placeholder="Enter name"
                required
              />
            </div>
          </div>

          {/* Phone Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Phone</label>
            <div className="relative">
              <PhoneIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                value={phone}
                pattern="\d{10}"
                maxLength="10"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#9e9cde] focus:border-[#9e9cde] transition"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#9e9cde] text-white px-5 py-2 rounded-lg hover:bg-[#8681d8] transition"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddContactModal;
