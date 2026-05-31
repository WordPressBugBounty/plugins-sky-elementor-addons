<?php
/**
 * Templates Library helper functions.
 *
 * Loaded early so the flag is available to plugin.php and class-core.php
 * without any ordering dependency on the templates classes themselves.
 *
 * @package Sky_Addons
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'sky_addons_is_templates_library_enabled' ) ) {

	/**
	 * Whether the Sky Addons Templates Library is enabled.
	 *
	 * Controlled via the Others tab in the admin dashboard.
	 * When disabled, none of the library's PHP classes, AJAX actions,
	 * or editor scripts/styles are loaded.
	 */
	function sky_addons_is_templates_library_enabled() {
		$inactive = (array) get_option( 'sky_addons_inactive_extensions', [] );
		$enabled  = ! in_array( 'templates-library', $inactive, true );

		return (bool) apply_filters( 'sky-addons/features/templates_library', $enabled );
	}
}
