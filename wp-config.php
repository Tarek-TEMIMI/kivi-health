<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'kivi-telemed' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'EyD r@3sX~iqs$/*,dw=H xzhm>-$EQED^Xn4FM4p,#-t|,n9pQ_I||I|2Fq[W-,' );
define( 'SECURE_AUTH_KEY',  '!:& !Y/+J8SmuZV<v|3$L+hg(/d0*~fFKy~Y,JeGN!/a!lLk/_?HqgKE;O0{b-sj' );
define( 'LOGGED_IN_KEY',    'FkCL2xXcc~z`ETK;U5v^.i;YU<]7~)eKdX2vDc)nQE]:T}CBc&_P:xEk)V66qV}~' );
define( 'NONCE_KEY',        'aYprKXksS+txiE`of5TL#!%KRx8?s,oT5eI7ffrSr96]pM@#YR9WW/_Jb@7AzPgk' );
define( 'AUTH_SALT',        's{|ZGJ1gT*)jST{5JB.1 =]&?^oRQ+@yS!fJ u)j7JE-SC2]Lxz38nQgrLg_3n7{' );
define( 'SECURE_AUTH_SALT', ']BZ%wjL9/^F?`(.@ }mHWL8UNDZ<_XEiO6HBy39t<)XL.GCyN@D@!vHuovYdo:TK' );
define( 'LOGGED_IN_SALT',   'Hndk:YpN3{7{VF$eu!;-E9<R!<:+y)a@wNe5NA}Jzj,oCzTsLc!GRm=,+R?Ao16o' );
define( 'NONCE_SALT',       '|u2<xl.w)A$cSM9qAS/YOj$<%5f`_.kFLtLW6k+5T2O^;D!=8%ZiltukP!Dq9js<' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
