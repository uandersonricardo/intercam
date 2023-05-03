import React, { useContext } from "react";
import { Button, Flex, Heading, Text, Container, Stack, Icon, Spacer } from "@chakra-ui/react";
import { AuthContext } from "../contexts/Auth";
import { HiUsers, HiVideoCamera } from "react-icons/hi";
import { Link } from "react-router-dom";
 
const Stats: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container maxW="container.xl" py={{ base: "6", md: "12" }} px={{ base: "4", sm: "8" }}>
      <Heading as="h1" fontSize={{ base: "2xl", md: "4xl" }}>Estatísticas</Heading>
    </Container>
  );
}
 
export default Stats;
