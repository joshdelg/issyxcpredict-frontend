import { Flex, Box, Text, Badge, Button } from "@chakra-ui/react";


function CourseCard(props) {

    const { meetAthletes, meetData } = props;

    return (
        <Flex alignItems="center" height="100%">
            <Box flex="1" m={2} p={4} backgroundColor="gray.100" rounded="md" boxShadow="md">
                <Flex direction="row" justifyContent="space-between" alignItems="center">
                    <Text fontSize="2xl">{meetData.name}<Badge ml={2} variant="subtle" colorScheme="green">{(new Date(meetData.date)).toDateString()}</Badge></Text>
                </Flex>
                <Text fontSize="lg">{meetAthletes.length} athletes</Text>
                <Text fontSize="lg">{meetData.validAthletes} valid times</Text>
                <Text fontSize="lg">{meetData.srsSet} SRs set</Text>
                <Text fontSize="lg">{Math.round(meetData.srPercent * 100)}% of athletes set an SR</Text>
                <Flex justifyContent="end">
                    <Button variant="filled" size="sm" backgroundColor="teal">See athlete page</Button>
                </Flex>
            </Box>
        </Flex>
    )
}

export default CourseCard;