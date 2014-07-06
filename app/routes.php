<?php
Route::get('/', function()
{
	return View::make('index');
});
Route::get('/places/popular', 'PlacesController@popular');
Route::resource('/places', 'PlacesController');
Route::put('/places/{id}/vote', 'PlacesController@vote');