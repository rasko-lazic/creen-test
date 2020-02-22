<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Battle extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'created_at',
        'updated_at',
    ];

    public function armies()
    {
        return $this->hasMany('App\Army')->orderBy('ordinal_number');
    }

    public function attackLogs()
    {
        return $this->hasMany('App\AttackLog');
    }
}
