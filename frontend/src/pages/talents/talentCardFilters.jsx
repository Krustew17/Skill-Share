import { useState, useCallback } from "react";

export default function TalentCardFilters() {
    const [filterData, setFilterData] = useState({
        minPrice: 0,
        maxPrice: 0,
        rating: "",
    });

    const handleFilterDataChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilterData({ ...filterData, [name]: value });
        console.log(filterData);
    });

    const handleFilterFormSubmit = async (e) => {
        e.preventDefault();
        console.log("submitted");
    };

    return (
        <form
            className="w-full lg:w-1/5 p-4 bg-white dark:bg-gray-800 shadow-lg dark:shadow-slate-600 border-2 dark:border-gray-700"
            onSubmit={handleFilterFormSubmit}
        >
            <h1 className="text-center text-3xl font-semibold mb-3 dark:text-white">
                Filters
            </h1>
            <div className="mb-6">
                <h4 className="mb-2 text-lg font-semibold dark:text-gray-200">
                    Price Range
                </h4>
                <label
                    className="block mb-2 dark:text-gray-300"
                    htmlFor="min-price"
                >
                    Min Price
                </label>
                <input
                    type="number"
                    name="minPrice"
                    value={filterData.minPrice}
                    onChange={handleFilterDataChange}
                    id="min-price"
                    className="w-full p-2 mb-4 border rounded"
                    placeholder="Min Price"
                />
                <label
                    className="block mb-2 dark:text-gray-300"
                    htmlFor="max-price"
                >
                    Max Price
                </label>
                <input
                    name="maxPrice"
                    value={filterData.maxPrice}
                    onChange={handleFilterDataChange}
                    type="number"
                    id="max-price"
                    className="w-full p-2 border rounded"
                    placeholder="Max Price"
                />
            </div>
            <div className="mb-6">
                <h4 className="mb-2 text-lg font-semibold dark:text-gray-200">
                    Rating
                </h4>
                <select className="w-full p-2 border rounded">
                    <option value="">Select Rating</option>
                    <option value="4">4 stars & up</option>
                    <option value="3">3 stars & up</option>
                    <option value="2">2 stars & up</option>
                    <option value="1">1 star & up</option>
                </select>
            </div>
            <button className="px-8 py-2 bg-red-500 hover:bg-red-600 rounded-md text-center">
                Filter
            </button>
        </form>
    );
}
