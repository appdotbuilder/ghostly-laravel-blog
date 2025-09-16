<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(random_int(4, 8));
        $publishedAt = fake()->boolean(70) ? fake()->dateTimeBetween('-6 months', 'now') : null;
        
        return [
            'title' => rtrim($title, '.'),
            'slug' => Str::slug($title),
            'excerpt' => fake()->paragraph(),
            'content' => fake()->paragraphs(random_int(5, 15), true),
            'featured_image' => fake()->boolean(60) ? fake()->imageUrl(800, 400, 'business') : null,
            'status' => $publishedAt ? 'published' : fake()->randomElement(['draft', 'published']),
            'published_at' => $publishedAt,
            'author_id' => User::factory(),
            'category_id' => fake()->boolean(80) ? Category::factory() : null,
            'version' => 1,
            'views_count' => fake()->numberBetween(0, 1000),
            'meta_data' => [
                'seo_title' => fake()->sentence(),
                'seo_description' => fake()->text(160),
                'canonical_url' => null,
            ],
        ];
    }

    /**
     * Indicate that the post is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ]);
    }

    /**
     * Indicate that the post is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the post is scheduled.
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'scheduled_at' => fake()->dateTimeBetween('now', '+1 month'),
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the post is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'featured_image' => fake()->imageUrl(800, 400, 'business'),
        ]);
    }
}