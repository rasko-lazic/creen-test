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
        $query = $this->battle->armies()->where('id', '<>', $this->id);

        switch ($this->strategy) {
            case 'Random':
                return $query->get()->random();
            case 'Weakest':
                return $query->orderBy('current_size')->first();
            case 'Strongest':
                return $query->orderBy('current_size', 'desc')->first();
        }
    }
}
