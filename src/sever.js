const express = require('express');
const request = require('request');
const http = require('http');
const {config} = require('./config.js');
fs = require('fs');
const {messages} = require('./messages.js');
const covid19ImpactEstimator = require('./estimator.js');
const port = config.app_port;


//Handling Post requests
http.createServer((req, res) => {
	//console.log(req);
	let body = [];
    let startExecutionTime = process.hrtime();
	if (req.method === 'POST' && req.url === '/api/v1/on-covid-19/json') {

		//When an error occurs
		req.on('error', (err) => {
	    	console.error(err);
	    	//response.statusCode = 400;
	    	response.end();
	    	return_to_client(req, res, "ERROR", "405", msg, startExecutionTime);
	  	});

		req.on('data', (chunk) => {
		  body.push(chunk);
		}).on('end', () => {
			body = Buffer.concat(body).toString();
			var api_details = null;
			console.log("Request Body: "+body);
			//First parse the request body
			try {

				try {
					covid19_details = JSON.parse(body.trim());
				} catch(ex) {
					console.log("Exception"+ex);
					return_to_client(req, res, "ERROR", "400", '', startExecutionTime);
					return;
				}
                
                //Get covid using the estimator
                let covid19Estimate = covid19ImpactEstimator(covid19_details);
                res.setHeader("Content-Type", "application/json");
                return_to_client(req, res, "OK", "200", covid19Estimate, startExecutionTime);
				
				
			} catch (ex) {
				console.log("Exception"+ex);
				return_to_client(req, res, "ERROR", "405", '', startExecutionTime);
				return;
			}

		});
	} else if (req.method === 'POST' && req.url === '/api/v1/on-covid-19/xml') {
        if (req.method === 'POST' && req.url === '/api/v1/on-covid-19/xml') {

            //When an error occurs
            req.on('error', (err) => {
                console.error(err);
                //response.statusCode = 400;
                response.end();
                return_to_client(req, res, "ERROR", "405", msg, startExecutionTime);
              });
    
            req.on('data', (chunk) => {
              body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                var api_details = null;
                console.log("Request Body: "+body);
                //First parse the request body
                try {
    
                    try {
                        covid19_details = JSON.parse(body.trim());
                    } catch(ex) {
                        console.log("Exception"+ex);
                        return_to_client(req, res, "ERROR", "400", '', startExecutionTime);
                        return;
                    }
                    
                    //Get covid using the estimator
                    let covid19Estimate = covid19ImpactEstimator(covid19_details);
                    let r = return_to_client_for_xml(req, res, "OK", "200", covid19Estimate);
                    handleXMlResponse(req, res, r, startExecutionTime);
                    
                } catch (ex) {
                    console.log("Exception"+ex);
                    return_to_client(req, res, "ERROR", "405", '', startExecutionTime);
                    return;
                }
    
            });
        }
    } else if (req.method === 'GET' && req.url === '/api/v1/on-covid-19/log') {
        
        //When an error occurs
        req.on('error', (err) => {
            console.error(err);
            //response.statusCode = 400;
            response.end();
            return_to_client(req, res, "ERROR", "405", msg, startExecutionTime);
        });

        //Now return logs
        let logs = readLogFile();
        console.log(logs);
        
        res.write(logs);
        res.end();

        //let endExcutionTime = (new Date() - startExecutionTime);
        writeToLogFile(req.method+"\t\t"+req.url+"\t\t200\t\t"
            +Math.round(getDurationInMilliseconds(startExecutionTime))+"ms\n");
        
    } else {
		console.log("Resource not found:"+ req.url);
		return_to_client(req, res, "ERROR", "404", '', startExecutionTime);
	}

}).listen(port, () => console.log(`listening on port ${port}!`));

/*
* handle XML Response
*/
handleXMlResponse = (req, res, data, startExecutionTime) => {
    console.log(data.data.data);
    let xml_ = "<?xml version = '1.0'>"
        +"<Response>"
        +"<Status>"+data.status+"</Status>"
        +"<StatusCode>"+data.status_code+"</StatusCode>"
        +"<Data>"
            +"<Data>"
                +"<Region>"
                    +"<name>"+data.data.data.region.name+"</name>"
                    +"<avgAge>"+data.data.data.region.avgAge+"</avgAge>"
                    +"<avgDailyIncomeInUSD>"+data.data.data.region.avgDailyIncomeInUSD+"</avgDailyIncomeInUSD>"
                    +"<avgDailyIncomePopulation>"+data.data.data.region.avgDailyIncomePopulation+"</avgDailyIncomePopulation>"
                +"</Region>"
                +"<periodType>"+data.data.data.periodType+"</periodType>"
                +"<timeToElapse>"+data.data.data.timeToElapse+"</timeToElapse>"
                +"<reportedCases>"+data.data.data.reportedCases+"</reportedCases>"
                +"<population>"+data.data.data.population+"</population>"
                +"<totalHospitalBeds>"+data.data.data.totalHospitalBeds+"</totalHospitalBeds>"
            +"</Data>"
            +"<impact>"
                +"<currentlyInfected>"+data.data.impact.currentlyInfected+"</currentlyInfected>"
                +"<infectionsByRequestedTime>"+data.data.impact.infectionsByRequestedTime+"</infectionsByRequestedTime>"
                +"<severeCasesByRequestedTime>"+data.data.impact.severeCasesByRequestedTime+"</severeCasesByRequestedTime>"
                +"<hospitalBedsByRequestedTime>"+data.data.impact.hospitalBedsByRequestedTime+"</hospitalBedsByRequestedTime>"
                +"<casesForICUByRequestedTime>"+data.data.impact.casesForICUByRequestedTime+"</casesForICUByRequestedTime>"
            +"</impact>"
            +"<severeImpact>"
                +"<currentlyInfected>"+data.data.severeImpact.currentlyInfected+"</currentlyInfected>"
                +"<infectionsByRequestedTime>"+data.data.severeImpact.infectionsByRequestedTime+"</infectionsByRequestedTime>"
                +"<severeCasesByRequestedTime>"+data.data.severeImpact.severeCasesByRequestedTime+"</severeCasesByRequestedTime>"
                +"<hospitalBedsByRequestedTime>"+data.data.severeImpact.hospitalBedsByRequestedTime+"</hospitalBedsByRequestedTime>"
                +"<casesForICUByRequestedTime>"+data.data.severeImpact.casesForICUByRequestedTime+"</casesForICUByRequestedTime>"
            +"</severeImpact>"
        +"</Data>"
    +"</Response>";

    res.setHeader("Content-Type", "application/xml");
    res.write(xml_);
    res.end();
    //let endExcutionTime = (new Date() - startExecutionTime);
    writeToLogFile(req.method+"\t\t"+req.url+"\t\t200\t\t"
        +Math.round(getDurationInMilliseconds(startExecutionTime))+"ms\n");
}


/*
* Responds to the request back to client.
* @Param Object res: The response object.
* @Param String status: Can be set to OK or ERROR.
* @Param String status_code: This is the status code.
* @Param String message: This is the message you would like to return.
* 
* Returns void
*/
return_to_client = (req, res, status, status_code, message={}, startExecutionTime) =>{
	var message_ = "";
	if (message.length < 1) {
		message_ = messages['msg_'+status_code];
	} else {
		message_ = message;
	}
	res.write(JSON.stringify({
		status: status,
		status_code: status_code,
		data: message_
	}));
    res.end();
    //let endExcutionTime = (new Date() - startExecutionTime);
    writeToLogFile(req.method+"\t\t"+req.url+"\t\t"+status_code+"\t\t"
        +Math.round(getDurationInMilliseconds(startExecutionTime))+"ms\n");
}

return_to_client_for_xml = (req, res, status, status_code, message={}) =>{
	var message_ = "";
	if (message.length < 1) {
		message_ = messages['msg_'+status_code];
	} else {
		message_ = message;
	}
    
    return {
		status: status,
		status_code: status_code,
		data: message_
	};
}

writeToLogFile = (data) => {
    fs.appendFile(config.log_file, data, (err) => {
        if (err) {
            return;
        }
        console.log(err);
    });
}

readLogFile = () => {
    try {
        let content = fs.readFileSync(config.log_file, 'utf8');
        return content;
    } catch (ex) {
        console.log('Error: ', ex.stack);
        return "";
    }
    
}

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}
