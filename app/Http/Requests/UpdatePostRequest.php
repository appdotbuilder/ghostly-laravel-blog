<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $postId = $this->route('post')->id;

        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:posts,slug,' . $postId,
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|url',
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
            'scheduled_at' => 'nullable|date|after:now',
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'meta_data' => 'nullable|array',
            'meta_data.seo_title' => 'nullable|string|max:60',
            'meta_data.seo_description' => 'nullable|string|max:160',
            'meta_data.canonical_url' => 'nullable|url',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Post title is required.',
            'slug.required' => 'Post slug is required.',
            'slug.unique' => 'This slug is already taken by another post.',
            'content.required' => 'Post content is required.',
            'status.required' => 'Post status is required.',
            'status.in' => 'Invalid post status.',
            'scheduled_at.after' => 'Scheduled date must be in the future.',
            'category_id.exists' => 'Selected category does not exist.',
            'tags.*.exists' => 'One or more selected tags do not exist.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->slug) {
            $this->merge([
                'slug' => str($this->slug)->slug(),
            ]);
        }
    }
}