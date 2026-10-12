<?php

namespace Sky_Addons\Includes;

/**
 * WPML_Init class
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
class WPML_Init {

	/**
	 * A reference to an instance of this class.
	 *
	 * @since 3.1.0
	 * @var   object
	 */
	private static $instance = null;

	/**
	 * Constructor for the class
	 */
	public function init() {

		// WPML String Translation plugin exist check
		if ( defined( 'WPML_ST_VERSION' ) ) {
			add_filter( 'wpml_elementor_widgets_to_translate', [ $this, 'add_translatable_nodes' ] );
		}
	}

	/**
	 * Load wpml required repeater class files.
	 *
	 * @return void
	 */
	public function load_wpml_modules() {

		include_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-modules.php';

		// Include all WPML module classes
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-advanced-accordion.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-advanced-skill-bars.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-advanced-slider.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-animated-heading.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-card.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-content-switcher.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-dual-button.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-image-compare.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-info-box.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-list-group.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-logo-carousel.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-fancy-testimonial.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-pdf-viewer.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-review.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-review-carousel.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-social-icons.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-step-flow.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-table.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-table-columns.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-team-member.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-testimonial.php';
		require_once SKY_ADDONS_INC_PATH . 'wpml/class-wpml-testimonial-carousel.php';
	}

	/**
	 * Add  translation nodes
	 *
	 * @param array $nodes_to_translate
	 * @return array
	 */
	public function add_translatable_nodes( $nodes_to_translate ) {

		$this->load_wpml_modules();

		// Advanced Accordion
		$nodes_to_translate['sky-advanced-accordion'] = [
			'conditions'        => [ 'widgetType' => 'sky-advanced-accordion' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Advanced_Accordion',
		];

		// Advanced Skill Bars
		$nodes_to_translate['sky-advanced-skill-bars'] = [
			'conditions'        => [ 'widgetType' => 'sky-advanced-skill-bars' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Advanced_Skill_Bars',
		];

		// Advanced Slider
		$nodes_to_translate['sky-advanced-slider'] = [
			'conditions'        => [ 'widgetType' => 'sky-advanced-slider' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Advanced_Slider',
		];

		// Animated Heading
		$nodes_to_translate['sky-animated-heading'] = [
			'conditions'        => [ 'widgetType' => 'sky-animated-heading' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Animated_Heading',
		];

		// Card
		$nodes_to_translate['sky-card'] = [
			'conditions'        => [ 'widgetType' => 'sky-card' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Card',
		];

		// Content Switcher
		$nodes_to_translate['sky-content-switcher'] = [
			'conditions'        => [ 'widgetType' => 'sky-content-switcher' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Content_Switcher',
		];

		// Dual Button
		$nodes_to_translate['sky-dual-button'] = [
			'conditions'        => [ 'widgetType' => 'sky-dual-button' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Dual_Button',
		];

		// Image Compare
		$nodes_to_translate['sky-image-compare'] = [
			'conditions'        => [ 'widgetType' => 'sky-image-compare' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Image_Compare',
		];

		// Info Box
		$nodes_to_translate['sky-info-box'] = [
			'conditions'        => [ 'widgetType' => 'sky-info-box' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Info_Box',
		];

		// List Group
		$nodes_to_translate['sky-list-group'] = [
			'conditions'        => [ 'widgetType' => 'sky-list-group' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_List_Group',
		];

		// Logo Carousel
		$nodes_to_translate['sky-logo-carousel'] = [
			'conditions'        => [ 'widgetType' => 'sky-logo-carousel' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Logo_Carousel',
		];

		// PDF Viewer
		$nodes_to_translate['sky-pdf-viewer'] = [
			'conditions'        => [ 'widgetType' => 'sky-pdf-viewer' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_PDF_Viewer',
		];

		// Review
		$nodes_to_translate['sky-review'] = [
			'conditions'        => [ 'widgetType' => 'sky-review' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Review',
		];

		// Social Icons
		$nodes_to_translate['sky-social-icons'] = [
			'conditions'        => [ 'widgetType' => 'sky-social-icons' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Social_Icons',
		];

		// Step Flow
		$nodes_to_translate['sky-step-flow'] = [
			'conditions'        => [ 'widgetType' => 'sky-step-flow' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Step_Flow',
		];

		// Two nodes for one widget: an integration class can only declare a
		// single items field, and the table has a head and a body repeater.
		$nodes_to_translate['sky-table-rows'] = [
			'conditions'        => [ 'widgetType' => 'sky-table' ],
			'fields'            => [
				'table_caption'      => [
					'field'       => 'table_caption',
					'type'        => esc_html__( 'Table: Caption', 'sky-elementor-addons' ),
					'editor_type' => 'LINE',
				],
				'search_placeholder' => [
					'field'       => 'search_placeholder',
					'type'        => esc_html__( 'Table: Search Placeholder', 'sky-elementor-addons' ),
					'editor_type' => 'LINE',
				],
			],
			'integration-class' => __NAMESPACE__ . '\\WPML_Table',
		];

		$nodes_to_translate['sky-table-columns'] = [
			'conditions'        => [ 'widgetType' => 'sky-table' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Table_Columns',
		];

		// Team Member
		$nodes_to_translate['sky-team-member'] = [
			'conditions'        => [ 'widgetType' => 'sky-team-member' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Team_Member',
		];

		// Testimonial
		$nodes_to_translate['sky-testimonial'] = [
			'conditions'        => [ 'widgetType' => 'sky-testimonial' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Testimonial',
		];

		// Fancy Testimonial
		$nodes_to_translate['sky-fancy-testimonial'] = [
			'conditions'        => [ 'widgetType' => 'sky-fancy-testimonial' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Fancy_Testimonial',
		];

		// Review Carousel
		$nodes_to_translate['sky-review-carousel'] = [
			'conditions'        => [ 'widgetType' => 'sky-review-carousel' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Review_Carousel',
		];

		// Testimonial Carousel
		$nodes_to_translate['sky-testimonial-carousel'] = [
			'conditions'        => [ 'widgetType' => 'sky-testimonial-carousel' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Testimonial_Carousel',
		];

		// Logo Grid (using logo carousel class)
		$nodes_to_translate['sky-logo-grid'] = [
			'conditions'        => [ 'widgetType' => 'sky-logo-grid' ],
			'fields'            => [],
			'integration-class' => __NAMESPACE__ . '\\WPML_Logo_Carousel',
		];

		// Generic Grid
		$nodes_to_translate['sky-generic-grid'] = [
			'conditions' => [ 'widgetType' => 'sky-generic-grid' ],
			'fields'     => [],
		];

		$nodes_to_translate['sky-post-list'] = [
			'conditions' => [ 'widgetType' => 'sky-post-list' ],
			'fields'     => [],
		];

		// Form-related widgets
		$form_widgets = [
			'sky-cf7',
			'sky-fluent-form',
			'sky-gravity-forms',
			'sky-wp-forms',
			'sky-ninja-forms',
			'sky-we-forms',
		];

		foreach ( $form_widgets as $widget ) {
			$nodes_to_translate[ $widget ] = [
				'conditions' => [ 'widgetType' => $widget ],
				'fields'     => [],
			];
		}

		// Carousel and slider widgets (using base carousel class)
		$carousel_widgets = [
			'sky-ultra-carousel',
			'sky-mate-carousel',
			'sky-sapling-carousel',
			'sky-luster-carousel',
			'sky-naive-carousel',
			'sky-fellow-slider',
			'sky-glory-slider',
			'sky-stellar-slider',
			'sky-panel-slider',
			'sky-momentum-slider',
			'sky-mate-slider',
		];

		foreach ( $carousel_widgets as $widget ) {
			$nodes_to_translate[ $widget ] = [
				'conditions' => [ 'widgetType' => $widget ],
				'fields'     => [],
			];
		}

		// Grid widgets (using base carousel class)
		$grid_widgets = [
			'sky-ultra-grid',
			'sky-sapling-grid',
			'sky-luster-grid',
		];

		foreach ( $grid_widgets as $widget ) {
			$nodes_to_translate[ $widget ] = [
				'conditions' => [ 'widgetType' => $widget ],
				'fields'     => [],
			];
		}

		// List widgets (using tidy list class)
		$list_widgets = [ 'sky-mate-list', 'sky-naive-list' ];

		foreach ( $list_widgets as $widget ) {
			$nodes_to_translate[ $widget ] = [
				'conditions' => [ 'widgetType' => $widget ],
				'fields'     => [],
			];
		}

		// Audio Player
		$nodes_to_translate['sky-audio-player'] = [
			'conditions' => [ 'widgetType' => 'sky-audio-player' ],
			'fields'     => [
				'track_title'  => [
					'field'       => 'track_title',
					'type'        => esc_html__( 'Audio Player: Track Title', 'sky-elementor-addons' ),
					'editor_type' => 'LINE',
				],
				'track_artist' => [
					'field'       => 'track_artist',
					'type'        => esc_html__( 'Audio Player: Track Artist', 'sky-elementor-addons' ),
					'editor_type' => 'LINE',
				],
			],
		];

		// Widgets translated through plain config: top-level fields, and repeater
		// fields through WPML's native 'fields_in_item'.
		foreach ( $this->get_field_config() as $widget => $config ) {
			if ( ! isset( $nodes_to_translate[ $widget ] ) ) {
				$nodes_to_translate[ $widget ] = [
					'conditions' => [ 'widgetType' => $widget ],
					'fields'     => [],
				];
			}

			foreach ( isset( $config['fields'] ) ? $config['fields'] : [] as $name => $field ) {
				$nodes_to_translate[ $widget ]['fields'][ $name ] = $this->to_wpml_field( $name, $field );
			}

			foreach ( isset( $config['items'] ) ? $config['items'] : [] as $items => $fields ) {
				foreach ( $fields as $name => $field ) {
					// In 'fields_in_item' a string key means a sub-key of the item field (a link's url),
					// so plain fields go in as a list.
					if ( 'LINK' === $field[1] ) {
						$nodes_to_translate[ $widget ]['fields_in_item'][ $items ][ $name ] = $this->to_wpml_field( $name, $field );
					} else {
						$nodes_to_translate[ $widget ]['fields_in_item'][ $items ][] = $this->to_wpml_field( $name, $field );
					}
				}
			}
		}

		// Runs over every node, WPML's own included (their 'integration-class' can be an array or an object).
		foreach ( $nodes_to_translate as $widget_type => &$config ) {
			if ( ! isset( $config['fields'] ) || ! is_array( $config['fields'] ) ) {
				$config['fields'] = [];
			}

			// Non-repeater classes become plain node fields, which WPML translates natively.
			$class = isset( $config['integration-class'] ) ? $config['integration-class'] : '';
			if ( is_string( $class ) && 0 === strpos( $class, __NAMESPACE__ ) && is_subclass_of( $class, __NAMESPACE__ . '\\WPML_Module_Without_Items' ) ) {
				$config['fields'] = array_merge( $config['fields'], ( new $class() )->get_node_fields() );
				unset( $config['integration-class'] );
			}
		}
		unset( $config );

		return $nodes_to_translate;
	}

	/**
	 * Translatable controls of widgets without an integration class.
	 *
	 * Format: widgetType => [ 'fields' => [ control => [ title, editor type ] ],
	 *                         'items'  => [ repeater => [ control => [ title, editor type ] ] ] ].
	 * Editor types: LINE, AREA, VISUAL, LINK.
	 *
	 * @return array
	 */
	private function get_field_config() {
		return [
			'sky-changelog' => [
				'fields' => [
					'load_more_text' => [ esc_html__( 'Changelog: Load More Text', 'sky-elementor-addons' ), 'LINE' ],
					'support_label' => [ esc_html__( 'Changelog: Support Label', 'sky-elementor-addons' ), 'LINE' ],
					'support_url' => [ esc_html__( 'Changelog: Support URL', 'sky-elementor-addons' ), 'LINK' ],
				],
			],
			'sky-team-member-carousel' => [
				'fields' => [
					'posts_button_text' => [ esc_html__( 'Team Member Carousel: Button Text', 'sky-elementor-addons' ), 'LINE' ],
				],
				'items'  => [
					'member_list' => [
						'name' => [ esc_html__( 'Team Member Carousel: Name', 'sky-elementor-addons' ), 'AREA' ],
						'job_title' => [ esc_html__( 'Team Member Carousel: Job Title', 'sky-elementor-addons' ), 'LINE' ],
						'text' => [ esc_html__( 'Team Member Carousel: Short Text', 'sky-elementor-addons' ), 'AREA' ],
						'button_text' => [ esc_html__( 'Team Member Carousel: Button Text', 'sky-elementor-addons' ), 'LINE' ],
						'link' => [ esc_html__( 'Team Member Carousel: Link', 'sky-elementor-addons' ), 'LINK' ],
					],
				],
			],
			'sky-tidy-list' => [
				'fields' => [
					'text_more' => [ esc_html__( 'Tidy List: Read More Text', 'sky-elementor-addons' ), 'LINE' ],
				],
				'items'  => [
					'list' => [
						'list_title' => [ esc_html__( 'Tidy List: Title', 'sky-elementor-addons' ), 'LINE' ],
						'list_text' => [ esc_html__( 'Tidy List: List Text', 'sky-elementor-addons' ), 'AREA' ],
						'list_link' => [ esc_html__( 'Tidy List: List Link', 'sky-elementor-addons' ), 'LINK' ],
					],
				],
			],
			'sky-video-player' => [
				'fields' => [
					'chapters_text' => [ esc_html__( 'Video Player: Timestamps', 'sky-elementor-addons' ), 'AREA' ],
					'schema_name' => [ esc_html__( 'Video Player: Title', 'sky-elementor-addons' ), 'LINE' ],
					'schema_description' => [ esc_html__( 'Video Player: Description', 'sky-elementor-addons' ), 'AREA' ],
				],
				'items'  => [
					'chapters' => [
						'chapter_label' => [ esc_html__( 'Video Player: Chapter Label', 'sky-elementor-addons' ), 'LINE' ],
					],
				],
			],
			'sky-whatsapp-button' => [
				'fields' => [
					'button_text' => [ esc_html__( 'WhatsApp Button: Button Text', 'sky-elementor-addons' ), 'LINE' ],
					'popup_title' => [ esc_html__( 'WhatsApp Button: Popup Title', 'sky-elementor-addons' ), 'LINE' ],
					'popup_greeting' => [ esc_html__( 'WhatsApp Button: Greeting Message', 'sky-elementor-addons' ), 'AREA' ],
					'cta_text' => [ esc_html__( 'WhatsApp Button: Chat Button Text', 'sky-elementor-addons' ), 'LINE' ],
					'tooltip_text' => [ esc_html__( 'WhatsApp Button: Tooltip Text', 'sky-elementor-addons' ), 'LINE' ],
					'online_text' => [ esc_html__( 'WhatsApp Button: Online Status Text', 'sky-elementor-addons' ), 'LINE' ],
					'offline_text' => [ esc_html__( 'WhatsApp Button: Offline Status Text', 'sky-elementor-addons' ), 'LINE' ],
					'offline_chat_text' => [ esc_html__( 'WhatsApp Button: Offline Chat Button Text', 'sky-elementor-addons' ), 'LINE' ],
					'offline_cta_text' => [ esc_html__( 'WhatsApp Button: Offline Button Text', 'sky-elementor-addons' ), 'LINE' ],
					'offline_url' => [ esc_html__( 'WhatsApp Button: Offline Link', 'sky-elementor-addons' ), 'LINK' ],
				],
				'items'  => [
					'agents' => [
						'agent_name' => [ esc_html__( 'WhatsApp Button: Agent Name', 'sky-elementor-addons' ), 'LINE' ],
						'agent_role' => [ esc_html__( 'WhatsApp Button: Role', 'sky-elementor-addons' ), 'LINE' ],
						'agent_message' => [ esc_html__( 'WhatsApp Button: Pre-filled Message', 'sky-elementor-addons' ), 'AREA' ],
					],
				],
			],
			'sky-advanced-skill-bars' => [
				'fields' => [
					'value_prefix' => [ esc_html__( 'Advanced Skill Bars: Value Prefix', 'sky-elementor-addons' ), 'LINE' ],
					'value_suffix' => [ esc_html__( 'Advanced Skill Bars: Value Suffix', 'sky-elementor-addons' ), 'LINE' ],
				],
			],
			'sky-advanced-slider' => [
				'fields' => [
					'read_more_text' => [ esc_html__( 'Advanced Slider: Read More Text', 'sky-elementor-addons' ), 'LINE' ],
					'button_text' => [ esc_html__( 'Advanced Slider: Button Text', 'sky-elementor-addons' ), 'LINE' ],
				],
			],
			'sky-fancy-testimonial' => [
				'fields' => [
					'read_more_text' => [ esc_html__( 'Fancy Testimonial: Read More Label', 'sky-elementor-addons' ), 'LINE' ],
					'read_less_text' => [ esc_html__( 'Fancy Testimonial: Read Less Label', 'sky-elementor-addons' ), 'LINE' ],
				],
			],
			'sky-glory-slider' => [
				'items'  => [
					'video_list' => [
						'title' => [ esc_html__( 'Glory Slider (Image / Video): Title', 'sky-elementor-addons' ), 'AREA' ],
						'credit' => [ esc_html__( 'Glory Slider (Image / Video): Credit / Subtitle', 'sky-elementor-addons' ), 'LINE' ],
						'credit_url' => [ esc_html__( 'Glory Slider (Image / Video): Credit URL', 'sky-elementor-addons' ), 'LINK' ],
					],
				],
			],
			'sky-list-group' => [
				'fields' => [
					'text_more' => [ esc_html__( 'List Group: Read More Text', 'sky-elementor-addons' ), 'LINE' ],
				],
			],
			'sky-momentum-slider' => [
				'fields' => [
					'button_text' => [ esc_html__( 'Momentum Slider: Button Text', 'sky-elementor-addons' ), 'LINE' ],
				],
				'items'  => [
					'momentum_list' => [
						'slider_title' => [ esc_html__( 'Momentum Slider: Title', 'sky-elementor-addons' ), 'LINE' ],
						'slider_subtitle' => [ esc_html__( 'Momentum Slider: Subtitle', 'sky-elementor-addons' ), 'LINE' ],
						'slider_link' => [ esc_html__( 'Momentum Slider: Slider Link', 'sky-elementor-addons' ), 'LINK' ],
					],
				],
			],
			'sky-naive-carousel' => [
				'fields' => [
					'button_text' => [ esc_html__( 'Naive Carousel: Button Text', 'sky-elementor-addons' ), 'LINE' ],
				],
			],
			'sky-naive-list' => [
				'fields' => [
					'button_text' => [ esc_html__( 'Naive List: Button Text', 'sky-elementor-addons' ), 'LINE' ],
				],
			],
			'sky-ultra-carousel' => [
				'fields' => [
					'button_text' => [ esc_html__( 'Ultra Carousel: Button Text', 'sky-elementor-addons' ), 'LINE' ],
				],
			],
			'sky-ultra-grid' => [
				'fields' => [
					'button_text' => [ esc_html__( 'Ultra Grid: Button Text', 'sky-elementor-addons' ), 'LINE' ],
				],
			],
			'sky-stellar-slider' => [
				'fields' => [
					'button_text' => [ esc_html__( 'Stellar Blog Slider: Read More Button Text', 'sky-elementor-addons' ), 'LINE' ],
				],
			],
			'sky-panel-slider' => [
				'fields' => [
					'button_text' => [ esc_html__( 'Panel Slider: Button Text', 'sky-elementor-addons' ), 'LINE' ],
				],
				'items'  => [
					'slider_list' => [
						'title' => [ esc_html__( 'Panel Slider: Title', 'sky-elementor-addons' ), 'AREA' ],
						'text' => [ esc_html__( 'Panel Slider: Text', 'sky-elementor-addons' ), 'VISUAL' ],
						'link' => [ esc_html__( 'Panel Slider: Link', 'sky-elementor-addons' ), 'LINK' ],
					],
				],
			],
			'sky-social-icons' => [
				'fields' => [
					'separator_text' => [ esc_html__( 'Social Icons: Custom Separator', 'sky-elementor-addons' ), 'LINE' ],
				],
			],
			'sky-team-member' => [
				'fields' => [
					'name' => [ esc_html__( 'Team Member: Name', 'sky-elementor-addons' ), 'AREA' ],
					'job_title' => [ esc_html__( 'Team Member: Job Title', 'sky-elementor-addons' ), 'LINE' ],
					'text' => [ esc_html__( 'Team Member: Short Text', 'sky-elementor-addons' ), 'AREA' ],
					'button_text' => [ esc_html__( 'Team Member: Button Text', 'sky-elementor-addons' ), 'LINE' ],
					'link' => [ esc_html__( 'Team Member: Link', 'sky-elementor-addons' ), 'LINK' ],
				],
			],
			'sky-table' => [
				'fields' => [
					'html_rows' => [ esc_html__( 'Table: Table Rows', 'sky-elementor-addons' ), 'AREA' ],
				],
			],
		];
	}

	/**
	 * Converts a get_field_config() entry into WPML's field format.
	 *
	 * @param string $name  Control name.
	 * @param array  $field [ title, editor type ].
	 * @return array
	 */
	private function to_wpml_field( $name, $field ) {
		return [
			'field'       => 'LINK' === $field[1] ? 'url' : $name,
			'field_id'    => $name, // Unique string name; every LINK's 'field' is 'url'.
			'type'        => $field[0],
			'editor_type' => $field[1],
		];
	}

	/**
	 * Returns the instance.
	 *
	 * @since  3.1.0
	 * @return object
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
}
