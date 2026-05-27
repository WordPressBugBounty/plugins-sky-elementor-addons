<?php

namespace Sky_Addons\Modules\AdvancedSkillBars\Widgets;

use Elementor\Utils;
use Elementor\Controls_Manager;
use Elementor\Group_Control_Typography;
use Elementor\Group_Control_Background;
use Elementor\Group_Control_Box_Shadow;
use Elementor\Group_Control_Border;
use Elementor\Icons_Manager;
use Elementor\Repeater;
use Elementor\Widget_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Advanced_Skill_Bars extends Widget_Base {

	public function get_name() {
		return 'sky-advanced-skill-bars';
	}

	public function get_title() {
		return esc_html__( 'Advanced Skill Bars', 'sky-elementor-addons' );
	}

	public function get_icon() {
		return 'sky-icon-advanced-skill-bars';
	}

	public function get_categories() {
		return [ 'sky-elementor-addons' ];
	}

	public function get_keywords() {
		return [ 'sky', 'advanced', 'progress', 'bars', 'skills' ];
	}
	public function get_style_depends() {
		return [ 'sa-advanced-skill-bars' ];
	}
	public function get_script_depends() {
		return [ 'sa-advanced-skill-bars' ];
	}



	public function get_custom_help_url() {
		return 'https://skyaddons.com/docs/sky-addons/widgets/advanced-skills-bar/';
	}

	public function has_widget_inner_wrapper(): bool {
		return ! \Elementor\Plugin::$instance->experiments->is_feature_active( 'e_optimized_markup' );
	}

	protected function register_controls() {

		$this->start_controls_section(
			'section_advanced_skills',
			[
				'label' => esc_html__( 'Skill Bars', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			]
		);

		$repeater = new Repeater();

		$repeater->add_control(
			'skill_name',
			[
				'label'       => esc_html__( 'Skill Name', 'sky-elementor-addons' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => esc_html__( 'Design', 'sky-elementor-addons' ),
				'label_block' => true,
			]
		);

		$repeater->add_control(
			'skill_icon',
			[
				'label'       => esc_html__( 'Icon', 'sky-elementor-addons' ) . sky_addons_label_badge( 'new', '4.5.0' ),
				'type'        => Controls_Manager::ICONS,
				'skin'        => 'inline',
				'label_block' => false,
			]
		);

		$repeater->add_control(
			'skill_max_value',
			[
				'label'      => esc_html__( 'Skill Max Value', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ '%' ],
				'range'      => [
					'%' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'default'    => [
					'unit' => '%',
					'size' => 100,
				],
			]
		);

		$repeater->add_control(
			'skill_value',
			[
				'label'      => esc_html__( 'Skill Value (Out of 100)', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ '%' ],
				'range'      => [
					'%' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'default'    => [
					'unit' => '%',
					'size' => 80,
				],
			]
		);

		$repeater->add_control(
			'skill_item_customize',
			[
				'label'     => esc_html__( 'Customize ?', 'sky-elementor-addons' ),
				'type'      => Controls_Manager::SWITCHER,
				'separator' => 'before',
			]
		);

		$repeater->add_control(
			'base_color_item',
			[
				'label' => esc_html__( 'Base Color', 'sky-elementor-addons' ),
				'type'  => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sa-advanced-skills .sa-skill-item{{CURRENT_ITEM}} .sa-skill-progress' => 'background-color: {{VALUE}}',
				],
				'condition' => [
					'skill_item_customize' => 'yes',
				],
			]
		);

		$repeater->add_control(
			'fill_heading_item',
			[
				'label' => esc_html__( 'Fill Progress', 'sky-elementor-addons' ),
				'type'  => Controls_Manager::HEADING,
				'condition' => [
					'skill_item_customize' => 'yes',
				],
			]
		);

		$repeater->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name'     => 'fill_background_item',
				'label'    => esc_html__( 'Background', 'sky-elementor-addons' ),
				'types'    => [ 'classic', 'gradient' ],
				'selector' => '{{WRAPPER}} .sa-advanced-skills .sa-skill-item{{CURRENT_ITEM}} .sa-skill-progress-bar',
				'condition' => [
					'skill_item_customize' => 'yes',
				],
			]
		);

		$repeater->add_control(
			'name_color_item',
			[
				'label' => esc_html__( 'Skill Color', 'sky-elementor-addons' ),
				'type'  => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sa-skill-item{{CURRENT_ITEM}} .sa-skill-name' => 'color: {{VALUE}}',
				],
				'condition' => [
					'skill_item_customize' => 'yes',
				],
			]
		);

		$repeater->add_control(
			'value_color_item',
			[
				'label' => esc_html__( 'Percentage / Value Color', 'sky-elementor-addons' ),
				'type'  => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sa-skill-item{{CURRENT_ITEM}} .sa-skill-value' => 'color: {{VALUE}}',
				],
				'condition' => [
					'skill_item_customize' => 'yes',
				],
			]
		);

		$this->add_control(
			'skill_list',
			[
				'label'       => '',
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $repeater->get_controls(),
				'default'     => [
					[
						'skill_name' => esc_html__( 'HTML', 'sky-elementor-addons' ),
						'skill_value' => [
							'size' => 80,
							'unit' => '%',
						],
					],
					[
						'skill_name' => esc_html__( 'CSS', 'sky-elementor-addons' ),
						'skill_value' => [
							'size' => 90,
							'unit' => '%',
						],
					],
					[
						'skill_name' => esc_html__( 'JS', 'sky-elementor-addons' ),
						'skill_value' => [
							'size' => 65,
							'unit' => '%',
						],
					],
					[
						'skill_name' => esc_html__( 'PHP', 'sky-elementor-addons' ),
						'skill_value' => [
							'size' => 70,
							'unit' => '%',
						],
					],
					[
						'skill_name' => esc_html__( 'WordPress', 'sky-elementor-addons' ),
						'skill_value' => [
							'size' => 97,
							'unit' => '%',
						],
					],
				],
				'title_field' => '<# print((skill_name || skill_value.size) ? (skill_name || "Skill") + " - " + skill_value.size + skill_value.unit : "Skill - 0%") #>',
			]
		);

		$this->add_control(
			'skill_layout',
			[
				'label'     => esc_html__( 'Select Layout', 'sky-elementor-addons' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'default',
				'options'   => [
					'default' => esc_html__( 'Default', 'sky-elementor-addons' ),
					'vision'  => esc_html__( 'Vision', 'sky-elementor-addons' ),
				],
				'separator' => 'before',
			]
		);

		$this->add_control(
			'name_position',
			[
				'label'   => esc_html__( 'Name Position', 'sky-elementor-addons' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'inner',
				'options' => [
					'top'    => esc_html__( 'Top', 'sky-elementor-addons' ),
					'inner'  => esc_html__( 'Inner', 'sky-elementor-addons' ),
					'bottom' => esc_html__( 'Bottom', 'sky-elementor-addons' ),
				],
				'condition' => [
					'skill_layout' => 'default',
				],
			]
		);

		$this->add_control(
			'skill_val_position',
			[
				'label'   => esc_html__( 'Skill Value Position', 'sky-elementor-addons' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'inner',
				'options' => [
					'top'      => esc_html__( 'Top', 'sky-elementor-addons' ),
					'inner'    => esc_html__( 'Inner', 'sky-elementor-addons' ),
					'bottom'   => esc_html__( 'Bottom', 'sky-elementor-addons' ),
					'with-top' => esc_html__( 'With Top', 'sky-elementor-addons' ),
				],
				'condition' => [
					'skill_layout' => 'default',
				],
			]
		);

		$this->add_control(
			'display_direction',
			[
				'label'        => esc_html__( 'Display Direction', 'sky-elementor-addons' ),
				'type'         => Controls_Manager::SELECT,
				'default'      => 'inline',
				'options'      => [
					'inline'         => esc_html__( 'Inline', 'sky-elementor-addons' ),
					'column'         => esc_html__( 'Block', 'sky-elementor-addons' ),
					'column-reverse' => esc_html__( 'Block Reverse', 'sky-elementor-addons' ),
					'row-reverse'    => esc_html__( 'Inline reverse', 'sky-elementor-addons' ),
				],
				'selectors'    => [
					'{{WRAPPER}} .sa-style--vision' => 'flex-direction: {{VALUE}};',
				],
				'prefix_class' => 'sa-display-direction-',
				'condition'    => [
					'skill_layout' => 'vision',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_skill_additional',
			[
				'label' => esc_html__( 'Additional', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_control(
			'title_tag',
			[
				'label'     => esc_html__( 'Title HTML Tag', 'sky-elementor-addons' ),
				'type'      => Controls_Manager::SELECT,
				'default'   => 'h3',
				'options'   => sky_addons_title_tags(),
				'separator' => 'before',
			]
		);

		$this->add_control(
			'show_skill_icon',
			[
				'label'     => esc_html__( 'Show Skill Icon?', 'sky-elementor-addons' ) . sky_addons_label_badge( 'new', '4.5.0' ),
				'type'      => Controls_Manager::SWITCHER,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'show_value',
			[
				'label'   => esc_html__( 'Show Value?', 'sky-elementor-addons' ) . sky_addons_label_badge( 'new', '4.5.0' ),
				'type'    => Controls_Manager::SWITCHER,
				'default' => 'yes',
			]
		);

		$this->add_control(
			'value_prefix',
			[
				'label'     => esc_html__( 'Value Prefix', 'sky-elementor-addons' ) . sky_addons_label_badge( 'new', '4.5.0' ),
				'type'      => Controls_Manager::TEXT,
				'condition' => [ 'show_value' => 'yes' ],
			]
		);

		$this->add_control(
			'value_suffix',
			[
				'label'     => esc_html__( 'Value Suffix', 'sky-elementor-addons' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => '%',
				'condition' => [ 'show_value' => 'yes' ],
			]
		);

		$this->add_control(
			'anim_duration',
			[
				'label'     => esc_html__( 'Animation Duration (ms)', 'sky-elementor-addons' ) . sky_addons_label_badge( 'new', '4.5.0' ),
				'type'      => Controls_Manager::SLIDER,
				'range'     => [
					'px' => [
						'min'  => 100,
						'max'  => 5000,
						'step' => 100,
					],
				],
				'default'   => [
					'unit' => 'px',
					'size' => 2600,
				],
				'selectors' => [
					'{{WRAPPER}} .sa-skill-progress-bar' => '--sa-skill-bar-duration: {{SIZE}}ms;',
				],
				'separator' => 'before',
			]
		);

		$this->add_control(
			'anim_threshold',
			[
				'label'       => esc_html__( 'Trigger Threshold (%)', 'sky-elementor-addons' ),
				'type'        => Controls_Manager::SLIDER,
				'size_units'  => [ '%' ],
				'range'       => [
					'%' => [
						'min'  => 0,
						'max'  => 100,
						'step' => 5,
					],
				],
				'default'     => [
					'unit' => '%',
					'size' => 80,
				],
				'description' => esc_html__( 'How much of the item must be visible before the bar animates.', 'sky-elementor-addons' ),
			]
		);

		$this->add_control(
			'progress_bar_striped',
			[
				'label'        => esc_html__( 'Skill Bars Striped', 'sky-elementor-addons' ),
				'type'         => Controls_Manager::SWITCHER,
				'prefix_class' => 'progress-bar-striped-',
				'condition'    => [
					'rainbow_anim!' => 'yes',
				],
			]
		);

		$this->add_control(
			'progress_bar_animated',
			[
				'label'        => esc_html__( 'Skill Bars Animated', 'sky-elementor-addons' ),
				'type'         => Controls_Manager::SWITCHER,
				'prefix_class' => 'progress-bar-animated-',
				'condition'    => [
					'progress_bar_striped' => 'yes',
					'rainbow_anim!'        => 'yes',
				],
			]
		);

		$this->add_control(
			'rainbow_anim',
			[
				'label'        => esc_html__( 'Rainbow Animation', 'sky-elementor-addons' ),
				'type'         => Controls_Manager::SWITCHER,
				'prefix_class' => 'rainbow-anim-',
				'separator'    => 'before',
			]
		);

		$this->add_control(
			'rainbow_anim_speed',
			[
				'label' => esc_html__( 'Animation Speed (sec)', 'sky-elementor-addons' ),
				'type'  => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 1,
						'max' => 50,
					],
				],
				'selectors' => [
					'{{WRAPPER}}' => '--sky-rainbow-anim-speed: {{SIZE}}s;',
				],
				'condition' => [
					'rainbow_anim' => 'yes',
				],
			]
		);

		$this->add_control(
			'rainbow_colors',
			[
				'label'       => esc_html__( 'Rainbow Colors', 'sky-elementor-addons' ),
				'type'        => Controls_Manager::TEXTAREA,
				'placeholder' => 'Input your colors. example: red, #eee000, indigo',
				'default'     => 'red, green, blue, orange, yellow, indigo, violet',
				'selectors'   => [
					'{{WRAPPER}} .sa-advanced-skills .sa-skill-progress-bar' => 'background: linear-gradient(270deg, {{VALUE}} ); background-size: 300% 300%;',
				],
				'condition'   => [
					'rainbow_anim' => 'yes',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_skill_bars_style',
			[
				'label' => esc_html__( 'Skill Bars', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'content_align',
			[
				'label'       => esc_html__( 'Content Alignment', 'sky-elementor-addons' ),
				'type'        => Controls_Manager::CHOOSE,
				'label_block' => false,
				'options' => [
					'left'   => [
						'title' => esc_html__( 'Left', 'sky-elementor-addons' ),
						'icon'  => 'eicon-h-align-left',
					],
					'center' => [
						'title' => esc_html__( 'Center', 'sky-elementor-addons' ),
						'icon'  => 'eicon-h-align-center',
					],
					'right'  => [
						'title' => esc_html__( 'Right', 'sky-elementor-addons' ),
						'icon'  => 'eicon-h-align-right',
					],
				],
				'toggle'      => false,
				'selectors' => [
					'{{WRAPPER}} .sa-advanced-skills .sa-style--vision' => '{{VALUE}};',
				],
				'selectors_dictionary' => [
					'left'   => 'text-align: left;',
					'center' => 'text-align: center;',
					'right'  => 'text-align: right;',
				],
				'condition' => [
					'display_direction' => [ 'column', 'column-reverse' ],
					'skill_layout'      => 'vision',
				],
			]
		);

		$this->add_responsive_control(
			'skill_bars_height',
			[
				'label'      => esc_html__( 'Height', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors'  => [
					'{{WRAPPER}} .sa-advanced-skills .sa-skill-progress' => 'height: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'skill_bars_spacing',
			[
				'label'      => esc_html__( 'Space Between', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors'  => [
					'{{WRAPPER}} .sa-advanced-skills .sa-skill-item:not(:last-child)' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'skill_bars_border_radius',
			[
				'label'      => esc_html__( 'Border Radius', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .sa-advanced-skills .sa-skill-progress , {{WRAPPER}} .sa-advanced-skills .sa-skill-progress-bar' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name'     => 'box_shadow',
				'label'    => esc_html__( 'Box Shadow', 'sky-elementor-addons' ),
				'selector' => '{{WRAPPER}} .sa-advanced-skills .sa-skill-progress',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_progress_style',
			[
				'label' => esc_html__( 'Skill Bars (Progress)', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'base_color',
			[
				'label' => esc_html__( 'Base Color', 'sky-elementor-addons' ),
				'type'  => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sa-advanced-skills .sa-skill-progress' => 'background-color: {{VALUE}}',
				],
			]
		);

		$this->add_responsive_control(
			'base_padding',
			[
				'label'      => esc_html__( 'Padding', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .sa-advanced-skills .sa-skill-progress' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'fill_heading',
			[
				'label'     => esc_html__( 'Fill Progress', 'sky-elementor-addons' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name'     => 'fill_background',
				'label'    => esc_html__( 'Background', 'sky-elementor-addons' ),
				'types'    => [ 'classic', 'gradient' ],
				'selector' => '{{WRAPPER}} .sa-advanced-skills .sa-skill-progress-bar',
			]
		);

		$this->add_responsive_control(
			'fill_padding',
			[
				'label'      => esc_html__( 'Padding', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .sa-advanced-skills .sa-skill-progress-bar' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'fill_hover_heading',
			[
				'label'     => esc_html__( 'Fill Progress (Hover)', 'sky-elementor-addons' ) . sky_addons_label_badge( 'new', '4.5.0' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name'     => 'fill_background_hover',
				'label'    => esc_html__( 'Background', 'sky-elementor-addons' ),
				'types'    => [ 'classic', 'gradient' ],
				'selector' => '{{WRAPPER}} .sa-skill-item:hover .sa-skill-progress-bar',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_skill_content_style',
			[
				'label' => esc_html__( 'Skill Bars Content', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'name_heading',
			[
				'label' => esc_html__( 'Skill Name', 'sky-elementor-addons' ),
				'type'  => Controls_Manager::HEADING,
			]
		);

		$this->add_responsive_control(
			'name_spacing',
			[
				'label'      => esc_html__( 'Spacing', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
				],
				'selectors'  => [
					'{{WRAPPER}} .sa-advanced-skills' => '--sky-name-spacing: {{SIZE}}{{UNIT}};',
				],
				'condition'  => [
					'display_direction' => [ 'column', 'column-reverse' ],
					'skill_layout'      => 'vision',
				],
			]
		);

		$this->add_responsive_control(
			'name_width',
			[
				'label'      => esc_html__( 'Width', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', '%' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'default'    => [
					'unit' => 'px',
					'size' => 100,
				],
				'selectors'  => [
					'{{WRAPPER}} .sa-skill-name-wrapper' => 'min-width: {{SIZE}}{{UNIT}};',
				],
				'condition'  => [
					'display_direction' => [ 'inline', 'row-reverse' ],
				],
			]
		);

		$this->add_control(
			'name_color',
			[
				'label' => esc_html__( 'Color', 'sky-elementor-addons' ),
				'type'  => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sa-skill-name, {{WRAPPER}} .sa-skill-name-wrapper .sa-skill-icon' => 'color: {{VALUE}}',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name'     => 'name_typography',
				'label'    => esc_html__( 'Typography', 'sky-elementor-addons' ),
				'selector' => '{{WRAPPER}} .sa-skill-name',
			]
		);

		$this->add_control(
			'value_heading',
			[
				'label'     => esc_html__( 'Percentage / Value', 'sky-elementor-addons' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_responsive_control(
			'value_spacing',
			[
				'label'      => esc_html__( 'Spacing', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em' ],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
				],
				'selectors'  => [
					'{{WRAPPER}} .sa-advanced-skills' => '--sky-perc-spacing: {{SIZE}}{{UNIT}};',
				],
				'condition'  => [
					'display_direction' => [ 'column', 'column-reverse' ],
				],
			]
		);

		$this->add_control(
			'value_color',
			[
				'label' => esc_html__( 'Color', 'sky-elementor-addons' ),
				'type'  => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sa-skill-value' => 'color: {{VALUE}}',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name'     => 'value_typography',
				'label'    => esc_html__( 'Typography', 'sky-elementor-addons' ),
				'selector' => '{{WRAPPER}} .sa-skill-value',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_skill_icon_style',
			[
				'label'     => esc_html__( 'Icon', 'sky-elementor-addons' ) . sky_addons_label_badge( 'new', '4.5.0' ),
				'tab'       => Controls_Manager::TAB_STYLE,
				'condition' => [ 'show_skill_icon' => 'yes' ],
			]
		);

		$this->add_responsive_control(
			'skill_icon_size',
			[
				'label'      => esc_html__( 'Size', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', 'rem' ],
				'range'      => [
					'px' => [
						'min' => 6,
						'max' => 100,
					],
				],
				'selectors'  => [
					'{{WRAPPER}} .sa-skill-icon' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'skill_icon_color',
			[
				'label' => esc_html__( 'Color', 'sky-elementor-addons' ),
				'type'  => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .sa-skill-icon' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_responsive_control(
			'skill_icon_spacing',
			[
				'label'      => esc_html__( 'Spacing', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', 'rem' ],
				'default'    => [
					'unit' => 'px',
					'size' => 10,
				],
				'range'      => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
				],
				'selectors'  => [
					'{{WRAPPER}} .sa-skill-icon' => 'margin-inline-end: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_top_perc_style',
			[
				'label' => esc_html__( 'Value Position With Top', 'sky-elementor-addons' ),
				'tab'   => Controls_Manager::TAB_STYLE,
				'condition' => [
					'skill_layout'       => 'default',
					'skill_val_position' => 'with-top',
				],
			]
		);

		$this->add_control(
			'top_perc_rotate',
			[
				'label' => esc_html__( 'Rotate', 'sky-elementor-addons' ),
				'type'  => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => -360,
						'max' => 360,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .sa-advanced-skills' => '--sky-value-top-rotate: {{SIZE}}deg',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name'     => 'top_perc_background',
				'label'    => esc_html__( 'Background', 'sky-elementor-addons' ),
				'types'    => [ 'classic', 'gradient' ],
				'selector' => '{{WRAPPER}} .sa-skill-value.sa-value-top::before',
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name'     => 'top_perc_border',
				'label'    => esc_html__( 'Border', 'sky-elementor-addons' ),
				'selector' => '{{WRAPPER}} .sa-skill-value.sa-value-top::before',
			]
		);

		$this->add_responsive_control(
			'top_perc_border_radius',
			[
				'label'      => esc_html__( 'Border Radius', 'sky-elementor-addons' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .sa-skill-value.sa-value-top::before' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		// $this->add_control(
		// 'top_perc_color',         [
		// 'label'     => esc_html__('Color', 'sky-elementor-addons'),
		// 'type'      => Controls_Manager::COLOR,
		// 'selectors' => [
		// '{{WRAPPER}} .sa-skill-value.sa-value-top' => 'color: {{VALUE}}',
		// ],
		// ]
		// );

		$this->end_controls_section();
	}

	public function render_skill_name( $skill_name, $item = [] ) {
		$settings  = $this->get_settings_for_display();
		$show_icon = 'yes' === ( $settings['show_skill_icon'] ?? '' );
		?>
		<div class="sa-skill-name-wrapper">
			<?php
			if ( $show_icon && ! empty( $item['skill_icon']['value'] ) ) {
				echo '<span class="sa-skill-icon sa-icon-wrap">';
				Icons_Manager::render_icon( $item['skill_icon'], [ 'aria-hidden' => 'true' ] );
				echo '</span>';
			}
			printf(
				'<%1$s class="sa-skill-name">%2$s</%1$s>',
				esc_attr( Utils::validate_html_tag( $settings['title_tag'] ) ),
				esc_html( $skill_name )
			);
			?>
		</div>
		<?php
	}

	public function render_skill_value( $skill_value, $position = 's' ) {
		$settings = $this->get_settings_for_display();
		$prefix   = esc_html( $settings['value_prefix'] ?? '' );
		$suffix   = esc_html( $settings['value_suffix'] ?? '%' );
		printf(
			'<div class="sa-skill-value %1$s">%2$s%3$s%4$s</div>',
			esc_attr( $position ),
			$prefix,
			esc_html( $skill_value ),
			$suffix
		);
	}

	protected function render() {
		$settings = $this->get_settings_for_display();

		$skill_style        = $settings['skill_layout'];
		$name_position      = $settings['name_position'];
		$skill_val_position = $settings['skill_val_position'];
		$show_value         = 'yes' === ( $settings['show_value'] ?? 'yes' );

		$anim_duration  = ! empty( $settings['anim_duration']['size'] ) ? (int) $settings['anim_duration']['size'] : 2600;
		$anim_threshold = ! empty( $settings['anim_threshold']['size'] ) ? (float) $settings['anim_threshold']['size'] / 100 : 0.8;

		$this->add_render_attribute( 'wrapper', 'class', 'sa-advanced-skills' );
		$this->add_render_attribute( 'wrapper', 'data-settings', wp_json_encode( [
			'animDuration'  => $anim_duration,
			'animThreshold' => $anim_threshold,
			'valuePrefix'   => sanitize_text_field( $settings['value_prefix'] ?? '' ),
			'valueSuffix'   => sanitize_text_field( $settings['value_suffix'] ?? '%' ),
		] ) );
		?>
		<div <?php $this->print_render_attribute_string( 'wrapper' ); ?>>

			<?php
			foreach ( $settings['skill_list'] as $item ) :
				$skill_max_value = $item['skill_max_value']['size'];
				$skill_value     = $item['skill_value']['size'];
				$skill_name      = $item['skill_name'];

				$this->add_render_attribute( 'sa-skill-item', 'class', [
					'sa-skill-item',
					'elementor-repeater-item-' . $item['_id'],
				], true );
				?>

				<?php if ( $skill_style === 'default' ) : ?>
					<div <?php $this->print_render_attribute_string( 'sa-skill-item' ); ?>>

						<?php if ( $name_position === 'top' || $skill_val_position === 'top' ) : ?>
							<div class="sa-skill-content-wrapper sa-d-flex sa-justify-content-between sa-w-100">
								<?php
								if ( $name_position === 'top' ) {
									$this->render_skill_name( $skill_name, $item );
								}
								if ( $show_value && $skill_val_position === 'top' ) {
									$this->render_skill_value( $skill_value, 'sa-position-null' );
								}
								?>
							</div>
						<?php endif; ?>

						<div class="sa-skill-progress">
							<div class="sa-skill-progress-bar sa-px-2 sa-d-flex sa-align-items-center"
								data-width="<?php echo esc_attr( $skill_value ); ?>%"
								data-max-value="<?php echo esc_attr( $skill_max_value ); ?>">
								<?php if ( $name_position !== 'inner' && $skill_val_position === 'inner' ) : ?>
									<div class="sa-skill-content-wrapper sa-w-100 sa-text-end">
										<?php
										if ( $show_value ) {
											$this->render_skill_value( $skill_value, 'sa-position-null' );
										}
										?>
									</div>
								<?php elseif ( $name_position === 'inner' && $skill_val_position !== 'inner' ) : ?>
									<div class="sa-skill-content-wrapper">
										<?php
										$this->render_skill_name( $skill_name, $item );
										if ( $show_value && $skill_val_position === 'with-top' ) {
											$this->render_skill_value( $skill_value, 'sa-value-top' );
										}
										?>
									</div>
								<?php elseif ( $name_position === 'inner' && $skill_val_position === 'inner' ) : ?>
									<div class="sa-skill-content-wrapper sa-d-flex sa-justify-content-between sa-align-items-center sa-w-100">
										<?php
										$this->render_skill_name( $skill_name, $item );
										if ( $show_value ) {
											$this->render_skill_value( $skill_value, 'sa-position-null' );
										}
										?>
									</div>
								<?php elseif ( $show_value && $skill_val_position === 'with-top' ) : ?>
									<?php $this->render_skill_value( $skill_value, 'sa-value-top' ); ?>
								<?php endif; ?>
							</div>
						</div>

						<?php if ( $name_position === 'bottom' || $skill_val_position === 'bottom' ) : ?>
							<div class="sa-skill-content-wrapper sa-d-flex sa-justify-content-between sa-w-100">
								<?php
								if ( $name_position === 'bottom' ) {
									$this->render_skill_name( $skill_name, $item );
								}
								if ( $show_value && $skill_val_position === 'bottom' ) {
									$this->render_skill_value( $skill_value, 'sa-position-null' );
								}
								?>
							</div>
						<?php endif; ?>

					</div>

				<?php elseif ( $skill_style === 'vision' ) : ?>

					<?php
					$this->add_render_attribute( 'sa-skill-item-vision', 'class', [
						'sa-style--vision sa-skill-item sa-align-items-center sa-d-flex',
						'elementor-repeater-item-' . $item['_id'],
					], true );
					?>

					<div <?php $this->print_render_attribute_string( 'sa-skill-item-vision' ); ?>>
						<?php $this->render_skill_name( $skill_name, $item ); ?>
						<div class="sa-skill-progress">
							<div class="sa-skill-progress-bar sa-px-2"
								data-width="<?php echo esc_attr( $skill_value ); ?>%"
								data-max-value="<?php echo esc_attr( $skill_max_value ); ?>"></div>
						</div>
						<?php
						if ( $show_value ) {
							$this->render_skill_value( $skill_value, 'sa-position-null' );
						}
						?>
					</div>

				<?php endif; ?>

			<?php endforeach; ?>

		</div>
		<?php
	}
}
