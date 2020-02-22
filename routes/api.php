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

Route::group(['prefix' => 'battles', 'middleware' => 'cors'], function () {
    Route::get('/', 'BattleController@index');
    Route::get('/{battle}', 'BattleController@show');
    Route::get('/{battle}', 'BattleController@getBattleLog');
    Route::post('/', 'BattleController@store');
    Route::put('/{battle}/reset', 'BattleController@reset');
});

Route::group(['prefix' => 'armies', 'middleware' => 'cors'], function () {
    Route::post('/', 'ArmyController@store');
    Route::put('/{army}/attack', 'ArmyController@store');
});
