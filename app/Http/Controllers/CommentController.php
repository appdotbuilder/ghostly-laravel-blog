<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Comment::with(['post', 'user'])->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->filled('search')) {
            $query->where('content', 'like', "%{$request->search}%");
        }

        $comments = $query->paginate(15);

        return Inertia::render('dashboard/comments/index', [
            'comments' => $comments,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommentRequest $request, Post $post)
    {
        $validated = $request->validated();
        $validated['post_id'] = $post->id;
        $validated['user_id'] = auth()->id();

        Comment::create($validated);

        return redirect()->back()
            ->with('success', 'Comment posted successfully and is pending approval.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        $comment->load(['post', 'user', 'parent', 'replies.user']);

        return Inertia::render('dashboard/comments/show', [
            'comment' => $comment,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $comment->update($request->only('status'));

        return redirect()->back()
            ->with('success', 'Comment status updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        $comment->delete();

        return redirect()->route('comments.index')
            ->with('success', 'Comment deleted successfully.');
    }
}