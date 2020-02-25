<?php

return [

    'strategies' => [
        'RANDOM' => 'Random',
        'WEAKEST' => 'Weakest',
        'STRONGEST' => 'Strongest',
    ],

    'MAX_BATTLE_COUNT' => env('MAX_BATTLE_COUNT', 5),

    'MIN_ARMY_COUNT_FOR_BATTLE' => 5,
    'ARMY_DAMAGE_PER_UNIT' => 0.5,
    'MIN_ARMY_DAMAGE' => 1,

];
