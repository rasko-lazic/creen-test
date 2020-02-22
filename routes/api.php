<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'battles'], function () {
    Route::get('/', 'BattleController@index');
    Route::get('/{battle}', 'BattleController@show');
    Route::get('/{battle}', 'BattleController@getBattleLog');
    Route::post('/', 'BattleController@store');
    Route::put('/{battle}/reset', 'BattleController@reset');
    Route::delete('/{battle}', 'BattleController@destroy');
});

Route::group(['prefix' => 'armies'], function () {
    Route::post('/', 'ArmyController@store');
    Route::put('/{army}/attack', 'ArmyController@attack');
});
