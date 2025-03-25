<?php

namespace SkyAddons\ThemeBuilder\Themes_Hooks;

defined( 'ABSPATH' ) || exit;

/**
 * Oceanwp Themes
 */
class Oceanwp {

	private $elementor;

	private $header;
	private $footer;

	public function __construct( $template_ids ) {
		$this->header = $template_ids['header'];
		$this->footer = $template_ids['footer'];

		if ( defined( 'ELEMENTOR_VERSION' ) && is_callable( 'Elementor\Plugin::instance' ) ) {
			$this->elementor = \Elementor\Plugin::instance();
		}

		if ( null !== $this->header ) {
			add_action( 'template_redirect', array( $this, 'remove_theme_header_markup' ), 10 );
			add_action( 'ocean_header', array( $this, 'add_plugin_header_markup' ) );
		}

		if ( null !== $this->footer ) {
			add_action( 'template_redirect', array( $this, 'remove_theme_footer_markup' ), 10 );
			add_action( 'ocean_footer', array( $this, 'add_plugin_footer_markup' ) );
		}
	}

	public function remove_theme_header_markup() {
		remove_action( 'ocean_top_bar', 'oceanwp_top_bar_template' );
		remove_action( 'ocean_header', 'oceanwp_header_template' );
		remove_action( 'ocean_page_header', 'oceanwp_page_header_template' );
	}

	public function add_plugin_header_markup() {
		do_action( 'wowdevs_themes_builder_template_before_header' );
		echo '<div class="wowdevs-template-content-markup wowdevs-template-content-header">';
    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo wowdevs_render_elementor_content( $this->header );
		echo '</div>';
		do_action( 'wowdevs_themes_builder_template_after_header' );
	}


	public function remove_theme_footer_markup() {
		remove_action( 'ocean_footer', 'oceanwp_footer_template' );
	}

	public function add_plugin_footer_markup() {
		do_action( 'wowdevs_themes_builder_template_before_footer' );
		echo '<div class="wowdevs-template-content-markup wowdevs-template-content-footer">';
    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo wowdevs_render_elementor_content( $this->footer );
		echo '</div>';
		do_action( 'wowdevs_themes_builder_template_after_footer' );
	}
}
