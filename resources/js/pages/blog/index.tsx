import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    published_at: string;
    reading_time: number;
    views_count: number;
    author: {
        id: number;
        name: string;
        avatar: string | null;
    };
    category: {
        id: number;
        name: string;
        slug: string;
        color: string;
    } | null;
    tags: Array<{
        id: number;
        name: string;
        slug: string;
        color: string;
    }>;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
    posts_count: number;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
    color: string;
    posts_count: number;
}

interface Props {
    posts: {
        data: Post[];
        links: Record<string, unknown>;
        meta: Record<string, unknown>;
    };
    featuredPosts: Post[];
    categories: Category[];
    tags: Tag[];
    filters: {
        search?: string;
        category?: string;
        tag?: string;
    };
    [key: string]: unknown;
}

export default function BlogIndex({ posts, featuredPosts, categories, tags, filters }: Props) {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        
        router.get('/blog', { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="Ghost Blog - Discover Amazing Stories" />
            
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    👻 Ghost Blog
                                </h1>
                            </div>
                            <nav className="hidden md:flex space-x-8">
                                <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                                    Blog
                                </Link>
                                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                                    Dashboard
                                </Link>
                                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">
                                    Register
                                </Link>
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="bg-gray-50 py-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            📚 Discover Amazing Stories
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            A modern blogging platform inspired by Ghost.org. Write, publish, and share your stories with the world.
                        </p>
                        
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
                            <Input 
                                name="search"
                                placeholder="Search articles..."
                                defaultValue={filters.search || ''}
                                className="flex-1"
                            />
                            <Button type="submit">🔍 Search</Button>
                        </form>
                    </div>
                </section>

                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                    <section className="py-16">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">⭐ Featured Posts</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                {featuredPosts.map((post) => (
                                    <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        {post.featured_image && (
                                            <img 
                                                src={post.featured_image} 
                                                alt={post.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        <div className="p-6">
                                            {post.category && (
                                                <span 
                                                    className="inline-block px-2 py-1 text-xs font-medium text-white rounded-full mb-3"
                                                    style={{ backgroundColor: post.category.color }}
                                                >
                                                    {post.category.name}
                                                </span>
                                            )}
                                            <h4 className="text-lg font-bold text-gray-900 mb-2">
                                                <Link 
                                                    href={`/post/${post.slug}`}
                                                    className="hover:text-blue-600"
                                                >
                                                    {post.title}
                                                </Link>
                                            </h4>
                                            <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span>{post.author.name}</span>
                                                <span className="mx-2">•</span>
                                                <span>{formatDate(post.published_at)}</span>
                                                <span className="mx-2">•</span>
                                                <span>📖 {post.reading_time} min read</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">📖 Latest Posts</h3>
                            
                            {posts.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📝</div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h4>
                                    <p className="text-gray-600">Check back soon for amazing content!</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {posts.data.map((post) => (
                                        <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="md:flex">
                                                {post.featured_image && (
                                                    <div className="md:w-1/3">
                                                        <img 
                                                            src={post.featured_image} 
                                                            alt={post.title}
                                                            className="w-full h-48 md:h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-6 flex-1">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        {post.category && (
                                                            <span 
                                                                className="inline-block px-2 py-1 text-xs font-medium text-white rounded-full"
                                                                style={{ backgroundColor: post.category.color }}
                                                            >
                                                                {post.category.name}
                                                            </span>
                                                        )}
                                                        {post.tags.slice(0, 2).map((tag) => (
                                                            <span 
                                                                key={tag.id}
                                                                className="inline-block px-2 py-1 text-xs font-medium text-white rounded-full"
                                                                style={{ backgroundColor: tag.color }}
                                                            >
                                                                #{tag.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                                                        <Link 
                                                            href={`/post/${post.slug}`}
                                                            className="hover:text-blue-600"
                                                        >
                                                            {post.title}
                                                        </Link>
                                                    </h4>
                                                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <span>{post.author.name}</span>
                                                            <span className="mx-2">•</span>
                                                            <span>{formatDate(post.published_at)}</span>
                                                            <span className="mx-2">•</span>
                                                            <span>📖 {post.reading_time} min</span>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <span>👀 {post.views_count}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Categories */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">📁 Categories</h4>
                                <div className="space-y-2">
                                    {categories.slice(0, 8).map((category) => (
                                        <div
                                            key={category.id}
                                            className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span 
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                ></span>
                                                {category.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {category.posts_count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Tags */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">🏷️ Popular Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {tags.slice(0, 15).map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="inline-block px-3 py-1 text-sm font-medium text-white rounded-full cursor-pointer hover:opacity-80"
                                            style={{ backgroundColor: tag.color }}
                                        >
                                            #{tag.name} ({tag.posts_count})
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
                                <h4 className="text-lg font-bold mb-2">✍️ Start Writing</h4>
                                <p className="text-blue-100 mb-4 text-sm">
                                    Share your stories with the world
                                </p>
                                <Link href="/register">
                                    <Button variant="secondary" size="sm">
                                        Join Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-4">👻 Ghost Blog</h3>
                            <p className="text-gray-400 mb-4">
                                A modern blogging platform for creators and storytellers
                            </p>
                        </div>
                        <div className="border-t border-gray-800 pt-8">
                            <p className="text-gray-400 text-sm">
                                © 2024 Ghost Blog. Built with Laravel & Inertia.js
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}