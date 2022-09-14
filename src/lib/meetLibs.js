import { getAthleteAverageTime, getAthleteSR } from "./athleteLibs";
import { secondsToReadable } from "./timeLibs";

export function getMeetData(meetAthletes, meetId, meetSeason) {
    let srsSet = 0;
    let validAthletes = 0;

    const meetRes = meetAthletes[0].results.find((s) => s.season == meetSeason).meets.find((res) => res.meetId == meetId);

    meetAthletes.forEach((athlete) => {

        // Find all results from that season of same distance
        const seasonResults = athlete.results.find((s) => s.season == meetSeason).meets.filter((res) => res.distance == meetRes.distance);
        let minTime = 99999;
        
        // Iterate over results of distance (including those that have a 0 time)
        for(const res of seasonResults) {
            if(res.meetId === meetId) {
                if(res.time !== 0) {
                    validAthletes++;
                    if(res.time < minTime) srsSet++;
                }
                break;
            } else if(res.time !== 0) {
                minTime = Math.min(minTime, res.time);
            }
        }
    });

    const srPercent = srsSet / validAthletes;

    

    return {srsSet, srPercent, validAthletes, name: meetRes.meetName, distance: meetRes.distance, date: meetRes.date, season: meetSeason, meetId: meetId};
}

const computeMedian = (arr) => {
    return (arr.length % 2 == 0) ? (arr[arr.length / 2] + arr[(arr.length / 2) - 1]) / 2 : arr[Math.floor(arr.length / 2)];
}

export function getPredictionData(meetAthletes, season, meetId, meetDate, predictionMethod) {

    let predictionData = [];
    const meetRes = meetAthletes[0].results.find((s) => s.season == season).meets.find((res) => res.meetId == meetId);

    meetAthletes.forEach((athlete) => {
        try {
            let xStatistic = (predictionMethod === "avg") ? getAthleteAverageTime(athlete, season, meetRes.distance, meetDate) : getAthleteSR(athlete, season, meetDate);
            const timeOnCourse = athlete.results.find((s) => s.season == season).meets.find((res) => res.meetId == meetId && res.distance == meetRes.distance).time;
            // console.log(athlete.name, ":", xStatistic, timeOnCourse);

            if(xStatistic && timeOnCourse && xStatistic !== Infinity && timeOnCourse !== Infinity) predictionData.push([xStatistic, timeOnCourse]);
        } catch (e) {
            console.log(e);
        }
        
    })
    console.log("prediction Data", predictionData);

    predictionData.sort((a1, a2) => a1[0] - a2[0]);
    const xVals = predictionData.map(p => p[0]);

    const med = computeMedian(xVals);
    const q1 = computeMedian(xVals.slice(0, (xVals.length % 2 == 0) ? (xVals.length / 2) : Math.floor(xVals.length / 2)));
    const q3 = computeMedian(xVals.slice((xVals.length % 2 == 0) ? (xVals.length / 2) : Math.floor(xVals.length / 2) + 1), xVals.length);
    const iqr = q3 - q1;
    const upperOutlier = q3 + 1.5 * iqr;
    const modifiedData = predictionData.filter((d) => d[0] <= upperOutlier);
    console.log(`Bottom ${predictionData.length - modifiedData.length} outliers removed from data`);

    return modifiedData;
}


export function getPredictionMeetData(prevMeetAthletes, prevMeetSeason, prevMeetIds, gender, restrictToRace) {
    let predictionData = [];
    // console.log(prevMeetAthletes, prevMeetSeason, prevMeetIds.prevMeetId, restrictToRace);
    const meetRes = prevMeetAthletes[0].results.find((s) => s.season == prevMeetSeason).meets.find((res) => res.meetId == prevMeetIds.prevMeetId);
    prevMeetAthletes.forEach((athlete) => {
        // console.log("Getting data for athlete [", athlete, "]");
        // console.log("Using season", prevMeetSeason, "and Id", prevMeetIds);
        const courseEntry = athlete.results.find((s) => s.season == prevMeetSeason).meets.find((res) => res.meetId == prevMeetIds.prevMeetId);
        const timeOnCourse = courseEntry.time;
        // console.log("Time on course is:", secondsToReadable(timeOnCourse));
        const sr = getAthleteSR(athlete, prevMeetSeason);
        // console.log("Athlete SR is:", secondsToReadable(sr));

        if(athlete.gender === gender && (restrictToRace ? courseEntry.raceId == prevMeetIds.prevRaceId : true) && timeOnCourse && sr && timeOnCourse !== Infinity && sr !== Infinity) {
            predictionData.push([timeOnCourse, sr]);
            // console.log("Appended this athlete to the prediction data!");
        }
    })

    // Remove upper (slower) outliers from dataset

    predictionData.sort((a1, a2) => a1[0] - a2[0]);
    const xVals = predictionData.map((p) => p[0]);
    // console.log(xVals);
    const med = computeMedian(xVals);
    const q1 = computeMedian(xVals.slice(0, (xVals.length % 2 == 0) ? (xVals.length / 2) : Math.floor(xVals.length / 2)));
    const q3 = computeMedian(xVals.slice((xVals.length % 2 == 0) ? (xVals.length / 2) : Math.floor(xVals.length / 2) + 1), xVals.length);
    const iqr = q3 - q1;
    const upperOutlier = q3 + 1.5 * iqr;
    const modifiedData = predictionData.filter((d) => d[0] <= upperOutlier);
    console.log(`Bottom ${predictionData.length - modifiedData.length} outliers removed from data`);
    // console.log(prevMeetAthletes);
    // console.log(predictionData.slice(0, predictionData.length));
    return modifiedData;
}