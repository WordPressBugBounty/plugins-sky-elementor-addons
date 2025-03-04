<?php

namespace Sky_Addons\Modules\ImageCompare;

use Sky_Addons\Base\Module_Base;

class Module extends Module_Base {

	public function __construct() {
		parent::__construct();
	}

	public function get_name() {
		return 'image-compare';
	}

	public function get_widgets() {
		return [
			'Image_Compare',
		];
	}
}
