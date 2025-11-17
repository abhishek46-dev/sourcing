import { FaRegBell } from 'react-icons/fa';
import React, { useState, useRef } from 'react';



const Header = () => {
  const [showChat, setShowChat] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const chatRef = useRef();
  const notifRef = useRef();
  const profileRef = useRef();

  // Close popovers on click outside
  React.useEffect(() => {
    function handleClick(e) {
      if (
        chatRef.current && !chatRef.current.contains(e.target) &&
        notifRef.current && !notifRef.current.contains(e.target) &&
        profileRef.current && !profileRef.current.contains(e.target)
      ) {
        setShowChat(false);
        setShowNotif(false);
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="flex items-center justify-end w-[1450px] h-20 px-5 border-b border-gray-200 bg-white fixed top-0 left-64 z-10" style={{maxWidth:'1800px'}}>
      {/* Season Dropdown */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center mr-4">
          <span className="text-[10px] text-gray-400 font-semibold leading-none mb-1 tracking-widest">SEASON</span>
          <select className="border border-gray-200 rounded-md px-3 py-1 text-sm font-semibold text-[#011F33] bg-white focus:outline-none focus:ring-2 focus:ring-[#a259ff]">
            <option>SS 25</option>
            <option>AW 25</option>
          </select>
        </div>
        {/* Divider */}
        <div className="h-10 w-px bg-gray-200 mx-4"></div>
        {/* Icons */}
        <div className="flex items-center gap-6">
          {/* Chat Icon */}
          <div className="relative" ref={chatRef}>
            <button
              className="relative text-[#011F33] text-2xl flex items-center justify-center"
              onClick={() => {
                setShowChat(v => !v);
                setShowNotif(false);
                setShowProfile(false);
              }}
              style={{ width: 32, height: 32, padding: 0, background: 'none', border: 'none' }}
            >
              <img src="/uploads/chat.svg" alt="Chat" style={{ width: 28, height: 28, display: 'block' }} />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1 border-2 border-white">2</span>
            </button>
            {showChat && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-50 p-3">
                <div className="font-semibold mb-2 text-[#011F33]">Chat Notifications</div>
                <div className="text-sm text-gray-700 mb-1">New message from Brand: "Please review the latest update."</div>
                <div className="text-sm text-gray-700">Vendor: "Can you check the shipment status?"</div>
              </div>
            )}
          </div>
          {/* Notification Icon */}
          <div className="relative" ref={notifRef}>
            <button
              className="relative text-[#011F33] text-2xl"
              onClick={() => {
                setShowNotif(v => !v);
                setShowChat(false);
                setShowProfile(false);
              }}
            >
              <FaRegBell color="#011F33" />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1 border-2 border-white">2</span>
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-50 p-3">
                <div className="font-semibold mb-2 text-[#011F33]">Notifications</div>
                <div className="text-sm text-gray-700 mb-1">Brand: "Order #1234 has shipped."</div>
                <div className="text-sm text-gray-700">Vendor: "Invoice #5678 is due."</div>
              </div>
            )}
          </div>
          {/* Profile Icon with AR initials */}
          <div className="relative" ref={profileRef}>
            <button
              className="w-8 h-8 rounded-full border-2 border-white shadow flex items-center justify-center bg-[#a259ff] text-white font-bold text-lg"
              onClick={() => {
                setShowProfile(v => !v);
                setShowChat(false);
                setShowNotif(false);
              }}
            >
              AR
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50 p-2">
                <div className="px-3 py-2 text-[#011F33] font-semibold">Abhishek Raj</div>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 text-[#011F33]">Login</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 text-[#011F33]">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

  );
};

export default Header;
