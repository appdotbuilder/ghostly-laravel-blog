import React from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface Post {
    id: number;
    title: string;
    slug: string;
    status: string;
    published_at: string | null;
    views_count: number;
    author: {
        name: string;
    };
    category: {
        name: string;
        color: string;
    } | null;
    created_at: string;
}

interface Props {
    posts: {
        data: Post[];
        links: Record<string, unknown>;
        meta: Record<string, unknown>;
    };
    authors?: Array<{ id: number; name: string }> | null;
    filters: {
        status?: string;
        author?: string;
        search?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Posts',
        href: '/posts',
    },
];

export default function PostIndex({ posts, authors, filters }: Props) {
    const handleFilter = (key: keyof typeof filters, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) delete newFilters[key];
        
        router.get('/posts', newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            published: 'bg-green-100 text-green-800',
            draft: 'bg-yellow-100 text-yellow-800',
            scheduled: 'bg-blue-100 text-blue-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts - Dashboard" />
            
            <div className="space-y-6 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📝 Posts</h1>
                        <p className="text-gray-600">Manage your blog posts</p>
                    </div>
                    <Link href="/posts/create">
                        <Button>✍️ New Post</Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-wrap gap-4">
                        <select 
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                            value={filters.status || ''}
                            onChange={(e) => handleFilter('status', e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                        </select>

                        {authors && (
                            <select 
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                                value={filters.author || ''}
                                onChange={(e) => handleFilter('author', e.target.value)}
                            >
                                <option value="">All Authors</option>
                                {authors.map((author) => (
                                    <option key={author.id} value={author.id}>
                                        {author.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-64"
                            value={filters.search || ''}
                            onChange={(e) => handleFilter('search', e.target.value)}
                        />
                    </div>
                </div>

                {/* Posts Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {posts.data.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No posts found</h3>
                            <p className="text-gray-600 mb-4">Get started by creating your first post</p>
                            <Link href="/posts/create">
                                <Button>✍️ Create Post</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-3 px-6 font-medium text-gray-900">Title</th>
                                        <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                                        <th className="text-left py-3 px-6 font-medium text-gray-900">Author</th>
                                        <th className="text-left py-3 px-6 font-medium text-gray-900">Category</th>
                                        <th className="text-left py-3 px-6 font-medium text-gray-900">Views</th>
                                        <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                                        <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {posts.data.map((post) => (
                                        <tr key={post.id} className="hover:bg-gray-50">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <Link 
                                                        href={`/posts/${post.id}`}
                                                        className="font-medium text-gray-900 hover:text-blue-600"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                    <div className="text-sm text-gray-500">
                                                        /{post.slug}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(post.status)}`}>
                                                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-900">
                                                {post.author.name}
                                            </td>
                                            <td className="py-4 px-6">
                                                {post.category ? (
                                                    <span 
                                                        className="inline-flex px-2 py-1 text-xs font-medium text-white rounded-full"
                                                        style={{ backgroundColor: post.category.color }}
                                                    >
                                                        {post.category.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">No category</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-900">
                                                👀 {post.views_count}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-900">
                                                {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/posts/${post.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    {post.status === 'published' && (
                                                        <Link href={`/post/${post.slug}`} target="_blank">
                                                            <Button variant="outline" size="sm">
                                                                View
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}