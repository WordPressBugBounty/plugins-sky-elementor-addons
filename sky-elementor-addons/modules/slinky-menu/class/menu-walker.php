<?php

namespace Sky_Addons\Modules\SlinkyMenu;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Menu_Walker extends \Walker_Nav_Menu {

	/** Set by start_el when the item is an ancestor of the current page; read by the next start_lvl call. */
	private $open_next_lvl = false;

	public function start_lvl( &$output, $depth = 0, $args = [] ) {
		$classes = apply_filters( 'nav_menu_submenu_css_class', [ 'sub-menu' ], $args, $depth );

		if ( $this->open_next_lvl ) {
			$classes[]           = 'active';
			$this->open_next_lvl = false;
		}

		$class_attr = ! empty( $classes ) ? sprintf( ' class="%s"', esc_attr( implode( ' ', $classes ) ) ) : '';
		$output    .= '<ul' . $class_attr . '>';
	}

	public function end_lvl( &$output, $depth = 0, $args = [] ) {
		$output .= '</ul>';
	}

	public function start_el( &$output, $item, $depth = 0, $args = [], $id = 0 ) {
		$args = apply_filters( 'nav_menu_item_args', $args, $item, $depth );

		$classes   = empty( $item->classes ) ? [] : (array) $item->classes;
		$classes[] = 'menu-item-' . $item->ID;

		if ( $args->walker->has_children ) {
			$classes[] = 'has-arrow';
		}

		if ( $item->current || $item->current_item_parent || $item->current_item_ancestor ) {
			$classes[] = 'current-menu-item';
		}

		if ( $item->current_item_ancestor ) {
			$this->open_next_lvl = true;
		}

		$class_names = implode( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
		$item_id     = apply_filters( 'nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth );

		$li_atts = [
			'id'    => ! empty( $item_id ) ? $item_id : '',
			'class' => ! empty( $class_names ) ? $class_names : '',
		];

		if ( $item->current || $item->current_item_parent || $item->current_item_ancestor ) {
			$li_atts['data-menu-active'] = '2';
		} elseif (
			! empty( $item->url ) &&
			preg_replace( '/#(.+)$/', '', $item->url ) === 'index.php' &&
			( is_home() || is_front_page() )
		) {
			$li_atts['data-menu-active'] = '2';
		}

		$li_attributes = '';
		foreach ( $li_atts as $attr => $value ) {
			if ( '' !== $value ) {
				$li_attributes .= sprintf( ' %s="%s"', esc_attr( $attr ), esc_attr( $value ) );
			}
		}

		$output .= '<li' . $li_attributes . '>';

		$atts           = [];
		$atts['target'] = ! empty( $item->target ) ? $item->target : '';
		$atts['rel']    = ! empty( $item->xfn ) ? $item->xfn : '';

		if ( '_blank' === $atts['target'] ) {
			$atts['rel'] = trim( $atts['rel'] . ' noopener noreferrer' );
		}

		$atts['href']         = ! empty( $item->url ) ? $item->url : '';
		$atts['aria-current'] = $item->current ? 'page' : '';

		if ( ! empty( $item->attr_title ) ) {
			$atts['title'] = $item->attr_title;
		}

		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

		$link_attributes = '';
		foreach ( $atts as $attr => $value ) {
			if ( false !== $value && '' !== $value ) {
				$value            = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
				$link_attributes .= ' ' . esc_attr( $attr ) . '="' . $value . '"';
			}
		}

		$title = apply_filters( 'the_title', $item->title, $item->ID );
		$title = apply_filters( 'nav_menu_item_title', $title, $item, $args, $depth );

		$item_output  = $args->before;
		$item_output .= '<a' . $link_attributes . '>';
		$item_output .= $args->link_before . $title . $args->link_after;
		$item_output .= '</a>';
		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}

	public function end_el( &$output, $item, $depth = 0, $args = [] ) {
		$output .= '</li>';
	}
}
