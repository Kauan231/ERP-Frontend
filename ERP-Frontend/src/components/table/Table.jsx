import "../css/components/table.css";
import Placeholder from "../../assets/placeholder.svg";
import HeaderFilter from "./HeaderFilter";
import { Pagination } from "./Pagination";
import HeaderSearch from "./headerSearch";

export default function Table({ content, headers, currentPage, setCurrentPage, totalPages}) {
  const checkedItems = headers.find(header => header.name == "Checkbox")?.checkedItems;
  const setCheckedItems = headers.find(header => header.name == "Checkbox")?.setCheckedItems;

  const dataToElement = (data, key) => {
    if (data.type === "label") {
      return <label
      title={data.text}
      key={key}
      >
        {data.text}
      </label>;
    }

    if (data.type === "label-image") {
      return (
        <div
        className="flex flex-row items-center"
        key={key}
        >
          <img src={Placeholder} className="w-8" alt="placeholder" />
          <label className="ml-2" title={data.text}>
            {data.text}
          </label>
        </div>
      );
    }

    if (data.type === "checkbox") {
      return <input
      type="checkbox"
      checked={checkedItems[data.id] || false}
      onClick={() => {
          let changedItems = checkedItems;
          if(changedItems[data.id]) {
            delete changedItems[data.id]
          } else {
            changedItems[data.id] = true;
          }
          setCheckedItems({...changedItems})
          headers.find(header => header.name == "Checkbox").getCheckedItens(changedItems)
        }
      }
      key={key}
      />;
    }

    if (data.type === "label-filter") {
      return (
        <div
        className="flex items-center gap-1"
        key={key}
        >
          <label title={data.text}>{data.text}</label>
        </div>
      );
    }

    if (data.type === "custom") {
      return data.content();
    }

    return null;
  };

  const dataToHeader = (header, index) => {
    if (header.type === "normal" || header.type == "custom") {
      return (
        <th
          key={index}
          className="border p-2 text-left h-[2vh]"
          style={{ width: header.size }}
        >
          {header.name}
        </th>
      );
    }

    if (header.type === "filter") {
      return (
        <HeaderFilter
          key={index}
          header={header}
          values={header.filters}
          selectedFilters={header.selectedFilters}
          setSelectedFilters={header.setSelectedFilters}
        />
      );
    }

    if (header.type === "search") {
      return (
        <HeaderSearch
          key={index}
          header={header}
          placeholder={header.placeholder}
          onSearch={header.onSearch}
        />
      );
    }
  };

  return (
    <div className="w-full">
      {Object.keys(checkedItems || {}).length > 0 && (
        <div className="flex items-center bg-gray-100 justify-between pt-2 pb-2 pl-8 pr-8 rounded-full mb-2 text-black font-bold">
          <span>{Object.keys(checkedItems).length} itens selecionados</span>
          <div className="flex gap-12 ">
            { headers.find(header => header.name == "Checkbox").actionButtons() }
          </div>
        </div>
      )}

      <table className="Table">
        <thead>
          <tr className="text-gray-200 border-b-2 border-gray-600">
            {headers.map((header, index) => dataToHeader(header, index))}
          </tr>
        </thead>
      </table>

      <div className="TableRowContainer overflow-y-auto max-h-[60vh] min-h-[42vh]">
        <table className="w-full table-fixed text-black border-collapse">
          <tbody>
            {content.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white hover:bg-gray-200 border-b-2 border-gray-500/30">
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="border pt-[1vh] pl-2"
                    style={{ width: header.size }}
                  >
                    {dataToElement(row[header.name], rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
