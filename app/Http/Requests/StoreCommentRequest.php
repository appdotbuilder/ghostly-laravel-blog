<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
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
        $rules = [
            'content' => 'required|string|max:2000',
            'parent_id' => 'nullable|exists:comments,id',
        ];

        // If user is not authenticated, require name and email
        if (!auth()->check()) {
            $rules['author_name'] = 'required|string|max:255';
            $rules['author_email'] = 'required|email|max:255';
        }

        return $rules;
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'content.required' => 'Comment content is required.',
            'content.max' => 'Comment cannot exceed 2000 characters.',
            'author_name.required' => 'Your name is required.',
            'author_email.required' => 'Your email is required.',
            'author_email.email' => 'Please provide a valid email address.',
            'parent_id.exists' => 'Parent comment does not exist.',
        ];
    }
}