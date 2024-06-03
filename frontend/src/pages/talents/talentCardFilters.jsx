import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TalentCardFilters({ skills }) {
    const location = useLocation();
    const navigate = useNavigate();
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
        const newUrl = `${location.pathname}?${searchParams.toString()}`;
        navigate(newUrl);
    };

    const clearFilters = () => {
        setFilterData({
            minPrice: 0,
            maxPrice: 0,
            rating: "",
            skills: [],
        });
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
                <div>
                    <h2>Select Skills</h2>
                    {/* <div>
                        {skills.map((skill) => (
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
                    </div> */}
                    {/* <div>
                        <h3>Selected Skills</h3>
                        <ul>
                            {skills.map((skill) => (
                                <li key={skill}>{skill}</li>
                            ))}
                        </ul>
                    </div> */}
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
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-center">
                    Filter
                </button>
                <button
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-md text-center"
                    type="button"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            </div>
        </form>
    );
}
