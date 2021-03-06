<?php

namespace App\Http\Controllers;

use App\Army;
use App\AttackLog;
use App\Battle;
use App\Http\Requests\StoreArmy;
use Illuminate\Http\Request;

class ArmyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreArmy $request
     * @return void
     */
    public function store(StoreArmy $request)
    {
        $data = $request->validated();
        $battle = Battle::find($data['battle_id']);
        // Make space for new army
        Army::whereBattleId($battle->id)
            ->where('ordinal_number', '>=', $data['ordinal_number'])
            ->increment('ordinal_number');

        return Army::create(array_merge(
            $data,
            [
                'size' => (int) $request->input('size'),
                'current_size' => (int) $request->input('size'),
            ]
        ));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * @param Army $army
     * @return AttackLog
     * @throws \Exception
     */
    public function attack(Army $army)
    {
        if (count($army->battle->armies) < config('constants.MIN_ARMY_COUNT_FOR_BATTLE')) {
            throw new \Exception('You need at least 5 armies to start a battle.');
        }

        $damage = 0;
        $defender = $army->getDefender();

        // Condition is basic simulation of probability where one alive unit equals one percentage chance of attack
        if (mt_rand(1, 100) <= $army->current_size) {
            $damage = max(
                config('constants.MIN_ARMY_DAMAGE'),
                $army->current_size * config('constants.ARMY_DAMAGE_PER_UNIT')
            );
            $defenderCurrentSize = $defender->current_size - floor($damage);
            $defender->update([
                'current_size' => $defenderCurrentSize < 0 ? 0 : $defenderCurrentSize,
            ]);
        }

        $attackLog = AttackLog::create([
            'battle_id' => $army->battle_id,
            'attacker_id' => $army->id,
            'defender_id' => $defender->id,
            'damage' => $damage,
            'attacker_victorious' => $army->battle->armies()->where('current_size', '>', 0)->count() === 1,
            'defender_defeated' => $defender->current_size === 0,
            'created_at' => floor(microtime(true) * 1000),
        ]);

        return $attackLog->loadMissing(['attacker', 'defender']);
    }
}
