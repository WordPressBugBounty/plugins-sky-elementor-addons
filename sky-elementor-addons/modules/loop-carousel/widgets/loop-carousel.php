<?php

namespace Sky_Addons\Modules\LoopCarousel\Widgets;

use Elementor\Controls_Manager;
use Elementor\Widget_Base;
use Sky_Addons\Sky_Addons_Plugin;


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Sky_Addons\Includes\Controls\GroupQuery\Group_Control;
use Sky_Addons\Includes\Controls\SelectInput\Dynamic_Select;

use Sky_Addons\Traits\Global_Widget_Functions;
use Sky_Addons\Traits\Global_Widget_Controls;

use Sky_Addons\Traits\Global_Swiper_Controls;

class Loop_Carousel extends Widget_Base {

	use Group_Control;
	use Global_Widget_Controls;
	use Global_Widget_Functions;
	use Global_Swiper_Controls;

	protected $item_link = '';
	protected $item_id   = '';
	protected $_query    = null;
	private $counter     = 0;

	public function get_name() {
		return 'sky-loop-carousel';
	}

	public function get_title() {
		return esc_html__( 'Loop Carousel', 'sky-elementor-addons' );
	}

	public function get_icon() {
		return 'sky-icon-loop-carousel';
	}

	public function get_categories() {
		return [ 'sky-elementor-addons' ];
	}

	public function get_keywords() {
		return [ 'loop', 'carousel', 'post', 'slider', 'query', 'sky' ];
	}

	public function get_style_depends() {
		return [
			'swiper',
			'elementor-icons-fa-solid',
		];
	}

	public function get_script_depends() {
		if ( sky_addons_editor_mode() ) {
			return [ 'swiper', 'sky-addons-scripts' ];
		}
		return [ 'swiper', 'sa-loop-carousel' ];
	}

	public function get_query() {
		return $this->_query;
	}

	public function has_widget_inner_wrapper(): bool {
		return ! \Elementor\Plugin::$instance->experiments->is_feature_active( 'e_optimized_markup' );
	}

	protected function register_controls() {

		$this->start_controls_section(
			'section_counter_layout',
			[
				'label' => esc_html__( 'Layout', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_control(
			'template_id',
			[
				'label'       => __( 'Select Template', 'sky-elementor-addons' ),
				'placeholder' => __( 'Type and select template', 'sky-elementor-addons' ),
				'type'        => Dynamic_Select::TYPE,
				'label_block' => true,
				'query_args'  => [
					'query' => 'elementor_dynamic_loop_template',
				],
			]
		);

		$this->add_responsive_control(
			'columns',
			[
				'label'          => esc_html__( 'Columns', 'sky-elementor-addons' ),
				'type'           => Controls_Manager::SELECT,
				'options'        => [
					1 => esc_html__( '1 Column', 'sky-elementor-addons' ),
					2 => esc_html__( '2 Columns', 'sky-elementor-addons' ),
					3 => esc_html__( '3 Columns', 'sky-elementor-addons' ),
					4 => esc_html__( '4 Columns', 'sky-elementor-addons' ),
					5 => esc_html__( '5 Columns', 'sky-elementor-addons' ),
					6 => esc_html__( '6 Columns', 'sky-elementor-addons' ),
				],
				'default'        => 3,
				'tablet_default' => 2,
				'mobile_default' => 1,
				'render_type'    => 'template',
			]
		);

		$this->add_responsive_control(
			'row_gap',
			[
				'label'      => esc_html__( 'Row Gap', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
				],
				'default'    => [
					'size' => 16,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .sa-loop-carousel' => 'grid-row-gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'column_gap',
			[
				'label'      => esc_html__( 'Column Gap', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
				],
				'default'    => [
					'size' => 16,
					'unit' => 'px',
				],
				'selectors'  => [
					'{{WRAPPER}} .sa-loop-carousel' => 'grid-column-gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_post_query_builder',
			[
				'label' => __( 'Query', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			]
		);
		$this->register_query_builder_controls();

		$this->update_control(
			'posts_per_page',
			[
				'default' => 6,
			]
		);

		$this->end_controls_section();

		/**
		 * Global Carousel Settings
		 */

		$this->start_controls_section(
			'section_carousel_settings',
			[
				'label' => esc_html__( 'Carousel Settings', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			]
		);

		$this->register_carousel_settings_controls( 'loop-carousel' );

		$this->end_controls_section();

		/**
		 * Global Navigation Controls
		 */

		$this->start_controls_section(
			'section_carousel_navigation',
			[
				'label' => esc_html__( 'Navigation', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			]
		);

		$this->register_navigation_controls();

		$this->end_controls_section();

		/**
		 * Global Pagination Controls
		 */

		$this->start_controls_section(
			'section_carousel_pagination',
			[
				'label' => esc_html__( 'Pagination', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			]
		);

		$this->register_pagination_controls( 'loop-carousel' );

		$this->end_controls_section();

		/**
		 * Global Navigation Style Controls
		 */
		$this->register_navigation_style_controls( 'loop-carousel' );

		/**
		 * Global Pagination Controls
		 */
		$this->register_pagination_style_controls( 'loop-carousel' );
	}

	public function query_posts( $posts_per_page ) {

		$default = $this->getGroupControlQueryArgs();
		$args    = [];
		if ( $posts_per_page ) {
			$args['posts_per_page'] = $posts_per_page;
			$args['paged']          = max( 1, get_query_var( 'paged' ), get_query_var( 'page' ) );
		}
		$args         = array_merge( $default, $args );
		$this->_query = new \WP_Query( $args );
	}

	public function render_posts() {
		$settings = $this->get_settings_for_display();
		echo '<div class="sa-loop-item swiper-slide">';
		echo Sky_Addons_Plugin::elementor()->frontend->get_builder_content_for_display( $settings['template_id'] );
		echo '</div>';
		++$this->counter;
	}

	public function render_items() {
		$settings = $this->get_settings_for_display();
		$this->query_posts( $settings['posts_per_page'] );
		$query         = $this->get_query();
		$this->counter = 0;

		if ( empty( $query->found_posts ) ) {
			echo esc_html_x( 'posts not found', 'Frontend', 'sky-elementor-addons' );
		} else {
			if ( $query->in_the_loop ) {
				$this->item_link = get_permalink();
				$this->item_id   = get_the_ID();
				$this->render_posts();
			} else {
				while ( $query->have_posts() ) {
					$query->the_post();
					$this->item_link = get_permalink();
					$this->item_id   = get_the_ID();
					$this->render_posts();
				}
			}
			wp_reset_postdata();
		}
	}

	public function render_header() {
		$settings = $this->get_settings_for_display();
		$id       = 'sa-loop-carousel-' . $this->get_id();

		/**
		 * Global function
		 */
		$this->render_header_attributes( 'loop-carousel' );

		$this->add_render_attribute(
			[
				'carousel' => [
					'class' => [ 'sa-loop-carousel', 'sa-swiper-global-carousel' ],
					'id'    => $id,
				],
			]
		);

		?>

		<div <?php $this->print_render_attribute_string( 'carousel' ); ?>>
			<div class="swiper">
				<div class="swiper-wrapper">

			<?php
	}

	public function render() {
		$settings = $this->get_settings_for_display();

		if ( ! empty( $settings['template_id'] ) ) :
			$this->render_header();
			$this->render_items();
			/**
				* Global function
				*/
			$this->render_footer();
		endif;
		if ( empty( $settings['template_id'] ) && Sky_Addons_Plugin::elementor()->editor->is_edit_mode() && function_exists( 'sky_addons_alert_notice' ) ) {
			sky_addons_alert_notice( esc_html_x( 'Please select a template to display the loop grid.', 'Frontend', 'sky-elementor-addons' ) );
		}
	}
}
