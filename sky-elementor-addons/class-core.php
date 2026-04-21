<?php
/**
 * Core File — Admin Bootstrap
 *
 * Responsible for all admin matters: menu, dashboard REST API,
 * custom scripts CPT, and React dashboard asset enqueuing.
 * Runs with or without Elementor.
 *
 * @package Sky_Addons
 * @since   3.0.0
 */

namespace Sky_Addons;

defined( 'ABSPATH' ) || exit;

/**
 * Plugin Core
 *
 * @since 3.0.0
 */
final class Core {

	/**
	 * @var Core
	 */
	private static $instance;

	/**
	 * @return Core
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}

		return self::$instance;
	}

	public function __construct() {}

	/**
	 * Boot admin subsystems.
	 *
	 * @return void
	 */
	public function init() {
		$this->include_files();
		$this->setup_hooks();
	}

	/**
	 * Load all admin-only PHP files.
	 * None of these files have an Elementor dependency.
	 *
	 * @return void
	 */
	private function include_files() {

		/**
		 * Admin REST API + settings handlers.
		 * Not wrapped in is_admin() — REST requests bypass the admin flag.
		 */
		require_once SKY_ADDONS_INC_PATH . 'admin.php';
		require_once SKY_ADDONS_INC_PATH . 'admin/Classes/class-dashboard.php';
		require_once SKY_ADDONS_INC_PATH . 'admin/Classes/class-widgets-settings.php';
		require_once SKY_ADDONS_INC_PATH . 'admin/class-menu.php';
		require_once SKY_ADDONS_INC_PATH . 'admin/class-admin.php';
		new Admin();

		/**
		 * Custom Scripts CPT, REST endpoint, and frontend loader.
		 * Must register even without Elementor so the dashboard REST calls resolve.
		 */
		require_once SKY_ADDONS_INC_PATH . 'custom-scripts/class-custom-scripts-data.php';
		require_once SKY_ADDONS_INC_PATH . 'custom-scripts/class-custom-scripts-loader.php';

		if ( is_admin() ) {
			require_once SKY_ADDONS_INC_PATH . 'class-admin-feeds.php';
		}
	}

	/**
	 * Register admin-facing hooks.
	 *
	 * @return void
	 */
	private function setup_hooks() {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_styles' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_theme_builder_scripts' ] );
	}

	// -------------------------------------------------------------------------
	// Asset enqueuing
	// -------------------------------------------------------------------------

	/**
	 * React dashboard — CSS.
	 *
	 * @param string $hook_suffix
	 * @return void
	 */
	public function enqueue_admin_styles( $hook_suffix ) {
		if ( 'toplevel_page_sky-addons' !== $hook_suffix && 'sky-addons_page_sky-addons-pro' !== $hook_suffix ) {
			return;
		}
		wp_enqueue_style( 'wp-components' );
		wp_register_style( 'sky-addons', SKY_ADDONS_URL . 'build/admin/index.css', [], SKY_ADDONS_VERSION );
		wp_enqueue_style( 'sky-addons' );
	}

	/**
	 * React dashboard — JS + SkyAddonsConfig.
	 *
	 * @param string $hook_suffix
	 * @return void
	 */
	public function enqueue_admin_scripts( $hook_suffix ) {
		if ( 'toplevel_page_sky-addons' !== $hook_suffix ) {
			return;
		}

		$asset_file = SKY_ADDONS_PATH . 'build/admin/index.asset.php';
		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = include $asset_file;
		wp_register_script( 'sky-addons', SKY_ADDONS_URL . 'build/admin/index.js', $asset['dependencies'], $asset['version'], true );
		wp_enqueue_script( 'sky-addons' );
		wp_localize_script( 'sky-addons', 'SkyAddonsConfig', $this->localize_config() );
	}

	/**
	 * Theme Builder post editor — JS.
	 *
	 * @param string $hook
	 * @return void
	 */
	public function enqueue_theme_builder_scripts( $hook ) {
		//phpcs:ignore WordPress.PHP.StrictInArray
		if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ] ) ) {
			return;
		}
		global $post_type;
		if ( 'wowdevs-hooks' !== $post_type ) {
			return;
		}

		wp_register_script( 'wowdevs-hooks', SKY_ADDONS_URL . 'build/theme-builder/index.js', [], SKY_ADDONS_VERSION, true );
		wp_localize_script( 'wowdevs-hooks', 'SkyAddonsConfig', $this->localize_config() );
		wp_enqueue_script( 'wowdevs-hooks' );
	}

	/**
	 * Shared JS config passed to all admin React apps.
	 *
	 * @return array
	 */
	public function localize_config() {
		return [
			'web_url'     => esc_url( home_url() ),
			'ajax_url'    => esc_url( admin_url( 'admin-ajax.php' ) ),
			'rest_url'    => esc_url( rest_url() ),
			'version'     => SKY_ADDONS_VERSION,
			'plugin_name' => esc_html__( 'Sky Addons', 'sky-elementor-addons' ),
			'plugin_slug' => defined( 'SKY_ADDONS_SLUG' ) ? SKY_ADDONS_SLUG : '',
			'admin_url'   => esc_url( admin_url() ),
			'pro_version' => defined( 'SKY_ADDONS_PRO_VERSION' ) ? SKY_ADDONS_PRO_VERSION : '',
			'nonce'       => wp_create_nonce( 'sky_addons_nonce' ),
			'assets_url'  => SKY_ADDONS_ASSETS_URL,
			'logo'        => SKY_ADDONS_ASSETS_URL . 'images/sky-logo-gradient.png',
			'root_url'    => SKY_ADDONS_URL,
			'pro_init'    => apply_filters( 'sky_addons_pro_init', false ),
			'current_user' => [
				'domain'       => esc_url( home_url() ),
				'display_name' => wp_get_current_user()->display_name,
				'email'        => wp_get_current_user()->user_email,
				'id'           => wp_get_current_user()->ID,
				'avatar'       => get_avatar_url( wp_get_current_user()->ID ),
			],
		];
	}
}
