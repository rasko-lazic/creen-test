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
        // If there are no attack logs, the battle hasn't started yet
        if ($battle->attackLogs->isEmpty()) {
            $ordinalNumber = $battle->armies()->count() + 1;
        } else {
            $ordinalNumber = 1;
            Army::whereBattleId($battle->id)->increment('ordinal_number');
        }

        return Army::create(array_merge(
            $data,
            [
                'current_size' => $request->input('size'),
                'ordinal_number' => $ordinalNumber,
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
        if (count($army->battle->armies) < 5) {
            throw new \Exception('You need at least 5 armies to start a battle.');
        }

        $damage = 0;
        $defender = $army->getDefender();

        // Condition is basic simulation of probability where one alive unit equals one percentage chance of attack
        if (mt_rand(1, 100) <= $army->current_size) {
            $damage = $army->current_size === 1 ? 1 : $army->current_size * 0.5;
            $defenderCurrentSize = $defender->current_size - floor($damage);
            $defender->update([
                'current_size' => $defenderCurrentSize >= 0 ? $defenderCurrentSize : 0,
            ]);
        }

        return AttackLog::create([
            'battle_id' => $army->battle_id,
            'attacker_id' => $army->id,
            'defender_id' => $defender->id,
            'damage' => $damage,
            'created_at' => floor(microtime(true) * 1000),
        ]);
    }
}
