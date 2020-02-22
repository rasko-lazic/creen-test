<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttackLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attack_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('battle_id')->unsigned();
            $table->bigInteger('attacker_id')->unsigned();
            $table->bigInteger('defender_id')->unsigned();
            $table->decimal('damage', 3, 2);
            $table->bigInteger('created_at');

            $table->foreign('battle_id')
                ->references('id')
                ->on('battles')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('attacker_id')
                ->references('id')
                ->on('armies')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('defender_id')
                ->references('id')
                ->on('armies')
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
        Schema::table('attack_logs', function (Blueprint $table) {
            $table->dropForeign(['battle_id']);
            $table->dropForeign(['attacker_id']);
            $table->dropForeign(['defender_id']);
        });
        Schema::dropIfExists('attack_logs');
    }
}
