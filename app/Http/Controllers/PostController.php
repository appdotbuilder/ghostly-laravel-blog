<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Post::with(['author', 'category', 'tags'])->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by author (only for editors/admins)
        if ($request->filled('author') && auth()->user()->canEdit()) {
            $query->where('author_id', $request->author);
        } elseif (!auth()->user()->canEdit()) {
            // Authors can only see their own posts
            $query->where('author_id', auth()->id());
        }

        // Search functionality
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $posts = $query->paginate(15);

        $authors = auth()->user()->canEdit() 
            ? \App\Models\User::select('id', 'name')->get()
            : null;

        return Inertia::render('dashboard/posts/index', [
            'posts' => $posts,
            'authors' => $authors,
            'filters' => $request->only(['status', 'author', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::select('id', 'name', 'color')->get();
        $tags = Tag::select('id', 'name', 'color')->get();

        return Inertia::render('dashboard/posts/create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();
        $validated['author_id'] = auth()->id();

        // Handle status-specific logic
        if ($validated['status'] === 'published' && !$validated['published_at']) {
            $validated['published_at'] = now();
        }

        $post = Post::create($validated);

        // Attach tags if provided
        if (isset($validated['tags'])) {
            $post->tags()->sync($validated['tags']);
        }

        return redirect()->route('posts.show', $post)
            ->with('success', 'Post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        // Check authorization
        if (!auth()->user()->canEdit() && $post->author_id !== auth()->id()) {
            abort(403);
        }

        $post->load(['author', 'category', 'tags', 'versions']);

        return Inertia::render('dashboard/posts/show', [
            'post' => $post,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        // Check authorization
        if (!auth()->user()->canEdit() && $post->author_id !== auth()->id()) {
            abort(403);
        }

        $post->load(['tags']);
        $categories = Category::select('id', 'name', 'color')->get();
        $tags = Tag::select('id', 'name', 'color')->get();

        return Inertia::render('dashboard/posts/edit', [
            'post' => $post,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        // Check authorization
        if (!auth()->user()->canEdit() && $post->author_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validated();

        // Handle status-specific logic
        if ($validated['status'] === 'published' && $post->status !== 'published' && !$validated['published_at']) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        // Attach tags if provided
        if (isset($validated['tags'])) {
            $post->tags()->sync($validated['tags']);
        }

        return redirect()->route('posts.show', $post)
            ->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        // Check authorization
        if (!auth()->user()->canEdit() && $post->author_id !== auth()->id()) {
            abort(403);
        }

        $post->delete();

        return redirect()->route('posts.index')
            ->with('success', 'Post deleted successfully.');
    }
}