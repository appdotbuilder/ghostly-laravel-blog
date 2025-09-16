<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isRegisteredUser = fake()->boolean(60);
        
        return [
            'post_id' => Post::factory(),
            'user_id' => $isRegisteredUser ? User::factory() : null,
            'author_name' => $isRegisteredUser ? null : fake()->name(),
            'author_email' => $isRegisteredUser ? null : fake()->safeEmail(),
            'content' => fake()->paragraphs(random_int(1, 3), true),
            'status' => fake()->randomElement(['approved', 'pending', 'rejected']),
        ];
    }

    /**
     * Indicate that the comment is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    /**
     * Indicate that the comment is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the comment is from a guest user.
     */
    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'author_name' => fake()->name(),
            'author_email' => fake()->safeEmail(),
        ]);
    }

    /**
     * Indicate that the comment is from a registered user.
     */
    public function registered(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => User::factory(),
            'author_name' => null,
            'author_email' => null,
        ]);
    }
}