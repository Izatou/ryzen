import React from "react";
import { Link } from "react-router-dom";
import imgNegativeCovid19 from "../assets/img-negative-covid19.png";
import imgPositiveCovid19 from "../assets/img-positive-covid19.png";
import { ReactComponent as LogoInose } from "../assets/logo-full.svg";

const Home = () => (
    <div className="flex-1 flex items-center px-8">
        <div className="w-full">
            <div className="mx-auto w-24 rounded-lg mb-16">
                <LogoInose className="w-full" />
            </div>
            <div className="mb-12 -space-x-12 flex justify-center">
                <div className="flex flex-col origin-bottom-left transform -rotate-6 w-56 h-72 bg-white rounded-2xl shadow-lg">
                    <div className="flex-1 flex items-center">
                        <img
                            src={imgNegativeCovid19}
                            className="w-32 mx-auto opacity-75"
                        />
                    </div>
                    <div className="pb-5 text-2xl text-center font-semibold leading-7">
                        <p className="text-green-500">Negatif</p>
                        <p className="text-green-700">Covid-19</p>
                    </div>
                </div>

                <div className="flex flex-col origin-bottom-left transform rotate-6 w-56 h-72 bg-brand-red rounded-2xl shadow-lg">
                    <div className="flex-1 flex items-center">
                        <img
                            src={imgPositiveCovid19}
                            className="w-4/5 mx-auto"
                        />
                    </div>
                    <div className="pb-5 text-2xl text-center font-semibold leading-7">
                        <p className="text-yellow-300">Positif</p>
                        <p className="text-white">Covid-19</p>
                    </div>
                </div>
            </div>
            <div className="text-center mb-16">
                <h1 className="text-3xl text-brand-green font-semibold mb-2">
                    Covid-19 Test
                </h1>
                <p className="text-xl text-brand-green opacity-70">
                    i-nose C-19 hadir untuk membantu negara menghadapi COVID-19
                    hanya dengan keringat ketiak (
                    <span className="italic">axillary sweat</span>)
                </p>
            </div>
            <div className="mb-5">
                <Link to="/scan">
                    <button className="relative p-3 font-semibold tracking-wide rounded-lg text-white text-xl w-full bg-brand-green shadow-lg focus:outline-none">
                        Mulai Test
                        <div className="flex items-center absolute inset-y-0 right-0 pr-2">
                            <svg
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </button>
                </Link>
            </div>
        </div>
    </div>
);

export default Home;
