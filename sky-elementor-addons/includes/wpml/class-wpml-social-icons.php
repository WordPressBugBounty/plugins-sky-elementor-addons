<?php
namespace Sky_Addons\Includes;

/**
 * Class WPML_Social_Icons
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WPML_Social_Icons extends WPML_Module_With_Items {

	/**
	 * @return string
	 */
	public function get_items_field() {
		return 'social_icon_list';
	}

	/**
	 * @return array
	 */
	public function get_fields() {
		return [
			'social_label' => [
				'title'       => esc_html__( 'Social Icons: Social Name', 'sky-elementor-addons' ),
				'editor_type' => 'LINE',
			],
			'link'         => [
				'field'       => 'url',
				'title'       => esc_html__( 'Social Icons: Link', 'sky-elementor-addons' ),
				'editor_type' => 'LINK',
			],
		];
	}

	/**
	 * @param string $field
	 * @return string
	 */
	protected function get_title( $field ) {
		switch ( $field ) {
			case 'social_label':
				return esc_html__( 'Social Icons: Social Name', 'sky-elementor-addons' );
			case 'link':
				return esc_html__( 'Social Icons: Link', 'sky-elementor-addons' );
			case 'separator_text':
				return esc_html__( 'Social Icons: Custom Separator', 'sky-elementor-addons' );
			default:
				return '';
		}
	}

	/**
	 * @param string $field
	 * @return string
	 */
	protected function get_editor_type( $field ) {
		return isset( $this->get_fields()[ $field ]['editor_type'] ) ? $this->get_fields()[ $field ]['editor_type'] : 'LINE';
	}
}
