<?php

class PlacesController extends \BaseController {

	public function index() {
		$order = Input::get('order');
		if (!$order) {
			$order = 'created_at';
		}
		$asc = strpos($order, '-') !== false ? 'desc':'asc';
		$order = str_replace('-', '', $order);
		return Response::json(Place::orderBy($order, $asc)->get());
	}

	public function show($id) {
		return Response::json(Place::find($id));
	}

	public function store()
	{
		$place = new Place(Input::only('name', 'improvement', 'description', 'latlng'));
		if ($place->save()) {
			return Response::json($place);
		}
		return Response::json('Something went wrong', 500);
	}

	public function vote($id) {
		$place = Place::find($id);
		$place->votes++;
		if ($place->save()) {
			return Response::json($place);
		}
		return Response::json('Something went wrong', 500);
	}

	public function popular() {
		return Response::json(Place::popular()->get());
	}
}
