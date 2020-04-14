const sampleData = {
region: {
        name: "Africa",
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71
    },
    periodType: "days",
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
};

const covid19ImpactEstimator = (data) => {
    
    let r = {
        data: data,
        impact: getImpactEstimator(data),
        severeImpact: getSevereImpactEstimator(data)
    };

    //console.log(r);
    return r;
}

const getImpactEstimator = (data) => {
    let impact = {};

    impact.currentlyInfected = 
        covid19GetCurrentlyInfected(
            data.reportedCases
        );

    impact.infectionsByRequestedTime = 
        covid19GetInfectionsByRequestedTime(
            impact.currentlyInfected, 
            data.timeToElapse
        );
    
    impact.severeCasesByRequestedTime = 
        covid19GetSevereCasesByRequestedTime(
            impact.infectionsByRequestedTime
        );

    impact.hospitalBedsByRequestedTime = 
        covid19GetHospitalBedsByRequestedTime(
            data.totalHospitalBeds, 
            impact.severeCasesByRequestedTime
        );
    
    impact.casesForICUByRequestedTime = 
        covid19GetCasesForICUByRequestedTime(
            impact.infectionsByRequestedTime
        );
    
    impact.casesForVentilatorsByRequestedTime = 
        covid19GetCasesForVentilatorsByRequestedTime(
            impact.infectionsByRequestedTime
        );

    impact.casesForVentilatorsByRequestedTime = 
        covid19GetDollarsInFlight(
            impact.infectionsByRequestedTime, 
            data.region.avgDailyIncomeInUSD, 
            data.timeToElapse
        );
    return impact;
}

const getSevereImpactEstimator = (data) => {
    let impact = {};

    impact.currentlyInfected = 
        covid19GetCurrentlySevereInfected(
            data.reportedCases
        );

    impact.infectionsByRequestedTime = 
        covid19GetInfectionsByRequestedTime(
            impact.currentlyInfected, 
            getDays(data.timeToElapse)
        );
    
    impact.severeCasesByRequestedTime = 
        covid19GetSevereCasesByRequestedTime(
            impact.infectionsByRequestedTime
        );

    impact.hospitalBedsByRequestedTime = 
        covid19GetHospitalBedsByRequestedTime(
            data.totalHospitalBeds, 
            impact.severeCasesByRequestedTime
        );
    
    impact.casesForICUByRequestedTime = 
        covid19GetCasesForICUByRequestedTime(
            impact.infectionsByRequestedTime
        );
    
    impact.casesForVentilatorsByRequestedTime = 
        covid19GetCasesForVentilatorsByRequestedTime(
            impact.infectionsByRequestedTime
        );

    impact.casesForVentilatorsByRequestedTime = 
        covid19GetDollarsInFlight(
            impact.infectionsByRequestedTime, 
            data.region.avgDailyIncomeInUSD, 
            data.timeToElapse
        );
    return impact;
}

/*
* @param int num:   Number of days | weeks | or months given
* @param string period: This is can be set to days|weeks|months
* 
* Returns int days or 0 if periood not specified
*/
const getDays  = (num, period) => {
    if (period == "days") {
        return num;
    } else if (period == "weeks") {
        return num * 7;
    } else if (period == "months") {
        return num * 30;
    } else {
        return 0;
    }
}

/*
* Des: Gets reported cases and multiplies by 10 as estimate factor
* @param int reportedCases:   Number of reported cases
* 
* Returns int: Currently infected cases
*/
const covid19GetCurrentlyInfected = (reportedCases) => {
    return reportedCases * 10;
}

/*
* Des: Gets reported cases and multiplies by 50 as estimate factor
* @param int reportedCases:   Number of reported cases
* 
* Returns int: Currently infected cases
*/
const covid19GetCurrentlySevereInfected = (reportedCases) => {
    return reportedCases * 50;
}

/*
* Des: Gets infections by time based on period in days given
* @param int currentlyInfected:   Number of currently infected cased as calculated in 
*                                 covid19GetCurrentlyInfected | covid19GetCurrentlySevereInfected
* 
* Returns int: Infections by time
*/
const covid19GetInfectionsByRequestedTime = (currentlyInfected, period) => {
    let factor = Math.trunc(period/3);
    return (currentlyInfected * Math.round(Math.pow(2, factor)));
}

/*
* Des: Gets severe infections by time based on infection by time.
* @param int infectionsByRequestTime:   Number of currently infected by time returned in
*                                 covid19GetInfectionsByRequestedTime func.
* 
* Returns int: Infections by time
*/
const covid19GetSevereCasesByRequestedTime = (infectionsByRequestTime) => {
    return (infectionsByRequestTime * (15/100));
}

/*
* Des: Gets hospital bets bt the request time.
* @param int totalHospitalBeds: vailable hospital beds.
* @param int severeCasesByRequestedTime: Total severe cases
* 
* Returns int: available beds, negative means short in beds by this number
*/
const covid19GetHospitalBedsByRequestedTime = (totalHospitalBeds, severeCasesByRequestedTime) => {
    let available_beds = (35/100) * totalHospitalBeds;
    return Math.trunc(available_beds - severeCasesByRequestedTime);
}


/*
* Des: Gets cases in ICU by request time.
* @param int infectionsByRequestTime:   Number of currently infected by time returned in
*                                 covid19GetInfectionsByRequestedTime func.
* 
* Returns int: Infections by time
*/
const covid19GetCasesForICUByRequestedTime = (infectionsByRequestTime) => {
    return Math.trunc(infectionsByRequestTime * (5/100));
}

/*
* Des: Gets ventilators need by request time
* @param int infectionsByRequestTime:   Number of currently infected by time returned in
*                                 covid19GetInfectionsByRequestedTime func.
* 
* Returns int: ventilators
*/
const covid19GetCasesForVentilatorsByRequestedTime = (casesForICUByRequestedTime) => {
    return Math.trunc(casesForICUByRequestedTime * (2/100));
}

/*
* Des: Gets dollars inflight 
* @param int infectionsByRequestTime:   Number of currently infected by time returned in
*                                 covid19GetInfectionsByRequestedTime func.
* @param float dollars: This are US dollars earned in a day.
* @param int period: This is period in days.
* 
* Returns int: Infections by time
*/
const covid19GetDollarsInFlight = (infectionsByRequestTime, dollars, period) => {
    return (infectionsByRequestTime * (65/100) * dollars * period);
}

//covid19ImpactEstimator(sampleData);

module.exports = covid19ImpactEstimator;
//export default covid19ImpactEstimator;
