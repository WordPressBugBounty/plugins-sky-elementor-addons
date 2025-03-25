<?php

defined( 'ABSPATH' ) || exit;

get_header();

if ( class_exists( 'Elementor\Plugin' ) ) {
	$templates = \SkyAddons\ThemeBuilder\Theme_Builder::template_ids();
	if ( isset( $templates['archive'] ) && ! empty( $templates['archive'] ) ) {
		echo wowdevs_render_elementor_content( $templates['archive'] );
	}
}


get_footer();
