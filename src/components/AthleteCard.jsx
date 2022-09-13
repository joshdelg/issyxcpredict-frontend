import { Badge, Box, Flex, Stack, Text, Button } from "@chakra-ui/react";
import { getAthleteAverageTime, getAthleteGrade, getAthleteSR, getAthleteTime } from "../lib/athleteLibs";
import { secondsToReadable } from "../lib/timeLibs";

function AthleteCard(props) {

    const { selectedAthlete, season, meetData, mode } = props;

    return (
        <Flex alignItems="center" height="100%">
            <Box flex="1" m={2} p={4} backgroundColor="gray.100" rounded="md" boxShadow="md">
                <Flex direction="row" justifyContent="space-between" alignItems="center">
                    <Text fontSize="2xl">{selectedAthlete.name}<Badge ml={2} variant="subtle" colorScheme="green">{getAthleteGrade(selectedAthlete, season)}</Badge></Text>
                    <Text fontSize="2xl">{season}</Text>
                </Flex>
                <Text fontSize="lg">AId: {selectedAthlete.athleteId}</Text>
                <Text fontSize="lg">SR: {secondsToReadable(getAthleteSR(selectedAthlete, season))}</Text>
                <Text fontSize="lg">PR: {secondsToReadable(selectedAthlete.pr5k)}</Text>
                {
                    mode === "race2sr" ? (
                        <Text fontSize="lg">{`Time at ${meetData.name}: ${secondsToReadable(getAthleteTime(selectedAthlete, season, meetData.meetId))}`}</Text>
                    ) : (
                        <Text fontSize="lg">{/*Average Time: {secondsToReadable(getAthleteAverageTime(selectedAthlete, season))}*/}</Text>
                    )
                }
                <Flex justifyContent="end">
                    <Button variant="filled" size="sm" backgroundColor="teal">See athlete page</Button>
                </Flex>
            </Box>
        </Flex>
    );
}

export default AthleteCard;