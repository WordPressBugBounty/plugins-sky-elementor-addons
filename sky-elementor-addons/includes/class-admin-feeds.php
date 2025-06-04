<?php

namespace Sky_Addons\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Admin Feeds
 */
class Admin_Feeds {

	private $settings;

	/**
	 * Admin_Feeds constructor.
	 */
	public function __construct( $settings ) {
		$this->settings = $settings;
		add_action( 'wp_dashboard_setup', [ $this, 'register_rss_feeds' ] );
	}

	/**
	 * Register RSS Feeds for Element Pack
	 */
	public function register_rss_feeds() {
		wp_add_dashboard_widget(
			'wowdevs-dashboard-overview',
			esc_html( $this->settings['feed_title'] ),
			[ $this, 'display_rss_feeds_content' ],
			null,
			null,
			'column4',
			'core'
		);
	}

	/**
	 * Display RSS Feeds Content
	 */
	public function display_rss_feeds_content() {
		$feeds = $this->get_remote_feeds_data();
		if ( is_array( $feeds ) ) {
			foreach ( $feeds as $feed ) {
				?>
				<div class="activity-block">
					<a href="<?php echo esc_url( $feed->demo_link ); ?>" target="_blank">
						<img src="<?php echo $feed->image; ?>" style="width:100%;min-height:240px;">
					</a>
					<p>
						<?php echo wp_kses_post( wp_trim_words( wp_strip_all_tags( $feed->content ), 50 ) ); ?>
			<a href="<?php echo esc_url( $feed->demo_link ); ?>" target="_blank">
				<?php esc_html_e( 'View Demo', $this->settings['text_domain'] ); ?>
			</a>
					</p>
				</div>
				<?php
			}
		}
		echo wp_kses_post( $this->get_rss_posts_data() );
	}

	/**
	 * Get Remote Feeds Data
	 *
	 * @return array|mixed
	 */
	private function get_remote_feeds_data() {
		$transient_key = $this->settings['transient_key'];
		$cached_data = get_transient( $transient_key );

		if ( ! empty( $cached_data ) ) {
			return json_decode( $cached_data );
		}

		$response = wp_remote_get( $this->settings['remote_feed_link'],
			array(
				'timeout' => 30,
				'headers' => array(
					'Accept' => 'application/json',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return [];
		}

		$response_body = wp_remote_retrieve_body( $response );
		set_transient( $transient_key, $response_body, 6 * HOUR_IN_SECONDS );

		return json_decode( $response_body );
	}

	/**
	 * Get RSS Posts Data
	 *
	 * @return string
	 */
	private function get_rss_posts_data() {
		$transient_key = $this->settings['transient_key'] . '_rss';
		$cached_data = get_transient( $transient_key );

		if ( ! empty( $cached_data ) ) {
			$rss_items = json_decode( $cached_data, true ); // Decode as associative array
		} else {
			include_once ABSPATH . WPINC . '/feed.php';

			$rss = fetch_feed( $this->settings['feed_link'] );

			if ( is_wp_error( $rss ) ) {
				return '<li>' . esc_html__( 'Items Not Found', $this->settings['text_domain'] ) . '.</li>';
			}

			$maxitems = $rss->get_item_quantity( 5 );
			$rss_items = $rss->get_items( 0, $maxitems );

			// Convert RSS items to a simpler array to avoid serialization issues
			$simplified_rss_items = array_map( function ( $item ) {
				return [
					'title'   => $item->get_title(),
					'link'    => $item->get_permalink(),
					'date'    => $item->get_date( 'U' ),
					'content' => $item->get_content(),
				];
			}, $rss_items );

			set_transient( $transient_key, json_encode( $simplified_rss_items ), 6 * HOUR_IN_SECONDS );
			$rss_items = $simplified_rss_items;
		}

		ob_start();
		?>
		<div class="rss-widget">
			<ul>
				<?php if ( empty( $rss_items ) ) : ?>
					<li><?php esc_html_e( 'Items Not Found', $this->settings['text_domain'] ); ?>.</li>
				<?php else : ?>
					<?php foreach ( $rss_items as $item ) : ?>
						<li>
							<a target="_blank" href="<?php echo esc_url( $item['link'] ); ?>"
								title="<?php echo esc_html( $item['date'] ); ?>">
								<?php echo esc_html( $item['title'] ); ?>
							</a>
							<span class="rss-date" style="display: block; margin: 0;">
								<?php echo esc_html( human_time_diff( $item['date'], current_time( 'timestamp' ) ) . ' ' . __( 'ago', $this->settings['text_domain'] ) ); ?>
							</span>
							<div class="rss-summary">
								<?php echo esc_html( wp_html_excerpt( $item['content'], 120 ) . ' [...]' ); ?>
							</div>
						</li>
					<?php endforeach; ?>
				<?php endif; ?>
			</ul>
		</div>
		<p class="community-events-footer" style="margin: 12px -12px 6px -12px; padding: 12px 12px 0px;">
			<?php
			foreach ( $this->settings['footer_links'] as $link ) {
				printf(
					'<a href="%s" target="_blank">%s <span class="screen-reader-text"> (opens in a new tab)</span><span aria-hidden="true" class="dashicons dashicons-external"></span></a>',
					esc_url( $link['url'] ),
					esc_html( $link['title'] )
				);

				if ( next( $this->settings['footer_links'] ) ) {
					echo ' | ';
				}
			}
			?>
		</p>
		<?php
		return ob_get_clean();
	}
}

$settings = array(
	'feed_title'       => 'Sky Addons for Elementor',
	'transient_key'    => 'wowdevs_feeds',
	'feed_link'        => 'https://wowdevs.com/feed',
	'remote_feed_link' => 'https://dashboard.wowdevs.com/wp-json/wowdevs/v1/products-feed/all?category=sky-addons',
	'text_domain'      => 'sky-elementor-addons',
	'footer_links'     => [
		[
			'url'   => 'https://wowdevs.com/blog/',
			'title' => 'Blog',
		],
		[
			'url'   => 'https://skyaddons.com/docs/',
			'title' => 'Docs',
		],
		[
			'url'   => 'https://skyaddons.com/pricing/',
			'title' => 'Get Pro',
		],
		[
			'url'   => 'https://skyaddons.com/changelog/',
			'title' => 'Changelog',
		],
	],
);

new Admin_Feeds( $settings );
