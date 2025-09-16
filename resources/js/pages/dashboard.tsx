import React from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface SharedData {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Ghost Blog" />
            
            <div className="space-y-8 p-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">📊 Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Welcome back, {auth.user.name}! Manage your blog content below.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <span className="text-2xl">📝</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Posts</p>
                                <p className="text-2xl font-bold text-gray-900">--</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Published</p>
                                <p className="text-2xl font-bold text-gray-900">--</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <span className="text-2xl">📁</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">--</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <span className="text-2xl">💬</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Comments</p>
                                <p className="text-2xl font-bold text-gray-900">--</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">✨ Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/posts/create">
                            <Button className="w-full justify-start">
                                ✍️ Write New Post
                            </Button>
                        </Link>
                        <Link href="/posts">
                            <Button variant="outline" className="w-full justify-start">
                                📚 Manage Posts
                            </Button>
                        </Link>
                        <Link href="/categories">
                            <Button variant="outline" className="w-full justify-start">
                                📁 Manage Categories
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content Management */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">📖 Content</h3>
                        <div className="space-y-2">
                            <Link 
                                href="/posts" 
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                            >
                                <span className="flex items-center gap-2">
                                    <span>📝</span>
                                    Posts
                                </span>
                                <span className="text-sm text-gray-500">→</span>
                            </Link>
                            <Link 
                                href="/categories" 
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                            >
                                <span className="flex items-center gap-2">
                                    <span>📁</span>
                                    Categories
                                </span>
                                <span className="text-sm text-gray-500">→</span>
                            </Link>
                            <Link 
                                href="/tags" 
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                            >
                                <span className="flex items-center gap-2">
                                    <span>🏷️</span>
                                    Tags
                                </span>
                                <span className="text-sm text-gray-500">→</span>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">👥 Community</h3>
                        <div className="space-y-2">
                            <Link 
                                href="/comments" 
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                            >
                                <span className="flex items-center gap-2">
                                    <span>💬</span>
                                    Comments
                                </span>
                                <span className="text-sm text-gray-500">→</span>
                            </Link>
                            <Link 
                                href="/blog" 
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                            >
                                <span className="flex items-center gap-2">
                                    <span>🌐</span>
                                    View Blog
                                </span>
                                <span className="text-sm text-gray-500">→</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Role-specific Features */}
                {(auth.user.role === 'editor' || auth.user.role === 'admin') && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">🛡️ Editor Features</h3>
                        <p className="text-gray-600 mb-4">
                            As an {auth.user.role}, you have additional permissions to manage all content and users.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                ✅ Edit All Posts
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                ✅ Approve Comments
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                ✅ Manage Categories & Tags
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}