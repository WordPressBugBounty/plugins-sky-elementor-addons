<?php

namespace Sky_Addons\Modules\LusterGrid;

use Sky_Addons\Base\Module_Base;

class Module extends Module_Base {


	public function __construct() {
		parent::__construct();
	}

	public function get_name() {
		return 'luster-grid';
	}

	public function get_widgets() {
		return [
			'Luster_Grid',
		];
	}
}
