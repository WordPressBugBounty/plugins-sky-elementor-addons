<?php
/**
 * Widgets Settings Handler
 *
 * @package Sky_Addons
 * @since 2.7.0
 */

namespace Sky_Addons\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Sky_Addons\Admin\Sky_Addons_Admin;

/**
 * Widgets Settings Handler
 *
 * @since 2.7.0
 */
class Widgets_Settings {

	private static $instance = null;

	const WIDGETS_DB_KEY           = 'sky_addons_inactive_widgets';
	const WIDGETS_3RD_PARTY_DB_KEY = 'sky_addons_inactive_3rd_party_widgets';
	const EXTENSIONS_DB_KEY        = 'sky_addons_inactive_extensions';
	const API_DB_KEY               = 'sky_addons_api';

	/**
	 * Feature toggles relocated from the Extensions tab to the Others tab.
	 * They are still stored inside the EXTENSIONS_DB_KEY option.
	 */
	const OTHERS_FEATURES = [ 'svg-support', 'templates-library', 'blogs-video', 'duplicator', 'smooth-scroll' ];

	/**
	 * All known API field names — whitelist for save_api_settings().
	 * Add new field names here when adding a new API provider in admin.php.
	 */
	const API_FIELD_NAMES = [
		'form_builder_email_to',
		'google_map_key',
		'mailchimp_api_key',
		'mailchimp_list_id',
		'instagram_app_id',
		'instagram_app_secret',
		'instagram_access_token',
		'twitter_api_key',
		'twitter_api_secret',
		'twitter_bearer_token',
		'facebook_app_id',
		'facebook_app_secret',
		'ai_provider',
		'openai_api_key',
	];

	/**
	 * Construct
	 */
	public function __construct() {
		add_action( 'wp_ajax_sky_addons_get_settings', [ $this, 'get_settings' ] );
		add_action( 'wp_ajax_sky_addons_set_settings', [ $this, 'set_settings' ] );
	}

	/**
	 * Check the permissions for getting the settings
	 *
	 * @since 2.7.0
	 */
	public function permissions_check() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Set Sync
	 *
	 * @since 2.7.0
	 */
	public function get_settings() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( [ 'message' => esc_html__( 'Unauthorized access.', 'sky-elementor-addons' ) ], 403 );
		}

		check_ajax_referer( 'sky_addons_nonce', '_wpnonce' );

    // phpcs:ignore
		$action_type = isset( $_POST['action_type'] ) ? sanitize_text_field( wp_unslash( $_POST['action_type'] ) ) : false;

		if ( ! $action_type ) {
			wp_send_json_error( [ 'message' => esc_html__( 'Oops, Settings is not found.', 'sky-elementor-addons' ) ], 404 );
			wp_die();
		}

		switch ( $action_type ) {
			case 'get_widgets':
				$widgets = $this->get_widgets_list( 'sky_addons_widgets' );
				return wp_send_json_success( $widgets );

			case 'get_extensions':
				$extensions = $this->get_widgets_list( 'sky_addons_extensions' );
				return wp_send_json_success( $extensions );

			case 'get_3rd_party':
				$_3rd_party = $this->get_widgets_list( 'sky_addons_3rd_party_widget' );
				return wp_send_json_success( $_3rd_party );

			case 'get_api':
				$api = Sky_Addons_Admin::get_element_list()['sky_addons_api'] ?? [];
				return wp_send_json_success( $api );

			case 'advanced_settings':
				$inactive = (array) get_option( self::EXTENSIONS_DB_KEY, [] );
				$advanced = (array) get_option( 'sky_addons_advanced_settings', [] );

				$features = [];
				foreach ( self::OTHERS_FEATURES as $slug ) {
					if ( 'smooth-scroll' === $slug ) {
						// smooth-scroll lives in advanced_settings, defaults to off.
						$features[ $slug ] = isset( $advanced['smooth_scroll'] ) && 'on' === $advanced['smooth_scroll'] ? 'on' : 'off';
					} else {
						$features[ $slug ] = in_array( $slug, $inactive, true ) ? 'off' : 'on';
					}
				}

				$bundle      = null;
				$log         = [];
				$full_bundle = null;
				if ( class_exists( '\Sky_Addons\Optimizer\Asset_Manager' ) ) {
					$bundle = ( new \Sky_Addons\Optimizer\Asset_Manager() )->get_bundle_info();
					$log    = \Sky_Addons\Optimizer\Optimizer::get_log();
				}

				// Size of the plugin-shipped combined bundle (Full Bundle mode).
				$full_css    = SKY_ADDONS_ASSETS_PATH . 'css/sky-addons.css';
				$full_js     = SKY_ADDONS_ASSETS_PATH . 'js/sky-addons.min.js';
				$full_bundle = [
					'css_bytes' => file_exists( $full_css ) ? (int) filesize( $full_css ) : 0,
					'js_bytes'  => file_exists( $full_js ) ? (int) filesize( $full_js ) : 0,
				];

				// Add pro combined bundle when active.
				if ( defined( 'SKY_ADDONS_PRO_PATH' ) ) {
					$pro_css = SKY_ADDONS_PRO_PATH . 'assets/css/sky-addons-pro.css';
					$pro_js  = SKY_ADDONS_PRO_PATH . 'assets/js/sky-addons-pro.min.js';
					$full_bundle['css_bytes'] += file_exists( $pro_css ) ? (int) filesize( $pro_css ) : 0;
					$full_bundle['js_bytes']  += file_exists( $pro_js ) ? (int) filesize( $pro_js ) : 0;
				}

				$full_bundle['total_bytes'] = $full_bundle['css_bytes'] + $full_bundle['js_bytes'];

				return wp_send_json_success(
					[
						'asset_manager'    => function_exists( 'sky_addons_asset_mode' ) ? sky_addons_asset_mode() : 'generated',
						'features'         => $features,
						'bundle'           => $bundle,
						'full_bundle'      => $full_bundle,
						'optimizer_log'    => $log,
						'optimizer_status' => self::get_optimizer_status(),
						'progress'         => class_exists( '\Sky_Addons\Optimizer\Optimizer' ) ? \Sky_Addons\Optimizer\Optimizer::get_progress() : null,
					]
				);

			default:
				wp_send_json_error( [ 'message' => esc_html__( 'Oops, Action is not found.', 'sky-elementor-addons' ) ], 404 );
		}
	}

	/**
	 * Set Settings
	 *
	 * @since 2.7.0
	 */
	public function set_settings() {

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( [ 'message' => esc_html__( 'Unauthorized access.', 'sky-elementor-addons' ) ], 403 );
		}

		check_ajax_referer( 'sky_addons_nonce', '_wpnonce' );

    // phpcs:ignore
		$action_type = isset( $_POST['action_type'] ) ? sanitize_text_field( wp_unslash( $_POST['action_type'] ) ) : false;
		if ( ! $action_type ) {
			wp_send_json_error( [ 'message' => esc_html__( 'Oops, Settings is not found.', 'sky-elementor-addons' ) ], 404 );
		}

		switch ( $action_type ) {
			case 'get_widgets':
        // phpcs:ignore
				$widgets = $this->save_options( 'sky_addons_inactive_widgets', $_POST );
				wp_send_json_success( $widgets );
				break;

			case 'get_extensions':
        // phpcs:ignore
				$extensions = $this->save_options( 'sky_addons_inactive_extensions', $_POST );
				wp_send_json_success( $extensions );
				break;

			case 'get_3rd_party':
        // phpcs:ignore
				$_3rd_party = $this->save_options( 'sky_addons_inactive_3rd_party_widgets', $_POST );
				wp_send_json_success( $_3rd_party );
				break;

			case 'advanced_settings':
        // phpcs:ignore
				wp_send_json_success( $this->save_advanced_settings( $_POST ) );
				break;

			case 'regenerate_assets':
				wp_send_json_success( $this->regenerate_assets() );
				break;

			case 'regenerate_status':
				wp_send_json_success( $this->regenerate_status() );
				break;

			case 'dismiss_optimizer_status':
				wp_send_json_success( $this->dismiss_optimizer_status() );
				break;

			case 'feature_toggle':
        // phpcs:ignore
				wp_send_json_success( $this->toggle_feature( $_POST ) );
				break;

			case 'set_api':
        // phpcs:ignore
				wp_send_json_success( $this->save_api_settings( $_POST ) );
				break;

			default:
				wp_send_json_error( [ 'message' => esc_html__( 'Oops, Action is not found.', 'sky-elementor-addons' ) ], 404 );
		}
	}

	/**
	 * Save the general optimizer settings.
	 *
	 * Turning the toggle ON dispatches a background regenerate (returns
	 * immediately with state=queued); the dashboard then polls regenerate_status.
	 * Turning the toggle OFF clears the bundle synchronously because deleting
	 * a few files is always fast.
	 *
	 * @param array $values Raw $_POST data.
	 */
	public function save_advanced_settings( $values ) {
		$post_value = is_array( $values ) ? $values : [];

		$raw = isset( $post_value['asset_manager'] ) ? sanitize_text_field( wp_unslash( $post_value['asset_manager'] ) ) : 'generated';
		// Normalise: accept legacy on/off as well as the 3 named modes.
		if ( 'on' === $raw ) {
			$raw = 'generated';
		} elseif ( 'off' === $raw ) {
			$raw = 'per-widget';
		}
		$mode = in_array( $raw, [ 'generated', 'full', 'per-widget' ], true ) ? $raw : 'generated';

		$settings                  = get_option( 'sky_addons_advanced_settings', get_option( 'sky_addons_other_settings', [] ) );
		$settings                  = is_array( $settings ) ? $settings : [];
		$settings['asset_manager'] = $mode;
		update_option( 'sky_addons_advanced_settings', $settings );

		$bundle      = null;
		$write_error = false;
		$progress    = null;

		if ( class_exists( '\Sky_Addons\Optimizer\Asset_Manager' ) ) {
			$manager     = new \Sky_Addons\Optimizer\Asset_Manager();
			$write_error = ! \Sky_Addons\Optimizer\Asset_Manager::is_upload_writable();

			if ( 'generated' === $mode ) {
				// Dispatch a background regenerate to build/refresh the uploads bundle.
				if ( ! $write_error ) {
					$progress = \Sky_Addons\Optimizer\Optimizer::dispatch_regenerate( 'manual' );
				}
			} elseif ( 'per-widget' === $mode ) {
				// Clear the uploads bundle — nothing global is served in this mode.
				$manager->clear();
				\Sky_Addons\Optimizer\Optimizer::log_event( 'cleared', 'manual' );
			}
			// 'full' mode: keep any existing uploads bundle untouched; it is simply
			// not used. No clear, no regenerate.

			$bundle = $manager->get_bundle_info();
		}

		if ( 'generated' === $mode && $write_error ) {
			$status = 'warning';
			$msg    = self::failure_message( 'upload_unwritable' );
		} elseif ( 'generated' === $mode ) {
			$status = 'queued';
			$msg    = esc_html__( 'Auto Optimize enabled. Custom bundle is being generated in the background.', 'sky-elementor-addons' );
		} elseif ( 'full' === $mode ) {
			$status = 'success';
			$msg    = esc_html__( 'Plugin Bundle mode enabled. The plugin-shipped combined file is now active.', 'sky-elementor-addons' );
		} else {
			$status = 'success';
			$msg    = esc_html__( 'Per Widget mode enabled. Each widget loads its own files on demand.', 'sky-elementor-addons' );
		}

		return [
			'status'           => $status,
			'title'            => esc_html__( 'Saved.', 'sky-elementor-addons' ),
			'msg'              => $msg,
			'bundle'           => $bundle,
			'write_error'      => $write_error,
			'optimizer_log'    => class_exists( '\Sky_Addons\Optimizer\Optimizer' ) ? \Sky_Addons\Optimizer\Optimizer::get_log() : [],
			'optimizer_status' => self::get_optimizer_status(),
			'progress'         => $progress,
		];
	}

	/**
	 * Dispatch a background regenerate. Returns the initial progress snapshot
	 * so the dashboard can start polling immediately.
	 */
	public function regenerate_assets() {
		if ( ! class_exists( '\Sky_Addons\Optimizer\Asset_Manager' ) ) {
			return [
				'status' => 'error',
				'title'  => esc_html__( 'Regeneration Failed.', 'sky-elementor-addons' ),
				'msg'    => esc_html__( 'The optimizer is not available.', 'sky-elementor-addons' ),
			];
		}

		if ( ! \Sky_Addons\Optimizer\Asset_Manager::is_upload_writable() ) {
			return [
				'status'           => 'error',
				'title'            => esc_html__( 'Permission Error.', 'sky-elementor-addons' ),
				'msg'              => sprintf(
					/* translators: %s: upload directory path */
					esc_html__( 'The upload directory is not writable. Per-widget loading is active. Fix write permissions on: %s', 'sky-elementor-addons' ),
					esc_html( wp_upload_dir()['basedir'] )
				),
				'write_error'      => true,
				'optimizer_status' => self::get_optimizer_status(),
			];
		}

		// Only 'generated' mode uses an uploads bundle — regenerating in 'full' or
		// 'per-widget' mode would be a no-op or confusing.
		if ( ! function_exists( 'sky_addons_asset_mode' ) || 'generated' !== sky_addons_asset_mode() ) {
			return [
				'status' => 'error',
				'title'  => esc_html__( 'Wrong Mode.', 'sky-elementor-addons' ),
				'msg'    => esc_html__( 'Switch to Auto Optimize mode to generate a custom bundle.', 'sky-elementor-addons' ),
			];
		}

		$progress = \Sky_Addons\Optimizer\Optimizer::dispatch_regenerate( 'manual' );

		if ( null === $progress ) {
			// Another runner is already active — return its current state so the
			// dashboard latches onto the in-flight job instead of dispatching twice.
			return [
				'status'           => 'queued',
				'title'            => esc_html__( 'Already Running.', 'sky-elementor-addons' ),
				'msg'              => esc_html__( 'A bundle regeneration is already in progress.', 'sky-elementor-addons' ),
				'progress'         => \Sky_Addons\Optimizer\Optimizer::get_progress(),
				'bundle'           => ( new \Sky_Addons\Optimizer\Asset_Manager() )->get_bundle_info(),
				'optimizer_log'    => \Sky_Addons\Optimizer\Optimizer::get_log(),
				'optimizer_status' => self::get_optimizer_status(),
				'write_error'      => false,
			];
		}

		return [
			'status'           => 'queued',
			'title'            => esc_html__( 'Regenerating…', 'sky-elementor-addons' ),
			'msg'              => esc_html__( 'Bundle regeneration is running in the background.', 'sky-elementor-addons' ),
			'progress'         => $progress,
			'bundle'           => ( new \Sky_Addons\Optimizer\Asset_Manager() )->get_bundle_info(),
			'optimizer_log'    => \Sky_Addons\Optimizer\Optimizer::get_log(),
			'optimizer_status' => self::get_optimizer_status(),
			'write_error'      => false,
		];
	}

	/**
	 * Polling endpoint. Returns current progress + a fresh bundle snapshot so
	 * the dashboard can refresh size/timestamp the moment a run completes.
	 */
	public function regenerate_status() {
		$progress = class_exists( '\Sky_Addons\Optimizer\Optimizer' )
			? \Sky_Addons\Optimizer\Optimizer::get_progress()
			: null;

		$bundle = class_exists( '\Sky_Addons\Optimizer\Asset_Manager' )
			? ( new \Sky_Addons\Optimizer\Asset_Manager() )->get_bundle_info()
			: null;

		return [
			'status'           => 'success',
			'progress'         => $progress,
			'bundle'           => $bundle,
			'optimizer_log'    => class_exists( '\Sky_Addons\Optimizer\Optimizer' ) ? \Sky_Addons\Optimizer\Optimizer::get_log() : [],
			'optimizer_status' => self::get_optimizer_status(),
			'write_error'      => class_exists( '\Sky_Addons\Optimizer\Asset_Manager' ) ? ! \Sky_Addons\Optimizer\Asset_Manager::is_upload_writable() : false,
		];
	}

	/**
	 * Clear the persisted optimizer failure status so the dashboard warning
	 * disappears until the next failed regenerate.
	 */
	public function dismiss_optimizer_status() {
		delete_option( 'sky_addons_optimizer_status' );

		return [
			'status'           => 'success',
			'title'            => esc_html__( 'Dismissed.', 'sky-elementor-addons' ),
			'msg'              => esc_html__( 'The optimizer warning has been dismissed.', 'sky-elementor-addons' ),
			'optimizer_status' => null,
		];
	}

	/**
	 * Get the persisted failure payload, or null when the last build succeeded.
	 *
	 * @return array|null
	 */
	private static function get_optimizer_status() {
		$status = get_option( 'sky_addons_optimizer_status', null );

		if ( ! is_array( $status ) || empty( $status['failed'] ) ) {
			return null;
		}

		return $status;
	}

	/**
	 * Human message for an optimizer failure reason.
	 *
	 * @param string $reason One of: upload_unwritable, minify_failed, no_files, unknown.
	 */
	private static function failure_message( $reason ) {
		switch ( $reason ) {
			case 'upload_unwritable':
				return esc_html__( 'The uploads directory is not writable. The plugin-shipped combined assets are being served as a safe fallback.', 'sky-elementor-addons' );
			case 'minify_failed':
				return esc_html__( 'Bundle minification failed. The plugin-shipped combined assets are being served as a safe fallback.', 'sky-elementor-addons' );
			case 'no_files':
				return esc_html__( 'Bundle files are missing on disk after the build. The plugin-shipped combined assets are being served as a safe fallback.', 'sky-elementor-addons' );
			default:
				return esc_html__( 'The optimized bundle could not be generated. The plugin-shipped combined assets are being served as a safe fallback.', 'sky-elementor-addons' );
		}
	}

	/**
	 * Toggle a single Others-tab feature on or off.
	 *
	 * Partially updates the EXTENSIONS_DB_KEY option so the other extension
	 * states are left untouched.
	 *
	 * @param array $values Raw $_POST data.
	 */
	public function toggle_feature( $values ) {
		$post_value = is_array( $values ) ? $values : [];

		$feature = isset( $post_value['feature'] ) ? sanitize_text_field( wp_unslash( $post_value['feature'] ) ) : '';
		$value   = isset( $post_value['value'] ) && 'on' === $post_value['value'] ? 'on' : 'off';

		if ( ! in_array( $feature, self::OTHERS_FEATURES, true ) ) {
			return [
				'status' => 'error',
				'title'  => esc_html__( 'Update Failed.', 'sky-elementor-addons' ),
				'msg'    => esc_html__( 'Unknown feature.', 'sky-elementor-addons' ),
			];
		}

		// smooth-scroll state lives in sky_addons_advanced_settings, not inactive_extensions.
		if ( 'smooth-scroll' === $feature ) {
			$advanced                 = (array) get_option( 'sky_addons_advanced_settings', [] );
			$advanced['smooth_scroll'] = $value;
			update_option( 'sky_addons_advanced_settings', $advanced );
		} else {
			$inactive = (array) get_option( self::EXTENSIONS_DB_KEY, [] );
			if ( 'off' === $value ) {
				$inactive[] = $feature;
			} else {
				$inactive = array_diff( $inactive, [ $feature ] );
			}
			update_option( self::EXTENSIONS_DB_KEY, array_values( array_unique( $inactive ) ) );
		}

		return [
			'status' => 'success',
			'title'  => esc_html__( 'Successfully Updated.', 'sky-elementor-addons' ),
			'msg'    => esc_html__( 'The feature setting has been saved.', 'sky-elementor-addons' ),
		];
	}

	/**
	 * Save Options
	 */
	public function save_options( $option_name, $values ) {
		// Ensure $values is an array
		$post_value = is_array( $values ) ? $values : [];

		// Filter and sanitize the input values, keeping only those with the value 'off'
		$filtered_values = [];
		foreach ( $post_value as $key => $value ) {
			if ( 'off' === $value ) {
				$filtered_values[ $key ] = sanitize_text_field( $value );
			}
		}

		// Retrieve the current saved option
		$saved_option = get_option( $option_name, [] );

		// The Others-tab features live in the extensions option but are not part
		// of the Extensions form — preserve their saved state on every save.
		if ( self::EXTENSIONS_DB_KEY === $option_name ) {
			foreach ( self::OTHERS_FEATURES as $slug ) {
				if ( in_array( $slug, (array) $saved_option, true ) ) {
					$filtered_values[ $slug ] = 'off';
				}
			}
		}

		// Check if there are changes to save (order-insensitive comparison)
		$new_inactive = array_keys( $filtered_values );
		$old_inactive = array_values( (array) $saved_option );
		sort( $new_inactive );
		sort( $old_inactive );
		if ( $new_inactive === $old_inactive ) {
			return [
				'status' => 'error',
				'title'  => esc_html__( 'Already Updated.', 'sky-elementor-addons' ),
				'msg'    => esc_html__( 'There is no change in your settings. So there is no need to save the settings again.', 'sky-elementor-addons' ),
			];
		}

		// Attempt to update the option
		if ( update_option( $option_name, array_keys( $filtered_values ) ) ) {
			// Active widget/extension set changed — dispatch a background rebuild
			// so the save returns immediately. Dashboard latches onto the in-flight
			// runner via the existing regenerate_status polling endpoint.
			$progress = null;
			$bundle   = null;
			$log      = [];

			if (
				function_exists( 'sky_addons_is_asset_optimization_enabled' )
				&& sky_addons_is_asset_optimization_enabled()
				&& class_exists( '\Sky_Addons\Optimizer\Optimizer' )
				&& class_exists( '\Sky_Addons\Optimizer\Asset_Manager' )
			) {
				$progress = \Sky_Addons\Optimizer\Optimizer::dispatch_regenerate( 'widgets_changed' );

				// dispatch_regenerate() returns null when another runner is already
				// active — surface its live progress so the dashboard can latch.
				if ( null === $progress ) {
					$progress = \Sky_Addons\Optimizer\Optimizer::get_progress();
				}

				$bundle = ( new \Sky_Addons\Optimizer\Asset_Manager() )->get_bundle_info();
				$log    = \Sky_Addons\Optimizer\Optimizer::get_log();
			}

			return [
				'status'        => 'success',
				'title'         => esc_html__( 'Successfully Updated.', 'sky-elementor-addons' ),
				'msg'           => esc_html__( 'Great, your settings saved successfully in your system.', 'sky-elementor-addons' ),
				'progress'      => $progress,
				'bundle'        => $bundle,
				'optimizer_log' => $log,
			];
		} else {
			return [
				'status' => 'error',
				'title'  => esc_html__( 'Update Failed.', 'sky-elementor-addons' ),
				'msg'    => esc_html__( 'There was an error updating your settings. Please try again.', 'sky-elementor-addons' ),
			];
		}
	}


	/**
	 * Save API credentials.
	 *
	 * Only updates keys present in API_FIELD_NAMES. An empty string clears the key.
	 *
	 * @param array $values Raw $_POST data.
	 */
	public function save_api_settings( $values ) {
		$post_value = is_array( $values ) ? $values : [];
		$saved      = (array) get_option( self::API_DB_KEY, [] );

		foreach ( self::API_FIELD_NAMES as $key ) {
			if ( ! array_key_exists( $key, $post_value ) ) {
				continue;
			}
			$val = sanitize_text_field( wp_unslash( $post_value[ $key ] ) );
			if ( '' === $val ) {
				unset( $saved[ $key ] );
			} else {
				$saved[ $key ] = $val;
			}
		}

		update_option( self::API_DB_KEY, $saved );

		return [
			'status' => 'success',
			'title'  => esc_html__( 'Successfully Updated.', 'sky-elementor-addons' ),
			'msg'    => esc_html__( 'API settings saved successfully.', 'sky-elementor-addons' ),
		];
	}

	/**
	 * Get Widgets List
	 *
	 * @since 2.7.0
	 */
	public function get_widgets_list( $list_name ) {

		$widgets_fields = Sky_Addons_Admin::get_element_list();

		$_widgets = $widgets_fields[ $list_name ];

		return $_widgets;
	}
}
