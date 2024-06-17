import { useState, useCallback } from "react";
import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function TalentCardFilters({ skills }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [filterData, setFilterData] = useState({
        minPrice: "",
        maxPrice: "",
        rating: "",
    });
    const handleFilterDataChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setFilterData({ ...filterData, [name]: value });
        },
        [filterData]
    );

    const handleFilterFormSubmit = async (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams(location.search);

        searchParams.set("minPrice", filterData.minPrice);
        searchParams.set("maxPrice", filterData.maxPrice);
        searchParams.set("rating", filterData.rating);

        if (filterData.minPrice === "") {
            searchParams.delete("minPrice");
        }

        if (filterData.maxPrice === "") {
            searchParams.delete("maxPrice");
        }

        if (filterData.rating === "") {
            searchParams.delete("rating");
        }

        if (selectedSkills.length > 0) {
            searchParams.set("skills", selectedSkills.join(","));
        }

        const newUrl = `${location.pathname}?${searchParams.toString()}`;
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", 1);
        setSearchParams(newSearchParams);
    };

    const clearFilters = () => {
        setFilterData({
            minPrice: "",
            maxPrice: "",
            rating: "",
            skills: [],
        });
        history.pushState(null, null, location.pathname);
        setSelectedSkills([]);
        navigate(location.pathname);
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setSelectedSkills((prevSelectedSkills) =>
            checked
                ? [...prevSelectedSkills, value]
                : prevSelectedSkills.filter((skill) => skill !== value)
        );
    };

    return (
        <form
            className="md:w-full mb-5 lg:w-1/5 p-4 bg-white dark:bg-gray-800 max-h-screen shadow-lg dark:shadow-slate-600 border-2 dark:border-gray-700"
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
                <div className="text-white">
                    <label className="mb-2 text-lg font-semibold dark:text-gray-200">
                        Select Skills
                    </label>
                    {skills && (
                        <div className="flex flex-col max-h-36 overflow-auto">
                            {skills?.map((skill) => (
                                <div key={skill}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={skill}
                                            onChange={handleCheckboxChange}
                                        />
                                        {skill}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="mb-6">
                <h4 className="mb-2 text-lg font-semibold dark:text-gray-200">
                    Rating
                </h4>
                <select
                    className="w-full p-2 border rounded"
                    name="rating"
                    value={filterData.rating}
                    onChange={handleFilterDataChange}
                >
                    <option value="">Select Rating</option>
                    <option value="5">5 stars only</option>
                    <option value="4">4 stars & up</option>
                    <option value="3">3 stars & up</option>
                    <option value="2">2 stars & up</option>
                    <option value="1">1 star & up</option>
                </select>
            </div>
            <div className="flex justify-between">
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-center text-white">
                    Filter
                </button>
                <button
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-md text-center text-white"
                    type="button"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            </div>
        </form>
    );
}
