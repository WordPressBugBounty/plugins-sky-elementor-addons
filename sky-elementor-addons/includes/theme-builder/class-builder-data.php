<?php

namespace Sky_Addons\ThemeBuilder;

defined( 'ABSPATH' ) || exit;

class Builder_Data {
	private static $instance = null;

	/**
	 * Theme builder meta keys copied when a template is cloned.
	 */
	const BUILDER_META_KEYS = [
		'wowdevs_theme_builder_type',
		'wowdevs_theme_builder_status',
		'wowdevs_theme_builder_hook',
		'wowdevs_theme_builder_hook_priority',
		'wowdevs_theme_builder',
		'wowdevs_theme_builder_display_on',
		'wowdevs_theme_builder_not_display_on',
		'wowdevs_theme_builder_display_special_pages',
		'wowdevs_theme_builder_not_display_special_pages',
		'wowdevs_theme_builder_display_custom_pages',
		'wowdevs_theme_builder_not_display_custom_pages',
		'wowdevs_theme_builder_display_roles',
	];

	/**
	 * Elementor design meta keys copied when a template is cloned.
	 * _elementor_css is intentionally excluded — it is a generated cache and
	 * would point the clone at the source post's stylesheet.
	 */
	const ELEMENTOR_META_KEYS = [
		'_elementor_edit_mode',
		'_elementor_template_type',
		'_elementor_version',
		'_elementor_page_settings',
		'_elementor_controls_usage',
	];

	private function __construct() {
		add_action( 'init', [ $this, 'registered_post_type' ] );
		add_action( 'rest_api_init', [ $this, 'register_rest_routes' ] );
	}

	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function __clone() {}

	public function __wakeup() {}

	public function registered_post_type() {
		$labels = [
			'name'               => __( 'Template Items', 'sky-elementor-addons' ),
			'singular_name'      => __( 'Template Item', 'sky-elementor-addons' ),
			'menu_name'          => __( 'Themes Builder', 'sky-elementor-addons' ),
			'name_admin_bar'     => __( 'Themes Builder', 'sky-elementor-addons' ),
			'add_new'            => __( 'Add New', 'sky-elementor-addons' ),
			'add_new_item'       => __( 'Add New Template', 'sky-elementor-addons' ),
			'new_item'           => __( 'New Template', 'sky-elementor-addons' ),
			'edit_item'          => __( 'Edit Template', 'sky-elementor-addons' ),
			'view_item'          => __( 'View Template', 'sky-elementor-addons' ),
			'all_items'          => __( 'All Templates', 'sky-elementor-addons' ),
			'search_items'       => __( 'Search Templates', 'sky-elementor-addons' ),
			'parent_item_colon'  => __( 'Parent Template:', 'sky-elementor-addons' ),
			'not_found'          => __( 'No Template found.', 'sky-elementor-addons' ),
			'not_found_in_trash' => __( 'No Template found in Trash.', 'sky-elementor-addons' ),
		];

		$args = [
			'labels'              => $labels,
			'description'         => __( 'Description.', 'sky-elementor-addons' ),
			'taxonomies'          => [],
			'hierarchical'        => false,
			'public'              => true,
			'show_in_menu'        => false,
			'show_ui'             => true,
			'show_in_admin_bar'   => true,
			'menu_position'       => null,
			'menu_icon'           => null,
			'publicly_queryable'  => true,
			'supports'            => [ 'title', 'editor', 'elementor', 'custom-fields' ],
			'exclude_from_search' => true,
			'has_archive'         => false,
			'query_var'           => true,
			'can_export'          => true,
			'rewrite'             => false,
			'show_in_nav_menus'   => false,
			'capability_type'     => 'post',
			'map_meta_cap'        => true,
			'capabilities'        => $this->admin_capabilities(),
			'show_in_rest'        => true,
		];

		register_post_type( 'wowdevs-hooks', $args );

		register_post_meta('wowdevs-hooks', 'wowdevs_theme_builder_type', [
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
			'auth_callback' => [ $this, 'meta_auth' ],
		]);

		register_post_meta('wowdevs-hooks', 'wowdevs_theme_builder_status', [
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
			'auth_callback' => [ $this, 'meta_auth' ],
		]);

		register_post_meta('wowdevs-hooks', 'wowdevs_theme_builder_hook', [
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
			'auth_callback' => [ $this, 'meta_auth' ],
		]);

		register_post_meta('wowdevs-hooks', 'wowdevs_theme_builder_hook_priority', [
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'number',
			'auth_callback' => [ $this, 'meta_auth' ],
		]);

		$meta_fields = [
			'wowdevs_theme_builder',
			'wowdevs_theme_builder_display_on',
			'wowdevs_theme_builder_not_display_on',
			'wowdevs_theme_builder_display_special_pages',
			'wowdevs_theme_builder_not_display_special_pages',
			'wowdevs_theme_builder_display_custom_pages',
			'wowdevs_theme_builder_not_display_custom_pages',
			'wowdevs_theme_builder_display_roles',
		];

		foreach ( $meta_fields as $meta_field ) {
			register_post_meta('wowdevs-hooks', $meta_field, [
				'show_in_rest' => [
					'schema' => [
						'type' => 'array',
						'items' => [
							'type' => 'object',
							'properties' => [
								'value' => [
									'type' => 'string',
								],
							],
						],
					],
				],
				'single'        => true,
				'type'          => 'object',
				'auth_callback' => [ $this, 'meta_auth' ],
			]);
		}
	}

	/**
	 * Capability map — restricts the wowdevs-hooks post type and its REST
	 * routes to administrators. Theme builder templates control site-wide
	 * header / footer / archive output, so management must stay admin-only.
	 *
	 * @return array
	 */
	private function admin_capabilities() {
		// Primitive caps only. The meta caps (edit_post / read_post / delete_post)
		// must NOT be listed here — with map_meta_cap => true WordPress maps them
		// to these primitives automatically. Listing them triggers a
		// "map_meta_cap was called incorrectly" notice in WP 6.1+.
		return [
			'edit_posts'             => 'manage_options',
			'edit_others_posts'      => 'manage_options',
			'edit_published_posts'   => 'manage_options',
			'edit_private_posts'     => 'manage_options',
			'publish_posts'          => 'manage_options',
			'read_private_posts'     => 'manage_options',
			'delete_posts'           => 'manage_options',
			'delete_others_posts'    => 'manage_options',
			'delete_published_posts' => 'manage_options',
			'delete_private_posts'   => 'manage_options',
			'create_posts'           => 'manage_options',
		];
	}

	/**
	 * Meta auth callback — only administrators may write theme builder meta.
	 *
	 * @return bool
	 */
	public function meta_auth() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Register custom REST routes for the theme builder.
	 */
	public function register_rest_routes() {
		register_rest_route( 'skyaddons/v1', '/clone-hook', [
			'methods'  => \WP_REST_Server::CREATABLE,
			'callback' => [ $this, 'clone_hook' ],
			'permission_callback' => function () {
				return current_user_can( 'manage_options' );
			},
			'args' => [
				'id' => [
					'required'          => true,
					'sanitize_callback' => 'absint',
				],
			],
		] );
	}

	/**
	 * Duplicate a wowdevs-hooks template — its content, theme builder meta and
	 * Elementor design — and return the new post in the REST edit-context shape
	 * so the React list can use it directly.
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function clone_hook( $request ) {
		$source_id = absint( $request->get_param( 'id' ) );
		$source    = get_post( $source_id );

		if ( ! $source || 'wowdevs-hooks' !== $source->post_type ) {
			return new \WP_Error( 'sky_invalid_template', __( 'Template not found.', 'sky-elementor-addons' ), [ 'status' => 404 ] );
		}

		$new_id = wp_insert_post( [
			'post_type'    => 'wowdevs-hooks',
			'post_title'   => $source->post_title . ' (Copy)',
			'post_status'  => 'publish',
			'post_content' => $source->post_content,
		], true );

		if ( is_wp_error( $new_id ) ) {
			return $new_id;
		}

		// Copy theme builder meta (preserves [{value}] arrays via maybe_unserialize).
		foreach ( self::BUILDER_META_KEYS as $key ) {
			$value = get_post_meta( $source_id, $key, true );
			if ( '' !== $value && null !== $value ) {
				update_post_meta( $new_id, $key, $value );
			}
		}

		// Copy Elementor design meta.
		foreach ( self::ELEMENTOR_META_KEYS as $key ) {
			$value = get_post_meta( $source_id, $key, true );
			if ( '' !== $value && null !== $value ) {
				update_post_meta( $new_id, $key, $value );
			}
		}

		// _elementor_data is a JSON string — re-slash so quotes/backslashes survive.
		$elementor_data = get_post_meta( $source_id, '_elementor_data', true );
		if ( ! empty( $elementor_data ) ) {
			update_post_meta( $new_id, '_elementor_data', wp_slash( $elementor_data ) );
		}

		// Return the new post shaped exactly like /wp/v2/wowdevs-hooks?context=edit items.
		$controller   = new \WP_REST_Posts_Controller( 'wowdevs-hooks' );
		$item_request = new \WP_REST_Request( 'GET' );
		$item_request->set_param( 'context', 'edit' );

		return $controller->prepare_item_for_response( get_post( $new_id ), $item_request );
	}
}

Builder_Data::instance();
