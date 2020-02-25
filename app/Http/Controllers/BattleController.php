<?php

namespace App\Http\Controllers;

use App\AttackLog;
use App\Battle;
use Illuminate\Http\Request;

class BattleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function index()
    {
        $battles = Battle::with(['armies'])->get();

        return $battles->map(function ($battle) {
            // Setting empty array for attack_logs so log get endpoint can be used
            $battle->attack_logs = [];
            return $battle;
        });
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
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function store(Request $request)
    {
        if (Battle::count() >= config('constants.MAX_BATTLE_COUNT')) {
            throw new \Exception('You can\'t have more than five battles.');
        }

        $battle = Battle::create();

        return $battle->loadMissing(['armies', 'attackLogs']);
    }

    /**
     * Display the specified resource.
     *
     * @param Battle $battle
     * @return \Illuminate\Http\Response
     */
    public function show(Battle $battle)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  Battle  $battle
     * @return \Illuminate\Http\Response
     */
    public function edit(Battle $battle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Battle  $battle
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Battle $battle)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Battle $battle
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Battle $battle)
    {
        $battle->delete();
    }

    /**
     * @param Battle $battle
     * @return mixed
     */
    public function getBattleLog(Battle $battle)
    {
        return $battle->attackLogs()->with(['attacker', 'defender'])->get();
    }

    /**
     * @param Battle $battle
     * @return Battle
     */
    public function reset(Battle $battle)
    {
        $battle->armies->each(function ($army) {
            $army->update([
                'current_size' => $army->size,
            ]);
        });
        AttackLog::whereBattleId($battle->id)->delete();

        return $battle->loadMissing(['armies', 'attackLogs']);
    }
}
