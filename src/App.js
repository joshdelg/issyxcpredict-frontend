import { Link, Outlet } from "react-router-dom";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
      <Flex justifyContent="space-between" alignItems="center" p={4} bg="purple.800" color="yellow.400">
        <Heading fontSize="3xl" letterSpacing={2}>IssyXC Predict</Heading>
        <Flex>
          <Text fontSize="xl" mr={4} _hover={{color: "yellow.500"}} transition="color 0.25s">
            <Link to="/home">Home</Link>
          </Text>
          <Text fontSize="xl" mr={4} _hover={{color: "yellow.500"}} transition="color 0.25s">
            <Link to="/predict">Predict</Link>
          </Text>
          <Text fontSize="xl" mr={4} _hover={{color: "yellow.500"}} transition="color 0.25s">
            <Link to="/dashboard">Dashboard</Link>
          </Text>
          <Text fontSize="xl" mr={4} _hover={{color: "yellow.500"}} transition="color 0.25s">
            <Link to="/scrape">Scrape</Link>
          </Text>
        </Flex>
      </Flex>
      <Box>
        <Outlet />
      </Box>
    </div>
  );
}

export default App;
