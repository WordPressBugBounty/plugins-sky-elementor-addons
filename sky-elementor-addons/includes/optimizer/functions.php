<?php
/**
 * Asset Manager global helper functions.
 *
 * Loaded early (before Elementor, before class-optimizer.php) so these
 * functions are available to modules-manager, plugin.php, the optimizer
 * class, and the admin settings handler without any ordering dependency.
 *
 * @package Sky_Addons
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'sky_addons_asset_mode' ) ) {

	/**
	 * Return the current Asset Manager delivery mode.
	 *
	 * 'generated'  — custom uploads bundle (active-widget-only, smallest size).
	 * 'full'       — plugin-shipped combined bundle (instant, no generation).
	 * 'per-widget' — individual per-widget files, loaded on demand per page.
	 *
	 * Handles backward-compat with the old boolean 'on'/'off' values.
	 * Default: 'generated' (mirrors the former default-ON behaviour).
	 */
	function sky_addons_asset_mode() {
		$settings = get_option( 'sky_addons_advanced_settings', get_option( 'sky_addons_other_settings', [] ) );
		$raw      = isset( $settings['asset_manager'] ) ? $settings['asset_manager'] : 'generated';

		// Backward-compat: old on/off saved values.
		if ( 'on' === $raw ) {
			return 'generated';
		}
		if ( 'off' === $raw ) {
			return 'per-widget';
		}

		return in_array( $raw, [ 'generated', 'full', 'per-widget' ], true ) ? $raw : 'generated';
	}
}

if ( ! function_exists( 'sky_addons_is_asset_optimization_enabled' ) ) {

	/**
	 * Whether the Asset Manager is using a combined bundle (generated or full).
	 *
	 * Returns true for 'generated' and 'full' — both modes alias per-widget
	 * handles to the combined bundle via modules-manager. Returns false for
	 * 'per-widget' only.
	 */
	function sky_addons_is_asset_optimization_enabled() {
		$enabled = in_array( sky_addons_asset_mode(), [ 'generated', 'full' ], true );

		return (bool) apply_filters( 'sky-addons/optimization/asset_manager', $enabled );
	}
}
