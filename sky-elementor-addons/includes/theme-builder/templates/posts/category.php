<?php

defined( 'ABSPATH' ) || exit;

get_header();


if ( class_exists( 'Elementor\Plugin' ) ) {
	$templates = \SkyAddons\ThemeBuilder\Theme_Builder::template_ids();
	if ( isset( $templates['category'] ) && ! empty( $templates['category'] ) ) {
		echo wowdevs_render_elementor_content( $templates['category'] );
	}
}


get_footer();
