import { useState, useEffect, useRef } from "react";

export default function HeaderFilter({ header, values = ["bla", "blu", "ble"], onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
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
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    setSelected(updated);
    onFilterChange && onFilterChange(updated);
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
                checked={selected.includes(value)}
                onChange={() => handleCheckboxChange(value)}
              />
              <span className="truncate">{value}</span>
            </label>
          ))}
        </div>
      )}
    </th>
  );
}
