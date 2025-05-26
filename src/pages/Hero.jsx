import React from 'react';

const Hero = () => {
    return (
        <div className="min-h-screen bg-[#E5E5E5] px-2 pt-28 pb-10 flex flex-col-reverse md:flex-row items-center justify-between gap-40 max-w-7xl mx-auto">

            {/* Left Side: Image (only on md+ screens) */}
            <div className="hidden md:flex w-1/2 justify-center">
                <img
                    src="/vector/img1.svg"
                    alt="Main Visual"
                    className="w-full max-w-md md:max-w-lg object-contain"
                />
            </div>

            {/* Right Side: Text + Buttons + Book-step */}
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-15 px-4 md:px-0">

                {/* Text Content */}
                <div className="space-y-3 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Welcome to MyLibrary
                    </h1>

                    <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto md:mx-0">
                        One place solution for all your knowledge needs — discover, search, and explore a wide range of curated books, resources, and educational materials, all in one seamless platform.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300">
                            🔍 Search Our Collection
                        </button>
                        <button className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300">
                            📚 Top Books
                        </button>
                    </div>
                </div>

                {/* Book-step image */}
                <div className="flex justify-end mt-10">
                    <img
                        src="/vector/Book-step.svg"
                        alt="Book Step"
                        className="w-44 md:w-56"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;
