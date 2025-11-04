'use client'

import { useRef, useState, useEffect } from 'react'
import Image from "next/image"
import { FaPhoneVolume } from 'react-icons/fa6';
import { AiOutlineMail } from 'react-icons/ai';
import { misExploreFeature } from '../data/misExploreFeature'
import { motion } from 'framer-motion'
import Link from 'next/link';

export default function UserManual() {

    // ✅ Section references
    const sections = {
        install: useRef(null),
        reset: useRef(null),
        payment: useRef(null),
        assistance: useRef(null),
        features: useRef(null),
    }

    const [active, setActive] = useState('install')

    // ✅ Scroll smoothly to section
    const scrollToSection = (refName) => {
        const section = sections[refName].current
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setActive(refName)
        }
    }

    // ✅ Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const offsets = Object.entries(sections).map(([key, ref]) => ({
                key,
                top: ref.current?.getBoundingClientRect().top,
            }))

            const visible = offsets.find(item => item.top > 0 && item.top < window.innerHeight / 2)
            if (visible) setActive(visible.key)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="w-full mx-auto text-gray-800 font-sans">
            {/* 🔹 Header Section */}
            <div className="flex flex-row justify-between border-b border-gray-300 py-3 items-center sm:w-[95vw] lg:w-[80vw] mx-auto ">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 px-8">
                    {/* <p className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-md">
                    Enquiry
                    </p> */}

                    <div className="flex items-center gap-2">
                        <FaPhoneVolume size={16} className="text-blue-600" />
                        <a
                            href="tel:+917088909192"
                            className="hover:underline text-blue-700"
                        >
                            +91-7088909192
                        </a>
                    </div>

                    <div className="flex items-center gap-2">
                        <AiOutlineMail size={18} className="text-blue-600" />
                        <a
                            href="mailto:info@sdt.net.in"
                            className="hover:underline text-blue-700"
                        >
                            info@sdt.net.in
                        </a>
                    </div>

                </div>

                <div className="px-8">
                    <p className="text-blue-600 font-bold cursor-pointer hover:underline"><Link href="/">Login</Link></p>
                </div>
            </div>

            {/* //below header section */}
            <div className="w-full lg:w-[70vw] mx-auto ">
                {/* 🔹 Hero Section */}
                <motion.div
                    className="flex flex-row justify-between items-center p-4"
                    id="hero"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-blue-900 leading-snug mx-4 lg:mx-16">
                            Intelli@Skool Mobile App &<br /> ERP Portal Guidelines
                        </h3>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Image
                            src="/assets/mobilephoto.png"
                            alt="Hero Image"
                            width={150}
                            height={200}
                            className="rounded-xl shadow-md"
                        />
                    </motion.div>
                </motion.div>

                {/* 🔹 Main Section */}
                <div className="lg:flex lg:flex-row lg:justify-between mt-2 relative items-start p-2">
                    {/* ===== LEFT CONTENT ===== */}
                    <div className="flex flex-col gap-10  px-4 lg:px-16 w-full lg:w-[65%]">
                        {/* 🧩 How to Install and Operate */}
                        <div ref={sections.install} className="border-l-2 lg:border-l-4 border-blue-600 bg-gray-50 rounded-md shadow-sm p-6 scroll-mt-32">
                            <p className="text-xl font-bold text-gray-500 mb-2">
                                How to Install and Operate Intelli@Skool Mobile App & Web Portal?
                            </p>
                            <hr className="border-blue-600 mb-4" />

                            <p className="text-gray-600 text-lg font-bold underline">Mobile App</p>
                            <ul className=" pl-5 text-gray-600 space-y-2 ">
                                <div className="flex flex-wrap gap-1"><p className="flex flex-row gap-2">1. Go to Google</p> <Image src="/assets/playstoreicon.png" width={20} height={20} alt="playstore" className="hidden sm:block sm:w-5 h-5  " /> <p>  Play Store/</p> <Image src="/assets/appleicon.webp" width={24} height={24} alt="playstore" className=" hidden sm:block sm:w-5 h-5 " /><p>Apple Store and search "intelli skool".</p></div>
                                <p>2. Install and Open the app.</p>
                                <p>3. Enter Institution/School URL shared by school.</p>
                                <p>4. Enter the username and password.</p>
                            </ul>

                            <p className="text-gray-600 text-lg font-bold underline mt-4">Web Portal</p>
                            <ul className="list-decimal pl-5 text-gray-600 space-y-2">
                                <p>1. Use Google Chrome or <span className="flex flex-row">Mozilla Firefox.</span></p>
                                <p>2. Visit the school website and click on the ERP Login button.</p>
                                <p>3. Enter credentials shared by the school.</p>
                                <p>4. Once logged in, you can explore all features.</p>
                            </ul>
                        </div>

                        {/* 🧩 Reset Password */}
                        <div ref={sections.reset} className="border-l-2 lg:border-l-4 border-blue-600 bg-gray-50 rounded-md shadow-sm p-6 scroll-mt-32">
                            <h3 className="text-xl font-bold text-gray-500 mb-2">How to RESET PASSWORD?</h3>
                            <hr className="border-blue-600 mb-4" />
                            <ul className="list-decimal pl-5 text-gray-600 space-y-2">
                                <li>Use Google Chrome or Mozilla Firefox.</li>
                                <li>Visit the school website and click “ERP Login”.</li>
                                <li>Click “Forgot password?” below the Login button.</li>
                            </ul>
                        </div>

                        {/* 🧩 Online Payment */}
                        <div ref={sections.payment} className="border-l-2 lg:border-l-4 border-blue-600 bg-gray-50 rounded-md shadow-sm p-6 scroll-mt-32">
                            <h3 className="text-xl font-bold text-gray-500 mb-2">
                                How to make Online Payment through Web Portal & Mobile App?
                            </h3>
                            <hr className="border-blue-600 mb-4" />

                            <p className="text-gray-600 font-semibold underline">Web Portal</p>
                            <ul className="list-decimal pl-5 text-gray-600 space-y-2">
                                <li>Use Google Chrome or Mozilla Firefox.</li>
                                <li>Visit the school website and click “ERP Login”.</li>
                                <li>Enter username and password shared by school.</li>
                                <li>Go to Fee menu → Online Fee Payment.</li>
                                <li>Select installment and click proceed.</li>
                                <li>Redirects to Payment Gateway.</li>
                                <li>Choose mode (Net Banking/Debit/Credit/UPI) and complete payment.</li>
                                <li>After success, fee receipt will be generated.</li>
                            </ul>

                            <p className="text-gray-600 font-semibold underline mt-4">Mobile App</p>
                            <ul className="list-decimal pl-5 text-gray-600 space-y-2">
                                <li>Open Intelli@Skool Mobile App.</li>
                                <li>Click Fee icon → Pay Now.</li>
                                <li>Select installment and proceed with payment.</li>
                                <li>Redirects to Payment Gateway.</li>
                                <li>Choose mode (Net Banking/Debit/Credit/UPI) and complete payment.</li>
                                <li>Fee receipt is generated automatically.</li>
                            </ul>
                        </div>

                        {/* 🧩 Assistance */}
                        <div ref={sections.assistance} className="border-l-2 lg:border-l-4 border-blue-600 bg-gray-50 rounded-md shadow-sm p-6 scroll-mt-32">
                            <h3 className="text-xl font-bold text-gray-500 mb-2">Please call or write for any Assistance</h3>
                            <hr className="border-blue-600 mb-4" />
                            <p>PARENT HELP DESK (8:30 AM to 5:30 PM)</p>
                            <p className=" mt-1"><span className="text-gray-600 font-bold text-lg">Tele No:</span> +91-7088909192</p>
                            <p><span className="text-gray-600 font-bold text-lg">Email:</span> info@sdt.net.in</p>
                        </div>

                        {/* 🧩 Explore Features */}
                        <div ref={sections.features} className="flex flex-col gap-2 border-l-2 lg:border-l-4 border-blue-600 bg-gray-50 rounded-md scroll-mt-32">
                            <h3 className="text-xl font-bold text-gray-500 mb-2 px-5">Explore  features of Intelli@Skool Mobile App</h3>
                            <hr className="border-blue-600 mb-4 ml-5" />
                            {misExploreFeature.map((feature, i) => (
                                <div key={i} className="px-4  py-2 bg-gray-50 rounded-md">
                                    <p className="font-bold text-gray-600 text-lg">{feature.title}</p>
                                    <p className="text-gray-700 text-base">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ===== RIGHT “SMART STICKY” SIDEBAR ===== */}
                    <div className="hidden lg:w-[450px] lg:flex lg:flex-col gap-3 sticky top-30 self-start mr-2  ">
                        {[
                            { key: 'install', title: "How to Install and Operate Intelli@Skool Mobile App & Web Portal?" },
                            { key: 'reset', title: "How to RESET PASSWORD?" },
                            { key: 'payment', title: "How to make Online Payment through Web Portal & Mobile App?" },
                            { key: 'assistance', title: "Please call or write for any Assistance" },
                            { key: 'features', title: "Explore features of Intelli@Skool Mobile App" },
                        ].map((item) => (
                            <div
                                key={item.key}
                                onClick={() => scrollToSection(item.key)}
                                className={`group flex items-center gap-3 border border-gray-200 rounded-md p-4 cursor-pointer shadow-sm transition-all duration-300 
                                ${active === item.key ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white'}`}
                            >
                                <span className={`w-6 h-6 flex items-center justify-center text-xs rounded-full font-bold transition-all duration-300 
                                    ${active === item.key ? 'bg-white text-blue-600' : 'bg-gray-400 text-white group-hover:bg-white group-hover:text-blue-600'}`}>
                                    ?
                                </span>
                                <p className="text-base leading-snug">{item.title}</p>
                            </div>
                        ))}

                        {/* App Store Buttons */}

                        <div className="flex flex-col items-start gap-3"

                        >
                            <p>Mobile App Available on</p>
                            <div className="flex flex-row gap-3 justify-center">
                                <Link href="https://play.google.com/store/apps/details?id=com.intelli.skool">
                                    <div className="flex items-center bg-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300">
                                        <Image src="/assets/playstoreicon.png" width={40} height={40} alt="playstore" />
                                        <div className="text-white ml-2">
                                            <p className="text-[10px] leading-tight">GET IT ON</p>
                                            <p className="font-semibold text-sm">Google Play</p>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex items-center bg-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300">
                                    <Image src="/assets/appleicon.webp" width={40} height={40} alt="appstore" />
                                    <div className="text-white ml-2">
                                        <p className="text-[10px] leading-tight">Download on the</p>
                                        <p className="font-semibold text-sm">App Store</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="mt-8 text-gray-300"></hr>

            <div className="flex justify-center items-center h-[100px] text-lg font-bold text-gray-500">
                @{new Date().getFullYear()} SDT Consultants | All Rights Reserved
            </div>
        </div>
    )
}
