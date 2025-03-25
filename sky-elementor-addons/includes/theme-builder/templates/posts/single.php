<?php

defined( 'ABSPATH' ) || exit;

get_header();


if ( class_exists( 'Elementor\Plugin' ) ) {
	$templates = \SkyAddons\ThemeBuilder\Theme_Builder::template_ids();
	if ( isset( $templates['single'] ) && ! empty( $templates['single'] ) ) {
		echo wowdevs_render_elementor_content( $templates['single'] );
	}
}

get_footer();
