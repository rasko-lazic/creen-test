<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AttackLog extends Model
{

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'battle_id',
        'attacker_id',
        'defender_id',
        'damage',
        'created_at',
    ];

    public function attacker()
    {
        return $this->belongsTo('App\Army');
    }

    public function defender()
    {
        return $this->belongsTo('App\Army');
    }

    public function battle()
    {
        return $this->belongsTo('App\Battle');
    }
}
