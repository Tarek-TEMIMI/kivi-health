<?php
/**
 * Plugin Name: Kivicare Customization
 * Description: Plugin de personnalisation pour modifier les fonctionnalités du plugin Kivicare Clinic Management System.
 * Version: 1.0
 * Author: Votre Nom
 * Text Domain: kivicare-customization
 * Domain Path: /languages
 */

// Désenregistrer les styles et scripts du plugin principal
function dequeue_kivicare_scripts() {
    wp_dequeue_script('kivicare-main-script');
    wp_dequeue_style('kivicare-main-style');
}
add_action('wp_enqueue_scripts', 'dequeue_kivicare_scripts', 100);

// Enregistrer vos propres styles et scripts
function enqueue_custom_scripts() {
    wp_enqueue_script('kivicare-custom-script', plugin_dir_url(__FILE__) . 'assets/js/validation.js', array('jquery'), '1.0.0', true);
    wp_enqueue_style('kivicare-custom-style', plugin_dir_url(__FILE__) . 'assets/css/validation.css', array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'enqueue_custom_scripts');

// Ajoutez d'autres hooks et fonctionnalités personnalisées selon vos besoins.
