import React from "react";

export default function TalentCard() {
    return (
        <div className="flex flex-col lg:flex-row mt-16 px-10 ml-48">
            <div className="w-full lg:w-1/5 p-4 bg-gray-100 border-r">
                <div className="mb-6">
                    <h4 className="mb-2 text-lg font-semibold">Category</h4>
                    <select className="w-full p-2 border rounded">
                        <option value="">Select Category</option>
                        <option value="web-design">Web Design</option>
                        <option value="graphic-design">Graphic Design</option>
                        <option value="writing">Writing</option>
                    </select>
                </div>
                <div className="mb-6">
                    <h4 className="mb-2 text-lg font-semibold">Price Range</h4>
                    <label className="block mb-2" htmlFor="min-price">
                        Min Price
                    </label>
                    <input
                        type="number"
                        id="min-price"
                        className="w-full p-2 mb-4 border rounded"
                        placeholder="Min Price"
                    />
                    <label className="block mb-2" htmlFor="max-price">
                        Max Price
                    </label>
                    <input
                        type="number"
                        id="max-price"
                        className="w-full p-2 border rounded"
                        placeholder="Max Price"
                    />
                </div>
                <div className="mb-6">
                    <h4 className="mb-2 text-lg font-semibold">Rating</h4>
                    <select className="w-full p-2 border rounded">
                        <option value="">Select Rating</option>
                        <option value="4">4 stars & up</option>
                        <option value="3">3 stars & up</option>
                        <option value="2">2 stars & up</option>
                        <option value="1">1 star & up</option>
                    </select>
                </div>
            </div>
            <div className="w-full lg:w-4/5 px-4 flex flex-wrap gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                    <div
                        key={index}
                        className="w-full sm:w-1/2 md:w-1/4 p-4 bg-white border rounded shadow"
                    >
                        <img
                            className="w-full h-56 mb-1"
                            src="https://via.placeholder.com/400"
                            alt="Talent Photo"
                        />
                        <h3 className="text-xs mb-2 font-semibold">
                            Ad by <a href="/">John Doe</a>
                        </h3>
                        <p className="text-sm text-gray-600">
                            I will develop, integrate, and deploy REST APIs with
                            Node.js, Express.js, NestJS
                        </p>
                        <h3 className="text-lg font-semibold mt-3">$100</h3>
                        <p className="text-sm text-gray-600">
                            <a href="/">View Details</a>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
