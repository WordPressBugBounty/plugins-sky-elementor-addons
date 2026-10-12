<?php
namespace Sky_Addons\Includes;

/**
 * Class WPML_Team_Member
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WPML_Team_Member extends WPML_Module_With_Items {

	/**
	 * @return string
	 */
	public function get_items_field() {
		return 'social_list';
	}

	/**
	 * @return array
	 */
	public function get_fields() {
		return [
			'social_name',
			'social_link' => [
				'field'       => 'url',
				'type'        => esc_html__( 'Team Member: Social Link', 'sky-elementor-addons' ),
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
			case 'name':
				return esc_html__( 'Team Member: Name', 'sky-elementor-addons' );
			case 'job_title':
				return esc_html__( 'Team Member: Job Title', 'sky-elementor-addons' );
			case 'text':
				return esc_html__( 'Team Member: Short Text', 'sky-elementor-addons' );
			case 'button_text':
				return esc_html__( 'Team Member: Button Text', 'sky-elementor-addons' );
			case 'link':
				return esc_html__( 'Team Member: Button Link', 'sky-elementor-addons' );
			case 'social_name':
				return esc_html__( 'Team Member: Social Name', 'sky-elementor-addons' );
			case 'social_link':
				return esc_html__( 'Team Member: Social Link', 'sky-elementor-addons' );
			default:
				return '';
		}
	}

	/**
	 * @param string $field
	 * @return string
	 */
	protected function get_editor_type( $field ) {
		switch ( $field ) {
			case 'name':
			case 'text':
				return 'AREA';
			case 'job_title':
			case 'button_text':
			case 'social_name':
				return 'LINE';
			default:
				return 'LINE';
		}
	}
}
