<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display the blog homepage.
     */
    public function index(Request $request)
    {
        $query = Post::with(['author', 'category', 'tags'])
            ->published()
            ->latest('published_at');

        // Search functionality
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by tag
        if ($request->filled('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        $posts = $query->paginate(12);
        
        // Get featured posts (latest 3 with featured images)
        $featuredPosts = Post::with(['author', 'category'])
            ->published()
            ->whereNotNull('featured_image')
            ->latest('published_at')
            ->take(3)
            ->get();

        $categories = Category::withCount(['posts' => function ($query) {
            $query->published();
        }])->get();

        $tags = Tag::withCount(['posts' => function ($query) {
            $query->published();
        }])->orderBy('posts_count', 'desc')->take(20)->get();

        return Inertia::render('blog/index', [
            'posts' => $posts,
            'featuredPosts' => $featuredPosts,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => $request->only(['search', 'category', 'tag']),
        ]);
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post)
    {
        // Check if post is published or user can edit
        if ($post->status !== 'published' && (!auth()->check() || !auth()->user()->canEdit())) {
            abort(404);
        }

        $post->load(['author', 'category', 'tags', 'comments' => function ($query) {
            $query->approved()
                  ->with(['user', 'replies' => function ($q) {
                      $q->approved()->with('user');
                  }])
                  ->whereNull('parent_id')
                  ->latest();
        }]);

        // Increment views count
        $post->incrementViews();

        // Get related posts
        $relatedPosts = Post::with(['author', 'category'])
            ->published()
            ->where('id', '!=', $post->id)
            ->where(function ($query) use ($post) {
                $query->where('category_id', $post->category_id)
                      ->orWhereHas('tags', function ($q) use ($post) {
                          $q->whereIn('tags.id', $post->tags->pluck('id'));
                      });
            })
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('blog/show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }


}