import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from '../config/axiosConfig';
import ContactCardModal from './ContactCardModal';

function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/search?query=${searchQuery}`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleMarkAsSpam = (phone) => {
    alert(`Marked ${phone} as spam`);
  };

  return (
    <div className="md:px-6 md:py-6 min-h-screen bg-white rounded-xl">
      <h2 className="text-3xl font-bold text-[#807dbd] mb-6">Global Search</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mt-4">
        <div className="flex items-center bg-white rounded-full p-2 shadow-md">
          <FaSearch className="text-gray-500 ml-3" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or phone number"
            required
            className="bg-transparent flex-1 py-2 md:py-0 outline-none text-gray-800 px-3 md:px-4"
          />
          <button
            type="submit"
            className="hidden md:inline bg-[#9e9cde] text-white py-2 px-6 rounded-full font-bold hover:bg-[#8681d8] transition duration-300 mr-3"
          >
            Search
          </button>
        </div>
      </form>

      {/* Search Results */}
      <div className="mt-10 space-y-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <ContactCardModal
                key={index}
                contact={contact}
                onMarkAsSpam={handleMarkAsSpam}
              />
            ))
          ) : (
            <li className="text-center text-gray-500">No results found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default GlobalSearch;
