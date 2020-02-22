<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArmiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('armies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('battle_id')->unsigned();
            $table->text('name');
            $table->integer('size');
            $table->integer('current_size');
            $table->integer('ordinal_number');
            $table->enum('strategy', ['Random', 'Weakest', 'Strongest']);
            $table->timestamps();

            $table->foreign('battle_id')
                ->references('id')
                ->on('battles')
                ->onUpdate('cascade')
                ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('armies', function (Blueprint $table) {
            $table->dropForeign(['battle_id']);
        });
        Schema::dropIfExists('armies');
    }
}
