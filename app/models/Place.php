<?php
class Place extends Eloquent {
	protected $table = 'places';
	protected $guarded = array();

	public function scopePopular($query) {
		return $query->orderBy('votes', 'DESC');
	}
}
