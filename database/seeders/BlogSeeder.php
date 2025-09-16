<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create users with specific roles
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@blog.test',
            'bio' => 'Blog administrator and content manager.',
        ]);

        $editor = User::factory()->editor()->create([
            'name' => 'Editor User',
            'email' => 'editor@blog.test',
            'bio' => 'Content editor and publisher.',
        ]);

        $author = User::factory()->author()->create([
            'name' => 'Author User',
            'email' => 'author@blog.test',
            'bio' => 'Passionate writer and content creator.',
        ]);

        // Create additional users
        $authors = User::factory()->author()->count(3)->create();
        $editors = User::factory()->editor()->count(2)->create();

        // Create categories
        $techCategory = Category::factory()->create([
            'name' => 'Technology',
            'slug' => 'technology',
            'description' => 'Latest tech news and insights',
            'color' => '#3b82f6',
        ]);

        $businessCategory = Category::factory()->create([
            'name' => 'Business',
            'slug' => 'business',
            'description' => 'Business strategies and insights',
            'color' => '#10b981',
        ]);

        $lifestyleCategory = Category::factory()->create([
            'name' => 'Lifestyle',
            'slug' => 'lifestyle',
            'description' => 'Lifestyle and personal development',
            'color' => '#f59e0b',
        ]);

        $categories = collect([$techCategory, $businessCategory, $lifestyleCategory])
            ->merge(Category::factory()->count(2)->create());

        // Create tags
        $tags = collect([
            ['name' => 'JavaScript', 'slug' => 'javascript'],
            ['name' => 'Laravel', 'slug' => 'laravel'],
            ['name' => 'React', 'slug' => 'react'],
            ['name' => 'Vue.js', 'slug' => 'vuejs'],
            ['name' => 'PHP', 'slug' => 'php'],
            ['name' => 'Python', 'slug' => 'python'],
            ['name' => 'Marketing', 'slug' => 'marketing'],
            ['name' => 'Design', 'slug' => 'design'],
            ['name' => 'Productivity', 'slug' => 'productivity'],
            ['name' => 'Health', 'slug' => 'health'],
        ])->map(function ($tagData) {
            return Tag::factory()->create($tagData);
        });

        // Add more random tags
        $tags = $tags->merge(Tag::factory()->count(5)->create());

        // Create posts with various statuses
        $allUsers = collect([$admin, $editor, $author])->merge($authors)->merge($editors);

        // Published posts
        $publishedPosts = Post::factory()
            ->published()
            ->count(25)
            ->create([
                'author_id' => fn() => $allUsers->random()->id,
                'category_id' => fn() => $categories->random()->id,
            ]);

        // Draft posts
        Post::factory()
            ->draft()
            ->count(8)
            ->create([
                'author_id' => fn() => $allUsers->random()->id,
                'category_id' => fn() => $categories->random()->id,
            ]);

        // Scheduled posts
        Post::factory()
            ->scheduled()
            ->count(3)
            ->create([
                'author_id' => fn() => $allUsers->random()->id,
                'category_id' => fn() => $categories->random()->id,
            ]);

        // Attach tags to posts
        $allPosts = Post::all();
        $allPosts->each(function ($post) use ($tags) {
            $post->tags()->attach(
                $tags->random(random_int(1, 4))->pluck('id')->toArray()
            );
        });

        // Create comments for published posts
        $publishedPosts->each(function ($post) use ($allUsers) {
            $commentCount = random_int(0, 8);
            
            if ($commentCount > 0) {
                $comments = Comment::factory()
                    ->count($commentCount)
                    ->create([
                        'post_id' => $post->id,
                        'user_id' => fn() => fake()->boolean(70) ? $allUsers->random()->id : null,
                    ]);

                // Create some replies
                $comments->take(random_int(0, 3))->each(function ($comment) use ($allUsers) {
                    Comment::factory()
                        ->count(random_int(1, 2))
                        ->create([
                            'post_id' => $comment->post_id,
                            'parent_id' => $comment->id,
                            'user_id' => fn() => fake()->boolean(70) ? $allUsers->random()->id : null,
                        ]);
                });
            }
        });

        // Create some post versions
        $publishedPosts->take(3)->each(function ($originalPost) {
            Post::factory()->create([
                'title' => $originalPost->title . ' (Version 2)',
                'slug' => $originalPost->slug . '-v2',
                'content' => $originalPost->content . "\n\nUpdated content for version 2.",
                'author_id' => $originalPost->author_id,
                'category_id' => $originalPost->category_id,
                'status' => 'draft',
                'parent_id' => $originalPost->id,
                'version' => 2,
            ]);
        });
    }
}