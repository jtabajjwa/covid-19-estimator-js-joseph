const messages = {
	msg_400: "Couldn't parse the JSON data in the body of your request. Refer to API description",
	msg_401: "Authentication failed. Check your Username and password.",
	msg_402: "Missing JSON parameter %s detected.",
	msg_403: "Signature verification vailed. Please refer to API document for how to sign your data. Ensure that you are using the right private key.",
	msg_404: "Resource %s not found.",
	msg_405: "Internal error occured. Contact an admin for further help.",
	msg_406: "Your IP address (%s) is not whitelisted. Contact an administrator to sort this out.",
	msg_407: "Crypto for open SSL not supported or it's not enabled.",
	msg_408: "Error occured on connecting to external systems.",
	msg_409: "Couldn't determine the error",
};
module.exports = {messages: messages}