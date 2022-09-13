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

export function getAthleteAverageTime(athlete, season, cutoffMeetDate = undefined) {
    // console.log(athlete.name)
    const races = athlete.results.find((s) => s.season == season).meets;
    // console.log(races);
    // console.log("cutoff meet data", cutoffMeetDate);
    const cutoffDate = (cutoffMeetDate !== undefined) ? cutoffMeetDate : Date.now();
    // console.log("CutoffDate in avgTime", cutoffDate);
    const races5k = races.filter((r) => r.distance === "5000 Meters" && r.time != 0 && Date.parse(r.date) < cutoffDate);
    console.log(athlete.name, "Cutoff date", (new Date(cutoffDate).toDateString()));
    // console.log("Last race used", races5k[races5k.length - 1].meetName, races5k[races5k.length - 1].date)
    if(races5k.length == 0) {
        return null
    ;}
    // console.log(races5k);
    const avgTime = races5k.reduce((prev, curr) => prev + curr.time, 0) / races5k.length;
    // console.log(avgTime);
    return avgTime;
}

export function getAthleteGrade(athlete, season) {
    return athlete.results.find((s) => s.season == season).grade;
}

export function getProgressionChartData(athlete, season, distance="5000 Meters") {
    const meets = athlete.results.find((s) => s.season == season).meets.filter((res) => res.distance === distance);
    return meets.map((res) => ({name: res.meetName, time: (res.time) ? res.time : null}));
}