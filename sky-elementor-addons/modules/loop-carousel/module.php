<?php

namespace Sky_Addons\Modules\LoopCarousel;

use Sky_Addons\Base\Module_Base;

class Module extends Module_Base {

	public function __construct() {
		parent::__construct();
	}

	public function get_name() {
		return 'loop-carousel';
	}

	public function get_widgets() {
		return [
			'Loop_Carousel',
		];
	}
}
