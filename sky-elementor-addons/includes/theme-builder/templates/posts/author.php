<?php

defined( 'ABSPATH' ) || exit;

get_header();

if ( class_exists( 'Elementor\Plugin' ) ) {
	$templates = \SkyAddons\ThemeBuilder\Theme_Builder::template_ids();
	if ( isset( $templates['author'] ) && ! empty( $templates['author'] ) ) {
		echo wowdevs_render_elementor_content( $templates['author'] );
	}
}


get_footer();
