"use client";

import React from "react";
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchOpen,
  setSearchOpen,
  showSearch,
  setShowSearch,
  searchInputRef,
}) => (
  <div className={`flex items-center ${searchOpen ? "absolute" : "relative left-2"}`}>
    {searchOpen ? (
      <motion.input
        type="text"
        ref={searchInputRef}
        placeholder="Pesquisar..."
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: searchOpen ? 300 : 0, opacity: searchOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white outline-none h-[3rem] border-gray-400 rounded-md px-4 py-1 text-xl"
      />
    ) : (
      <input
        type="text"
        placeholder="Pesquisar..."
        className="bg-white outline-none h-[3rem] hidden md:block border-gray-400 rounded-md shadow-md px-4 py-1 text-xl"
      />
    )}
    <CiSearch
      id="mobile"
      className="text-4xl md:hidden block w-[3.4rem] h-[3.4rem] cursor-pointer rounded-md shadow-md ms-2"
      onClick={() => {
        setSearchOpen(!searchOpen);
        setShowSearch(!showSearch);
      }}
    />
    <CiSearch className="text-4xl w-[3rem] h-[3rem] hidden md:block cursor-pointer rounded-md shadow-md ms-2" />
  </div>
);

export default SearchBar;
