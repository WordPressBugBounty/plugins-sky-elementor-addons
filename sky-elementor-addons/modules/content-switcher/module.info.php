<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

return [
	'title'              => esc_html__( 'Content Switcher', 'sky-elementor-addons' ),
	'required'           => true,
	'default_activation' => true,
// 'has_style'          => true,
// 'has_script'       => true,
];
