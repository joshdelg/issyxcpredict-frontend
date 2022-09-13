import { Box, Text, Flex, Tooltip, Badge } from "@chakra-ui/react";
import { secondsToReadable } from "../lib/timeLibs";

function PredictionCard(props) {

    const { selectedAthlete, meetIds, meetData, predictionModel, getPrediction } = props;

    return (
        <Box m={2} mx="auto" p={4} backgroundColor="gray.100" rounded="md" boxShadow="md" maxWidth="75%">
            <Box textAlign="center" m={4}>
                <Text fontSize="xl">{selectedAthlete.name} would run</Text>
                <Text fontSize="3xl">{secondsToReadable(getPrediction())}</Text>
                <Text fontSize="xl">at {meetData.name}</Text>
                <Tooltip label={`Using data from every racer at ${meetData.name}, a relationship was found between each athlete's average time before the meet and their time at the meet. ${selectedAthlete.name}'s average time before ${meetData.name} was then compared to other athletes' to predict ${(selectedAthlete.gender == "M" ? "his" : "her")} time.`}>
                    <Badge ml={2} as="u" variant="subtle" colorScheme="blue" rounded="md">How do you know?</Badge>
                </Tooltip>
            </Box>
            <Flex flexDirection="row" justifyContent="space-between">
                <Text fontSize="md">Model: {predictionModel.string}</Text>
                <Text fontSize="md">R^2: {predictionModel.r2} R: {Math.sqrt(predictionModel.r2)}</Text>
            </Flex>
        </Box>
    )
}

export default PredictionCard;