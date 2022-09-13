import { Heading, Text, Box } from "@chakra-ui/react";
import { CartesianGrid, Dot, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getProgressionChartData } from "../lib/athleteLibs";
import { secondsToReadable } from "../lib/timeLibs";

function AthleteProgression(props) {
    const { selectedAthlete, season, predIndex, setPredIndex } = props;
    
    const data = getProgressionChartData(selectedAthlete, season);
    const diff = selectedAthlete.results.find((s) => s.season == season).meets.length - data.length;

    const CustomDot = (props) => {
        return (
            props.index == predIndex - diff ? <Dot {...props} strokeWidth={3} stroke='#D69E2E' fill="#D69E2E" /> : <Dot {...props}/>
        )
    }

    return (
        <Box margin={4} p={4} border="1px" borderRadius="md" borderColor="gray.200">
            <Heading size="lg">{selectedAthlete.name}'s Progression</Heading>
            <ResponsiveContainer width="100%" aspect={9/4}>
                <LineChart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}}>
                    <Line type="monotone" dataKey="time" stroke="#44337A" dot={<CustomDot />}/>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" interval={"preserveStart"} angle={0}/>
                    <YAxis type="number" domain={[dataMin => Math.round((dataMin - 10) / 10) * 10, dataMax => Math.round((dataMax + 10) / 10) * 10]} tickFormatter={(value) => secondsToReadable(value)}/>
                    <Tooltip formatter={(value) => secondsToReadable(value)}/>
                </LineChart>
            </ResponsiveContainer>
        </Box>
    )
}

export default AthleteProgression;