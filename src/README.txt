Prerequisites
==============================
To run the application, ensure that the following conditions have been satisfied:
1. NPM and nodeJs have been installed on your platform. See https://nodejs.org/en/
2. Ensure that forever module has been installed. See https://www.npmjs.com/package/forever


Starting the Server
===================================================
1. cd into the application root directory.
2. Edit the config file config.js
2.2. Ensure that you set the right database credentials for the merchant database.
2.3. Choose a port on which this application shall run. The details is 3000. Ensure this port is open on firwall. Set this in the config file.
2.4. Under users list, ensure that the client who is allowed to access the application is included in the list.
2.5. Ensure that the client's IP address is also included on the IP whitelist.

3. Decide and choose appropriate log files, including the ERROR, LOGOUT and OUTFILE
4. Now run: forever start -o "./logs/debug.log" -e "./logs/errors.log" server.js
5. Now test the application by accessing the browser and use the URL: http://host:post to see what's return. If an error occurs, then the server is not started and is not running at this port.
6. To stop the server, run: forever stop index.js