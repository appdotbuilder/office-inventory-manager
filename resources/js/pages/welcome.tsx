import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Office Inventory Management">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:from-gray-900 dark:to-gray-800 dark:text-white">
                <header className="mb-6 w-full max-w-[335px] text-sm lg:max-w-6xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('inventory.index')}
                                className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                            >
                                Go to Inventory
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow">
                    <main className="flex w-full max-w-6xl flex-col">
                        {/* Hero Section */}
                        <div className="text-center mb-16">
                            <div className="mb-6">
                                <span className="text-6xl">📦</span>
                            </div>
                            <h1 className="mb-6 text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Office Inventory Management
                            </h1>
                            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                Take control of your office assets with our modern inventory management system. 
                                Track PCs, printers, monitors, and more with powerful role-based access controls.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            <div className="bg-white rounded-xl p-8 shadow-lg dark:bg-gray-800 transition-all hover:shadow-xl hover:scale-105">
                                <div className="text-4xl mb-4">💻</div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Complete Asset Tracking</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Track every detail: barcode, serial number, location, purchase info, and custom fields for each item.
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-xl p-8 shadow-lg dark:bg-gray-800 transition-all hover:shadow-xl hover:scale-105">
                                <div className="text-4xl mb-4">👥</div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Role-Based Access</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Three user levels: Users can add items, Operators can modify, and Admins have full control.
                                </p>
                            </div>
                            
                            <div className="bg-white rounded-xl p-8 shadow-lg dark:bg-gray-800 transition-all hover:shadow-xl hover:scale-105">
                                <div className="text-4xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Excel Export</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Export your complete inventory data to Excel with advanced filtering and search capabilities.
                                </p>
                            </div>
                        </div>

                        {/* Feature Highlights */}
                        <div className="bg-white rounded-2xl p-8 shadow-xl dark:bg-gray-800 mb-16">
                            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Everything You Need</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-green-500 text-xl">✅</span>
                                        <span className="text-gray-700 dark:text-gray-300">Barcode & serial number tracking</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-green-500 text-xl">✅</span>
                                        <span className="text-gray-700 dark:text-gray-300">Custom item types (PC, Printer, Monitor, etc.)</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-green-500 text-xl">✅</span>
                                        <span className="text-gray-700 dark:text-gray-300">Location-based organization</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-green-500 text-xl">✅</span>
                                        <span className="text-gray-700 dark:text-gray-300">Purchase tracking with dates & prices</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-green-500 text-xl">✅</span>
                                        <span className="text-gray-700 dark:text-gray-300">Custom fields for additional data</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-green-500 text-xl">✅</span>
                                        <span className="text-gray-700 dark:text-gray-300">Status tracking (Active, Maintenance, Retired)</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-green-500 text-xl">✅</span>
                                        <span className="text-gray-700 dark:text-gray-300">Advanced search & filtering</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-green-500 text-xl">✅</span>
                                        <span className="text-gray-700 dark:text-gray-300">Comprehensive Excel reporting</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="text-center">
                            {!auth.user && (
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                                        Ready to organize your office inventory?
                                    </h2>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                        <Link
                                            href={route('register')}
                                            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl transform hover:scale-105"
                                        >
                                            🚀 Start Managing Inventory
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-block rounded-lg border-2 border-blue-600 px-8 py-3 text-lg font-semibold text-blue-600 transition-all hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400"
                                        >
                                            Sign In
                                        </Link>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                                        Demo accounts: admin@example.com, operator@example.com, user@example.com (password: password)
                                    </p>
                                </div>
                            )}
                        </div>

                        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
                            Built with ❤️ by{" "}
                            <a 
                                href="https://app.build" 
                                target="_blank" 
                                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                            >
                                app.build
                            </a>
                        </footer>
                    </main>
                </div>
            </div>
        </>
    );
}