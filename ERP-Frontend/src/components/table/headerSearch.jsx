import { useState, useEffect, useRef } from "react";
import Input from "../inputs/Input"
import searchIcon from "../../assets/searchIcon.svg"

export default function HeaderSearch({ header, placeholder, onSearch}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <th
      className="border p-2 text-left h-[2vh] relative"
      style={{ width: header.size }}
    >
      <div className="flex">
        <label>{header.name}</label>
        <button
          className="text-gray-600 pl-2"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          ▼
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border rounded shadow-md w-64 p-2 max-h-60 overflow-y-auto">
          <div
            className="flex flex-row text-sm"
          >
            <Input
              placeholder={placeholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <img
              src={searchIcon}
              className="h-10 p-2"
              onClick={() => {
                setIsOpen(false);
                onSearch(search)
              }}
            />
            </div>
        </div>
      )}
    </th>
  );
}
