<?php

class PlacesController extends \BaseController {

	public function index() {
		return Response::json(Place::orderBy('created_at', 'desc')->get());
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
