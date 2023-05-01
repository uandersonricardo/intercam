import React, { useContext } from "react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { AuthContext } from "../contexts/Auth";
 
const Dashboard: React.FC = () => {
  const { id, logout } = useContext(AuthContext);

  return (
    <Flex h="100vh" w="full" direction="column" align="center" justify="center">
      <Heading as="h1">Dashboard</Heading>
      <Text>{id}</Text>
      <Button colorScheme="blue" onClick={logout}>Sair</Button>
    </Flex>
  );
}
 
export default Dashboard;
