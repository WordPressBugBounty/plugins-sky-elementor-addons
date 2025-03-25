<?php

defined( 'ABSPATH' ) || exit;

get_header();


if ( class_exists( 'Elementor\Plugin' ) ) {
	$templates = \SkyAddons\ThemeBuilder\Theme_Builder::template_ids();
	if ( isset( $templates['search'] ) && ! empty( $templates['search'] ) ) {
		echo wowdevs_render_elementor_content( $templates['search'] );
	}
}


get_footer();
