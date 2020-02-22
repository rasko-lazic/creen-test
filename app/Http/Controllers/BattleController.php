<?php

namespace App\Http\Controllers;

use App\Battle;
use Illuminate\Http\Request;

class BattleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Battle::with('armies')->get();
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return Battle::create();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\BattleController  $battle
     * @return \Illuminate\Http\Response
     */
    public function show(Battle $battle)
    {
        return $battle->loadMissing('armies');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Battle  $battle
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
     * @param  \App\Battle  $battle
     * @return \Illuminate\Http\Response
     */
    public function destroy(Battle $battle)
    {
        //
    }

    /**
     * @param Battle $battle
     * @return mixed
     */
    public function getBattleLog(Battle $battle)
    {
        return $battle->attackLogs;
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

        return $battle;
    }
}
