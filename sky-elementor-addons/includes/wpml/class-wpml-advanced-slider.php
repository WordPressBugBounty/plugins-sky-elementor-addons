<?php

namespace Sky_Addons\Includes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles WPML translation integration for the Advanced Slider widget.
 * Extends WPML_Module_With_Items to support translation of slider items and fields.
 */
class WPML_Advanced_Slider extends WPML_Module_With_Items {

	/**
	 * Returns the field name containing the slider items.
	 *
	 * @return string The field name for slider items.
	 */
	public function get_items_field() {
		return 'slider_list';
	}

	/**
	 * Returns the translatable fields for the Advanced Slider widget.
	 *
	 * @return array List of translatable fields and their editor types.
	 */
	public function get_fields() {
		return [
			'sub_title'   => [
				'title'       => esc_html__( 'Advanced Slider: Sub Title', 'sky-elementor-addons' ),
				'editor_type' => 'AREA',
			],
			'title'       => [
				'title'       => esc_html__( 'Advanced Slider: Title', 'sky-elementor-addons' ),
				'editor_type' => 'AREA',
			],
			'custom_text' => [
				'title'       => esc_html__( 'Advanced Slider: Text', 'sky-elementor-addons' ),
				'editor_type' => 'VISUAL',
			],
			'link'        => [
				'field'       => 'url',
				'title'       => esc_html__( 'Advanced Slider: Link', 'sky-elementor-addons' ),
				'editor_type' => 'LINK',
			],
		];
	}

	/**
	 * Gets the title for a given field.
	 *
	 * @param string $field Field name.
	 * @return string Field title, or empty string if not found.
	 */
	protected function get_title( $field ) {
		return isset( $this->get_fields()[ $field ]['title'] ) ? $this->get_fields()[ $field ]['title'] : '';
	}
}
