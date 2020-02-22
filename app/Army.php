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
        switch ($this->strategy) {
            case 'Random':
                return $this->batle->armies()->random();
            case 'Weakest':
                return $this->batle->armies()->orderBy('current_size')->first();
            case 'Strongest':
                return $this->batle->armies()->orderBy('current_size', 'desc')->first();
        }
    }
}
