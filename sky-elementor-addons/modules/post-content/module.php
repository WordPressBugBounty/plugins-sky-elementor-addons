<?php

namespace Sky_Addons\Modules\PostContent;

use Sky_Addons\Base\Module_Base;
class Module extends Module_Base {

	public function __construct() {
		parent::__construct();

		add_action(
			'elementor/element/before_section_end',
			function( $section, $section_id, $args ) {
				if ( 'sky-post-content' === $section->get_name() && 'section_editor' === $section_id ) {
					$section->remove_control( 'editor' );
					$section->remove_control( 'drop_cap' );
				}
			}, 10, 3
		);
	}

	public function get_name() {
		return 'post-content';
	}

	public function get_widgets() {
		return [
			'Post_Content',
		];
	}
}
