<?php
/**
 * Optimizer — frontend loading + regeneration hooks for the asset manager bundle.
 *
 * @package Sky_Addons
 */

namespace Sky_Addons\Optimizer;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Optimizer {

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function __construct() {
		require_once __DIR__ . '/asset-manager.php';

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_bundle' ], 99999 );
		add_action( 'elementor/preview/enqueue_styles', [ $this, 'enqueue_bundle' ] );
		add_action( 'elementor/preview/enqueue_scripts', [ $this, 'enqueue_bundle' ] );

		add_action( 'elementor/core/files/clear_cache', [ $this, 'on_elementor_cache_clear' ] );
		add_action( 'sky_addons_auto_regenerate', [ $this, 'auto_regenerate' ] );

		// Background runner — bypasses the AJAX/admin PHP execution limit by running
		// inside a wp-cron lifetime where we can lift set_time_limit and ignore_user_abort.
		add_action( 'sky_addons_run_regenerate_background', [ $this, 'run_background_regenerate' ] );

		// Regenerate when either Sky Addons plugin is updated, so a stale bundle never
		// outlives the code that produced it.
		add_action( 'upgrader_process_complete', [ $this, 'on_upgrader_process_complete' ], 10, 2 );

		if ( is_admin() ) {
			add_action( 'admin_notices', [ $this, 'maybe_render_failure_notice' ] );
			add_action( 'admin_post_sky_addons_dismiss_optimizer_notice', [ $this, 'dismiss_failure_notice' ] );
		}
	}

	public function on_elementor_cache_clear() {
		$this->regenerate( 'elementor_cache_clear' );
	}

	public function auto_regenerate() {
		$this->regenerate( 'auto_cron' );
	}

	/**
	 * Schedule a regenerate when WP updater touches either Sky Addons plugin.
	 *
	 * @param \WP_Upgrader $upgrader   Unused — kept for hook signature.
	 * @param array        $hook_extra Updater metadata.
	 */
	public function on_upgrader_process_complete( $upgrader, $hook_extra ) {
		unset( $upgrader );

		if ( empty( $hook_extra['type'] ) || 'plugin' !== $hook_extra['type'] ) {
			return;
		}

		$action = isset( $hook_extra['action'] ) ? $hook_extra['action'] : '';
		if ( ! in_array( $action, [ 'update', 'install' ], true ) ) {
			return;
		}

		if ( ! empty( $hook_extra['plugins'] ) && is_array( $hook_extra['plugins'] ) ) {
			$touched = $hook_extra['plugins'];
		} elseif ( ! empty( $hook_extra['plugin'] ) ) {
			$touched = [ $hook_extra['plugin'] ];
		} else {
			return;
		}

		if ( ! self::touches_sky_addons( $touched ) ) {
			return;
		}

		if ( ! wp_next_scheduled( 'sky_addons_auto_regenerate' ) ) {
			// Small delay so the new plugin files are settled on disk before we read them.
			wp_schedule_single_event( time() + 30, 'sky_addons_auto_regenerate' );
		}
	}

	/**
	 * Whether the updater payload includes the free or pro Sky Addons basename.
	 *
	 * @param array $plugins Plugin basenames from upgrader_process_complete.
	 */
	private static function touches_sky_addons( array $plugins ) {
		$known = [
			'sky-elementor-addons/sky-elementor-addons.php',
			'sky-elementor-addons-pro/sky-elementor-addons-pro.php',
		];

		foreach ( $plugins as $basename ) {
			if ( in_array( $basename, $known, true ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Whether a usable uploads bundle exists on disk (Tier 1).
	 *
	 * The version option alone is not enough — if the uploads directory is wiped,
	 * or the files were never written, we must fall back to the plugin-shipped
	 * combined assets instead of enqueuing nothing.
	 */
	private function bundle_ready() {
		if ( ! get_option( 'sky_addons_minified_asset_version', false ) ) {
			return false;
		}

		$dir = Asset_Manager::get_upload_dir();
		$css = $dir . 'css/sky-addons.css';
		$js  = $dir . 'js/sky-addons.js';

		return file_exists( $css ) && file_exists( $js );
	}

	/**
	 * Enqueue assets on the frontend / Elementor preview.
	 *
	 * Tier 1 — uploads bundle (generated, active-widgets-only, minified).
	 * Tier 2 — plugin combined file (shipped, all widgets, instant fallback).
	 * Editor  — always Tier 2 (fast, always available regardless of optimizer state).
	 */
	public function enqueue_bundle() {
		// Editor always gets the plugin combined file.
		if ( in_array( current_action(), [ 'elementor/preview/enqueue_styles', 'elementor/preview/enqueue_scripts' ], true ) ) {
			$this->enqueue_plugin_combined();
			return;
		}

		if ( ! sky_addons_is_asset_optimization_enabled() ) {
			return; // Asset Manager OFF — per-widget mode, nothing to enqueue here.
		}

		if ( $this->bundle_ready() ) {
			$this->enqueue_uploads_bundle();
		} else {
			$this->enqueue_plugin_combined();
		}
	}

	/**
	 * Tier 1 — serve the minified bundle from the uploads directory.
	 */
	private function enqueue_uploads_bundle() {
		$version  = get_option( 'sky_addons_minified_asset_version' );
		$base_dir = Asset_Manager::get_upload_dir();
		$base_url = Asset_Manager::get_upload_url();

		$css_file = ( is_rtl() && file_exists( $base_dir . 'css/sky-addons.rtl.css' ) )
			? 'css/sky-addons.rtl.css'
			: 'css/sky-addons.css';

		if ( file_exists( $base_dir . $css_file ) ) {
			wp_enqueue_style( 'sa-styles', $base_url . $css_file, [], $version );
		}

		if ( file_exists( $base_dir . 'js/sky-addons.js' ) ) {
			wp_enqueue_script( 'sa-scripts', $base_url . 'js/sky-addons.js', [ 'jquery', 'elementor-frontend', 'sky-addons-common' ], $version, true );
		}
	}

	/**
	 * Tier 2 — serve the combined file shipped with the plugin.
	 */
	private function enqueue_plugin_combined() {
		$dir_suffix = is_rtl() && file_exists( SKY_ADDONS_ASSETS_PATH . 'css/sky-addons.rtl.css' ) ? '.rtl' : '';

		if ( file_exists( SKY_ADDONS_ASSETS_PATH . 'css/sky-addons.css' ) ) {
			wp_enqueue_style( 'sa-styles', SKY_ADDONS_ASSETS_URL . 'css/sky-addons' . $dir_suffix . '.css', [], SKY_ADDONS_VERSION );
		}

		$script_suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
		$js_path       = SKY_ADDONS_ASSETS_PATH . 'js/sky-addons' . $script_suffix . '.js';

		if ( file_exists( $js_path ) ) {
			wp_enqueue_script( 'sa-scripts', SKY_ADDONS_ASSETS_URL . 'js/sky-addons' . $script_suffix . '.js', [ 'jquery', 'elementor-frontend', 'sky-addons-common' ], SKY_ADDONS_VERSION, true );
		}
	}

	/**
	 * Rebuild the bundle, or clear it when the feature is off.
	 *
	 * @param string $trigger  Who triggered this: 'manual'|'auto_cron'|'elementor_cache_clear'.
	 */
	public function regenerate( $trigger = 'manual' ) {
		$manager = new Asset_Manager();

		if ( sky_addons_is_asset_optimization_enabled() ) {
			$ok = (bool) $manager->generate();
			self::log_event( $ok ? 'generated' : 'failed', $trigger );
		} else {
			$manager->clear();
			self::log_event( 'cleared', $trigger );
		}
	}

	/**
	 * Stale-runner heartbeat — if a previous runner crashed and the option was
	 * never updated to done/failed, allow a fresh dispatch after this many
	 * seconds without a progress update.
	 */
	const PROGRESS_STALE_AFTER = 60;

	/**
	 * Queue a background regenerate and nudge wp-cron so it fires on the next
	 * request without waiting for natural traffic. Returns the initial progress
	 * snapshot or null when another runner is already active.
	 *
	 * @param string $trigger Who initiated this dispatch.
	 * @return array|null
	 */
	public static function dispatch_regenerate( $trigger = 'manual' ) {
		$current = (array) get_option( 'sky_addons_optimizer_progress', [] );

		// A runner is considered active when state === running and the heartbeat
		// is recent. Stale-but-running rows fall through so a crashed runner does
		// not block forever.
		if ( ! empty( $current['state'] ) && 'running' === $current['state'] ) {
			$updated = isset( $current['updated'] ) ? (int) $current['updated'] : 0;
			if ( time() - $updated < self::PROGRESS_STALE_AFTER ) {
				return null;
			}
		}

		self::write_progress( 'queued', 0, 'queued', '', $trigger );

		// Schedule slightly in the past so the next request fires it immediately.
		if ( ! wp_next_scheduled( 'sky_addons_run_regenerate_background' ) ) {
			wp_schedule_single_event( time() - 1, 'sky_addons_run_regenerate_background' );
		}

		// spawn_cron() does a non-blocking loopback to wp-cron.php so the runner
		// kicks off without waiting for natural traffic. Respects DISABLE_WP_CRON.
		if ( function_exists( 'spawn_cron' ) ) {
			spawn_cron();
		}

		return self::get_progress();
	}

	/**
	 * Background runner — executed inside wp-cron so we can safely lift PHP
	 * execution limits. Honours the runner lock to prevent double-execution
	 * when wp-cron fires the same event twice in quick succession.
	 */
	public function run_background_regenerate() {
		$current = (array) get_option( 'sky_addons_optimizer_progress', [] );

		// Concurrency guard — bail if another runner is already inside this method.
		if ( ! empty( $current['state'] ) && 'running' === $current['state'] ) {
			$updated = isset( $current['updated'] ) ? (int) $current['updated'] : 0;
			if ( time() - $updated < self::PROGRESS_STALE_AFTER ) {
				return;
			}
		}

		@set_time_limit( 0 );        // phpcs:ignore WordPress.PHP.NoSilencedErrors
		@ignore_user_abort( true );  // phpcs:ignore WordPress.PHP.NoSilencedErrors

		$trigger = isset( $current['trigger'] ) ? (string) $current['trigger'] : 'manual';

		if ( ! sky_addons_is_asset_optimization_enabled() ) {
			self::write_progress( 'idle', 0, 'idle', 'asset_manager_off', $trigger );
			return;
		}

		self::write_progress( 'collecting', 0, 'running', '', $trigger );

		$manager = new Asset_Manager();
		$ok      = (bool) $manager->generate(
			static function ( $phase, $percent ) use ( $trigger ) {
				self::write_progress( $phase, $percent, 'running', '', $trigger );
			}
		);

		if ( $ok ) {
			self::write_progress( 'done', 100, 'done', '', $trigger );
			self::log_event( 'generated', $trigger );
			return;
		}

		$status = (array) get_option( 'sky_addons_optimizer_status', [] );
		$reason = isset( $status['reason'] ) ? (string) $status['reason'] : 'unknown';
		self::write_progress( 'failed', 100, 'failed', $reason, $trigger );
		self::log_event( 'failed', $trigger );
	}

	/**
	 * Update the persisted progress snapshot.
	 *
	 * @param string $phase   Current phase identifier.
	 * @param int    $percent 0-100.
	 * @param string $state   queued|running|done|failed|idle.
	 * @param string $reason  Failure reason when state === failed.
	 * @param string $trigger Original trigger that started this run.
	 */
	private static function write_progress( $phase, $percent, $state, $reason = '', $trigger = 'manual' ) {
		update_option(
			'sky_addons_optimizer_progress',
			[
				'state'   => $state,
				'phase'   => $phase,
				'percent' => (int) $percent,
				'reason'  => $reason,
				'trigger' => $trigger,
				'updated' => time(),
			],
			false
		);
	}

	/**
	 * Read the current progress snapshot.
	 *
	 * @return array|null
	 */
	public static function get_progress() {
		$progress = get_option( 'sky_addons_optimizer_progress', null );
		return is_array( $progress ) ? $progress : null;
	}

	/**
	 * Append one entry to the optimizer activity log (max 20 entries).
	 *
	 * @param string $event    'generated'|'cleared'|'pro_activated'|'pro_deactivated'.
	 * @param string $trigger  'manual'|'auto_cron'|'elementor_cache_clear'.
	 */
	public static function log_event( $event, $trigger = 'manual' ) {
		$log = (array) get_option( 'sky_addons_optimizer_log', [] );
		array_unshift(
			$log,
			[
				'time'    => time(),
				'event'   => $event,
				'trigger' => $trigger,
			]
		);
		update_option( 'sky_addons_optimizer_log', array_slice( $log, 0, 20 ), false );
	}

	/**
	 * Return the optimizer activity log for display in the dashboard.
	 *
	 * @return array
	 */
	public static function get_log() {
		return (array) get_option( 'sky_addons_optimizer_log', [] );
	}

	/**
	 * Render a dismissible warning when the most recent bundle build failed.
	 *
	 * Frontends still work — the optimizer falls back to the plugin-shipped
	 * combined assets — but the admin needs to know why the bundle is stale.
	 */
	public function maybe_render_failure_notice() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$status = (array) get_option( 'sky_addons_optimizer_status', [] );

		if ( empty( $status['failed'] ) ) {
			return;
		}

		$reason = isset( $status['reason'] ) ? (string) $status['reason'] : 'unknown';

		$messages = [
			'upload_unwritable' => __( 'The uploads directory is not writable, so the optimized bundle could not be generated. The plugin-shipped combined assets are being served as a safe fallback.', 'sky-elementor-addons' ),
			'no_files'          => __( 'The optimized bundle files are missing on disk. The plugin-shipped combined assets are being served as a safe fallback.', 'sky-elementor-addons' ),
			'minify_failed'     => __( 'Sky Addons could not minify the optimized bundle. The plugin-shipped combined assets are being served as a safe fallback.', 'sky-elementor-addons' ),
			'unknown'           => __( 'Sky Addons could not generate the optimized assets bundle. The plugin-shipped combined assets are being served as a safe fallback.', 'sky-elementor-addons' ),
		];

		$body = isset( $messages[ $reason ] ) ? $messages[ $reason ] : $messages['unknown'];

		$dismiss_url = wp_nonce_url(
			admin_url( 'admin-post.php?action=sky_addons_dismiss_optimizer_notice' ),
			'sky_addons_dismiss_optimizer_notice'
		);

		echo '<div class="notice notice-warning"><p><strong>';
		echo esc_html__( 'Sky Addons:', 'sky-elementor-addons' );
		echo '</strong> ';
		echo esc_html( $body );
		echo '</p><p><a href="' . esc_url( $dismiss_url ) . '">';
		echo esc_html__( 'Dismiss this notice', 'sky-elementor-addons' );
		echo '</a></p></div>';
	}

	/**
	 * Clear the failure flag when an admin acknowledges the notice.
	 */
	public function dismiss_failure_notice() {
		check_admin_referer( 'sky_addons_dismiss_optimizer_notice' );

		if ( current_user_can( 'manage_options' ) ) {
			delete_option( 'sky_addons_optimizer_status' );
		}

		$redirect = wp_get_referer();
		wp_safe_redirect( $redirect ? $redirect : admin_url() );
		exit;
	}
}
