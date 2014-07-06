<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Places extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('places', function($t)
		{
			$t->increments('id');
			$t->text('name');
			$t->text('improvement');
			$t->text('description');
			$t->date('updated_at');
			$t->date('created_at');
			$t->integer('votes');
			$t->text('latlng');
			$t->booleab('denied')->default(false);
			$t->booleab('moderated')->default(false);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//
	}

}
