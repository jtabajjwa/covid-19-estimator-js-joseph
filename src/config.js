const config = {
	app_port: 3000,/*This is the port on which the app will be accessed by client*/
	ip_white_list: [
		/*'localhost',
		'127.0.0.1',
		'127.0.0.1',
		'::1',
		'::ffff:127.0.0.1'*/
    ],
    log_file: "log.og"
	/*Specify the key file paths*/
	//server_cert: '/var/www/html/systems/keys/production/systems.syspearl.com.crt',
	//server_key: '/var/www/html/systems/keys/production/systems.syspearl.com.key',
}
module.exports = {config: config};