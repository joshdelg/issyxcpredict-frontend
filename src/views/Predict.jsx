import { useState } from "react";
import { FormControl, FormLabel, Stack, RadioGroup, Radio, Box, Heading } from "@chakra-ui/react";
import RaceToSR from "../components/RaceToSR";
import AvgToRace from "../components/AvgToRace";

function Predict() {

    // Life cycle data
    const [isLoading, setIsLoading] = useState(false);
    const [predictionType, setPredictionType] = useState("avg2time");

    return (
        <Box>
            <Stack p={12}>
                <Heading fontSize="2xl">Predict</Heading>
                <FormControl>
                    <FormLabel>Choose a prediction type</FormLabel>
                    <RadioGroup value={predictionType} onChange={setPredictionType}>
                        <Stack direction="row">
                            <Radio value="avg2time">Avg Time (or SR) to Time on Race</Radio>
                            <Radio value="time2sr">Time on Race to SR</Radio>
                        </Stack>
                    </RadioGroup>
                </FormControl>
                {
                    (predictionType === "avg2time") ? (
                        <AvgToRace isLoading={isLoading} setIsLoading={setIsLoading} />
                    ) : (
                    <RaceToSR isLoading={isLoading} setIsLoading={setIsLoading} />
                    )
                }
            </Stack>
        </Box>
    );
}

export default Predict;