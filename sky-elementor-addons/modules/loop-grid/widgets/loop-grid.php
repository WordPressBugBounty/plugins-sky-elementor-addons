<?php

namespace Sky_Addons\Modules\LoopGrid\Widgets;

use Elementor\Controls_Manager;
use Elementor\Widget_Base;
use Elementor\Repeater;

use Sky_Addons\Traits\Global_Widget_Controls;
use Sky_Addons\Sky_Addons_Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Sky_Addons\Includes\Controls\GroupQuery\Group_Control;
use Sky_Addons\Includes\Controls\SelectInput\Dynamic_Select;

class Loop_Grid extends Widget_Base {

	use Group_Control;
	use Global_Widget_Controls;

	protected $item_link               = '';
	protected $item_id                 = '';
	protected $_query                  = null;
	private $counter                   = 0;
	private $cached_settings           = null;
	private $alternate_templates_cache = null;

	public function get_name() {
		return 'sky-loop-grid';
	}

	public function get_title() {
		return esc_html__( 'Loop Grid', 'sky-elementor-addons' );
	}

	public function get_icon() {
		return 'sky-icon-loop-grid';
	}

	public function get_categories() {
		return [ 'sky-elementor-addons' ];
	}

	public function get_keywords() {
		return [ 'loop', 'grid', 'post', 'query', 'archive', 'sky' ];
	}

	public function get_query() {
		return $this->_query;
	}

	/**
	 * Get cached settings to avoid multiple calls
	 */
	private function get_cached_settings() {
		if ( null === $this->cached_settings ) {
			$this->cached_settings = $this->get_settings_for_display();
		}
		return $this->cached_settings;
	}

	/**
	 * Get processed alternate templates with validation
	 */
	private function get_alternate_templates_cache() {
		if ( null === $this->alternate_templates_cache ) {
			$settings                        = $this->get_cached_settings();
			$this->alternate_templates_cache = [];

			if ( 'yes' === $settings['alternate_template'] && ! empty( $settings['alternate_templates'] ) ) {
				foreach ( $settings['alternate_templates'] as $alternate ) {
					if ( ! empty( $alternate['template_id'] ) ) {
						$this->alternate_templates_cache[] = [
							'template_id'     => $alternate['template_id'],
							'repeat_template' => ! empty( $alternate['repeat_template'] ) ? max( 1, (int) $alternate['repeat_template'] ) : 1,
							'show_once'       => $alternate['show_once'] ?? 'yes',
							'_id'             => $alternate['_id'] ?? '',
						];
					}
				}
			}
		}
		return $this->alternate_templates_cache;
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
				'label'           => __( 'Columns', 'sky-elementor-addons' ),
				'type'            => Controls_Manager::SELECT,
				'desktop_default' => 3,
				'tablet_default'  => 2,
				'mobile_default'  => 1,
				'options'         => [
					1  => '1',
					2  => '2',
					3  => '3',
					4  => '4',
					5  => '5',
					6  => '6',
					7  => '7',
					8  => '8',
					9  => '9',
					10 => '10',
					11 => '11',
					12 => '12',
				],
				'selectors'       => [
					'{{WRAPPER}} .sa-loop-grid' => 'display: grid; grid-row-gap: 16px; grid-column-gap: 16px; grid-template-columns: repeat({{SIZE}}, 1fr);',
				],
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
					'{{WRAPPER}} .sa-loop-grid' => 'grid-row-gap: {{SIZE}}{{UNIT}};',
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
					'{{WRAPPER}} .sa-loop-grid' => 'grid-column-gap: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'alternate_template',
			[
				'label'              => esc_html__( 'Apply an alternate template', 'sky-elementor-addons' ),
				'type'               => Controls_Manager::SWITCHER,
				'label_off'          => esc_html__( 'Off', 'sky-elementor-addons' ),
				'label_on'           => esc_html__( 'On', 'sky-elementor-addons' ),
				'condition'          => [
					'posts_per_page!' => 1,
					'template_id!'    => '',
				],
				'render_type'        => 'template',
				'frontend_available' => true,
				'separator'          => 'before',
			]
		);

		$repeater = new Repeater();

		$repeater->add_control(
			'template_id',
			[
				'label'              => __( 'Choose a template', 'sky-elementor-addons' ),
				'placeholder'        => __( 'Type and select template', 'sky-elementor-addons' ),
				'type'               => Dynamic_Select::TYPE,
				'label_block'        => true,
				'query_args'         => [
					'query' => 'elementor_dynamic_loop_template',
				],
				'frontend_available' => true,
			]
		);

		$repeater->add_control(
			'repeat_template',
			[
				'label'     => esc_html__( 'Position in grid', 'sky-elementor-addons' ),
				'type'      => Controls_Manager::NUMBER,
				'condition' => [
					'template_id!' => '',
				],
			]
		);

		$repeater->add_control(
			'repeat_template_note',
			[
				'type'            => Controls_Manager::RAW_HTML,
				'raw'             => esc_html__( 'Note: Repeat the alternate template once every chosen number of items.', 'sky-elementor-addons' ),
				'content_classes' => 'elementor-descriptor',
				'condition'       => [
					'template_id!' => '',
				],
			]
		);

		$repeater->add_control(
			'show_once',
			[
				'label'       => esc_html__( 'Apply Once', 'sky-elementor-addons' ),
				'type'        => Controls_Manager::SWITCHER,
				'default'     => 'yes',
				'label_off'   => esc_html__( 'No', 'sky-elementor-addons' ),
				'label_on'    => esc_html__( 'Yes', 'sky-elementor-addons' ),
				'condition'   => [
					'template_id!' => '',
				],
				'render_type' => 'template',
			]
		);

		$repeater->add_responsive_control(
			'column_span',
			[
				'label'     => esc_html__( 'Column Span', 'sky-elementor-addons' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => '1',
				'options'   => [
					'1'  => esc_html__( '1', 'sky-elementor-addons' ),
					'2'  => esc_html__( '2', 'sky-elementor-addons' ),
					'3'  => esc_html__( '3', 'sky-elementor-addons' ),
					'4'  => esc_html__( '4', 'sky-elementor-addons' ),
					'5'  => esc_html__( '5', 'sky-elementor-addons' ),
					'6'  => esc_html__( '6', 'sky-elementor-addons' ),
					'7'  => esc_html__( '7', 'sky-elementor-addons' ),
					'8'  => esc_html__( '8', 'sky-elementor-addons' ),
					'9'  => esc_html__( '9', 'sky-elementor-addons' ),
					'10' => esc_html__( '10', 'sky-elementor-addons' ),
					'11' => esc_html__( '11', 'sky-elementor-addons' ),
					'12' => esc_html__( '12', 'sky-elementor-addons' ),
				],
				'condition' => [
					'template_id!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} {{CURRENT_ITEM}}' => 'grid-column: span min( {{VALUE}}, var(--grid-columns) );',
				],
			]
		);

		$repeater->add_control(
			'column_span_note',
			[
				'type'            => Controls_Manager::RAW_HTML,
				'raw'             => esc_html__( 'Note: Item will span across a number of columns.', 'sky-elementor-addons' ),
				'content_classes' => 'elementor-descriptor',
				'condition'       => [
					'template_id!' => '',
				],
			]
		);

		$this->add_control(
			'alternate_templates',
			[
				'label'       => esc_html__( 'Alternate Templates', 'sky-elementor-addons' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $repeater->get_controls(),
				'condition'   => [
					'alternate_template' => 'yes',
				],
				'title_field' => esc_html__( 'Alternate Template', 'sky-elementor-addons' ),
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

		$this->start_controls_section(
			'section_additional',
			[
				'label' => esc_html__( 'Additional', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_control(
			'show_pagination',
			[
				'label'     => esc_html__( 'Show Pagination', 'sky-elementor-addons' ),
				'type'      => Controls_Manager::SWITCHER,
				'separator' => 'before',
			]
		);

		$this->end_controls_section();

		/*
		 * Global Pagination
		 *
		 */
		$this->register_post_pagination_controls_style();
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
		$template_id  = $this->get_current_template_id();
		$item_classes = $this->get_current_item_classes();

		if ( empty( $template_id ) ) {
			++$this->counter;
			return;
		}

		echo '<div class="sa-loop-item' . esc_attr( $item_classes ) . '">';

		// Add error handling for template rendering
		$content = Sky_Addons_Plugin::elementor()->frontend->get_builder_content_for_display( $template_id );
		if ( empty( $content ) && Sky_Addons_Plugin::elementor()->editor->is_edit_mode() ) {
			echo '<div class="elementor-alert elementor-alert-warning">' .
				esc_html__( 'Template not found or empty.', 'sky-elementor-addons' ) .
				'</div>';
		} else {
			echo $content;
		}

		echo '</div>';
		++$this->counter;
	}

	protected function get_current_template_id() {
		$settings            = $this->get_cached_settings();
		$template_id         = $settings['template_id'];
		$alternate_templates = $this->get_alternate_templates_cache();

		if ( ! empty( $alternate_templates ) ) {
			foreach ( $alternate_templates as $alternate ) {
				if ( 'yes' === $alternate['show_once'] ) {
					if ( ( $alternate['repeat_template'] - 1 ) === $this->counter ) {
						return $alternate['template_id'];
					}
				} elseif ( 0 === ( ( $this->counter + 1 ) % $alternate['repeat_template'] ) ) {
					return $alternate['template_id'];
				}
			}
		}

		return $template_id;
	}

	protected function get_current_item_classes() {
		$classes             = '';
		$alternate_templates = $this->get_alternate_templates_cache();

		if ( ! empty( $alternate_templates ) ) {
			foreach ( $alternate_templates as $alternate ) {
				$is_alternate = false;

				if ( 'yes' === $alternate['show_once'] ) {
					if ( ( $alternate['repeat_template'] - 1 ) === $this->counter ) {
						$is_alternate = true;
					}
				} elseif ( 0 === ( ( $this->counter + 1 ) % $alternate['repeat_template'] ) ) {
					$is_alternate = true;
				}

				if ( $is_alternate ) {
					$classes .= ' elementor-repeater-item-' . $alternate['_id'];
					break;
				}
			}
		}

		return $classes;
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

	public function render() {
		$settings = $this->get_settings_for_display();

		if ( ! empty( $settings['template_id'] ) ) :
			$this->add_render_attribute( 'grid', 'class', 'sa-loop-grid' );
			$this->add_render_attribute( 'grid', 'style', '--grid-columns: ' . ( isset( $settings['columns'] ) && ! empty( $settings['columns'] ) ? $settings['columns'] : 3 ) );
			?>
		<div <?php echo $this->get_render_attribute_string( 'grid' ); ?>>
			<?php $this->render_items(); ?>
		</div>
			<?php
			if ( 'yes' === $settings['show_pagination'] && function_exists( 'sky_addons_post_pagination' ) ) {
				$wp_query = $this->get_query();
				sky_addons_post_pagination( $wp_query, $this->get_id() );
			}
		endif;
		if ( empty( $settings['template_id'] ) && Sky_Addons_Plugin::elementor()->editor->is_edit_mode() && function_exists( 'sky_addons_alert_notice' ) ) {
			sky_addons_alert_notice( esc_html_x( 'Please select a template to display the loop grid.', 'Frontend', 'sky-elementor-addons' ) );
		}
	}
}
