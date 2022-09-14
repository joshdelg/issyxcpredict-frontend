export function getAthleteSR(athlete, season, cutoffMeetDate = undefined) {
    const races = athlete.results.find((s) => s.season == season).meets;
    // const cutoffMeetIndex = (cutoffMeetId !== undefined) ? races.findIndex((res) => res.meetId === cutoffMeetId) : races.length;
    const cutoffDate = (cutoffMeetDate !== undefined) ? cutoffMeetDate : Date.now();
    // console.log(cutoffDate);
    const races5k = races.filter((r) => r.distance === "5000 Meters" && r.time != 0 && Date.parse(r.date) < cutoffDate);
    if(races5k.length == 0) {
        return null
    };
    const sr = Math.min(...races5k.map((r) => r.time));
    return sr;
}

export function getAthleteTime(athlete, season, meetId) {
    const race = athlete.results.find((s) => s.season == season).meets.find((meet) => meet.meetId == meetId);
    return race.time;
}

export function getAthleteAverageTime(athlete, season, meetDistance, cutoffMeetDate = undefined) {
    // console.log(athlete.name)
    const races = athlete.results.find((s) => s.season == season).meets;
    // console.log(races);
    // console.log("cutoff meet data", cutoffMeetDate);
    const cutoffDate = (cutoffMeetDate !== undefined) ? cutoffMeetDate : Date.now();
    // console.log("CutoffDate in avgTime", (new Date(cutoffDate)).toDateString());
    const racesDist = races.filter((r) => r.distance === meetDistance && r.time != 0 && Date.parse(r.date) < cutoffDate);
    // console.log(athlete.name, "Cutoff date", (new Date(cutoffDate).toDateString()));
    // console.log("Last race used", races5k[races5k.length - 1].meetName, races5k[races5k.length - 1].date)
    if(racesDist.length == 0) {
        // console.log("No races of distance", meetDistance, "before", (new Date(cutoffDate)).toDateString());
        return null;
    ;}
    // console.log(races5k);
    const avgTime = racesDist.reduce((prev, curr) => prev + curr.time, 0) / racesDist.length;
    // console.log(avgTime);
    return avgTime;
}

export function getAthleteGrade(athlete, season) {
    return athlete.results.find((s) => s.season == season).grade;
}

export function getProgressionChartData(athlete, season, distance="5000 Meters") {
    console.log(athlete);
    const meets = athlete.results.find((s) => s.season == season).meets.filter((res) => res.distance === distance);
    return meets.map((res) => ({name: res.meetName, time: (res.time) ? res.time : null}));
}