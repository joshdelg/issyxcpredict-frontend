import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import PerformanceCard from "./PerformanceCard";

function AthletePerformance(props) {

    const { selectedAthlete, season, predIndex, setPredIndex } = props;

    
    
    return (
        <Box m={4} p={4} border="1px" borderRadius="md" borderColor="gray.200">
            <Box my={4}>
                <Heading size="lg">{selectedAthlete.name}'s Performance</Heading>
                <Heading size="md">Predicted vs. Actual Performance on Meets</Heading>
            </Box>
            <Flex width="100%" justifyContent="center">
                <Flex direction="row" alignItems="center" justifyContent="center" width="75%">
                    <IconButton icon={<ArrowBackIcon />} onClick={() => setPredIndex(predIndex - 1)} isDisabled={predIndex == 0} />
                    <Box flex="1">
                        <PerformanceCard predIndex={predIndex} selectedAthlete={selectedAthlete} season={season} />
                    </Box>
                    <IconButton icon={<ArrowForwardIcon />} onClick={() => setPredIndex(predIndex + 1)} isDisabled={predIndex == selectedAthlete.results.find((s) => s.season == season).meets.length - 1} />
                </Flex>
            </Flex>
        </Box>
    );
}

export default AthletePerformance;