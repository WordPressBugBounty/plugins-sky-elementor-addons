<?php

namespace Sky_Addons\Includes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class WPML_Loop_Grid
 */
class WPML_Loop_Grid extends WPML_Module_Without_Items {
	public function get_name() {
		return 'sky-loop-grid'; }
	public function get_fields() {
		return [
			'section_title' => [
				'title'       => esc_html__( 'Loop Grid: Section Title', 'sky-elementor-addons' ),
				'editor_type' => 'LINE',
			],
			'section_subtitle' => [
				'title'       => esc_html__( 'Loop Grid: Section Subtitle', 'sky-elementor-addons' ),
				'editor_type' => 'LINE',
			],
			'view_all_text' => [
				'title'       => esc_html__( 'Loop Grid: View All Text', 'sky-elementor-addons' ),
				'editor_type' => 'LINE',
			],
			'load_more_text' => [
				'title'       => esc_html__( 'Loop Grid: Load More Text', 'sky-elementor-addons' ),
				'editor_type' => 'LINE',
			],
			'no_posts_text' => [
				'title'       => esc_html__( 'Loop Grid: No Posts Text', 'sky-elementor-addons' ),
				'editor_type' => 'LINE',
			],
		];
	}
	protected function get_editor_type( $field ) {
		return isset( $this->get_fields()[ $field ]['editor_type'] ) ? $this->get_fields()[ $field ]['editor_type'] : 'LINE';
	}
}
