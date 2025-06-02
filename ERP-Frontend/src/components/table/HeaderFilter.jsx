import { useState, useEffect, useRef } from "react";

export default function HeaderFilter({ header, values = [], selectedFilters, setSelectedFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (value) => {
    let isInList = selectedFilters.findIndex(filter => filter.id == value.id);
    const updated = isInList != -1
      ? selectedFilters.filter((v) => v.id !== value.id)
      : [...selectedFilters, value];

    setSelectedFilters(updated);
  };

  const sortedValues = [...new Set(values)].sort();

  return (
    <th
      className="border p-2 text-left h-[2vh] relative"
      style={{ width: header.size }}
      ref={ref}
    >
      <div className="flex">
        <label>{header.name}</label>
        <button
          className="text-gray-600 pl-2"
          onClick={toggleDropdown}
          type="button"
        >
          ▼
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border rounded shadow-md w-48 max-h-60 overflow-y-auto">
          {sortedValues.map((value, index) => (
            <label
              key={index}
              className="flex items-center px-2 py-1 hover:bg-gray-100"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedFilters.map(filter => filter.id).includes(value.id)}
                onChange={() => handleCheckboxChange(value)}
              />
              <span className="truncate">{value.text}</span>
            </label>
          ))}
        </div>
      )}
    </th>
  );
}
