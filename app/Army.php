<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Army extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'battle_id',
        'name',
        'size',
        'current_size',
        'strategy',
        'ordinal_number',
        'created_at',
        'updated_at',
    ];

    public function battle()
    {
        return $this->belongsTo('App\Battle');
    }

    /**
     * @return Army
     */
    public function getDefender()
    {
        // Army can't attack itself or defeated armies
        $query = $this->battle->armies()
            ->where('id', '<>', $this->id)
            ->where('current_size', '>', 0);

        // If there are multiple armies with min/max size, get them all and draw defender by random
        switch ($this->strategy) {
            case config('constants.strategies.WEAKEST'):
                $query = $query->where('current_size', $query->min('current_size'));
                break;
            case config('constants.strategies.STRONGEST'):
                $query = $query->where('current_size', $query->max('current_size'));
        }

        return $query->get()->random();
    }
}
