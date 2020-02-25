<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreArmy extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'battle_id' => 'integer|min:1|exists:battles,id',
            'name' => 'required|string',
            'size' => 'required|numeric|min:80|max:100',
            'strategy' => 'required|string|in:' . join(',', config('constants.strategies')),
            'ordinal_number' => 'required|integer|min:1',
        ];
    }
}
