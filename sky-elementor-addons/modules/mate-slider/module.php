<?php

namespace Sky_Addons\Modules\MateSlider;

use Sky_Addons\Base\Module_Base;

class Module extends Module_Base {

	public function __construct() {
		parent::__construct();
	}

	public function get_name() {
		return 'mate-slider';
	}

	public function get_widgets() {
		return [
			'Mate_Slider',
		];
	}
}
