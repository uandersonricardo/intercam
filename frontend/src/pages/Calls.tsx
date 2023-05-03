import React, { useContext, useEffect, useState } from "react";
import { Button, Flex, Heading, Text, Container, Stack, Icon, Spacer, useToast, Spinner } from "@chakra-ui/react";
import { AuthContext } from "../contexts/Auth";
import { HiUsers, HiVideoCamera } from "react-icons/hi";
import { Link } from "react-router-dom";
import api from "../config/api";
import CardCall from "../components/CardCall";

const Calls: React.FC = () => {
  const { id, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [calls, setCalls] = useState([]);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);

    api.get(`/calls`, { params: { user: id }}).then((res) => {
      setCalls(res.data.calls);
      setLoading(false);
    }).catch((err) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      setLoading(false);
    });
  }, []);

  return (
    <Container maxW="container.xl" py={{ base: "6", md: "12" }} px={{ base: "4", sm: "8" }}>
      <Heading as="h1" mb={{ base: "4", md: "8" }} fontSize={{ base: "2xl", md: "4xl" }}>Chamadas</Heading>
      {loading ? (
        <Flex w="full" p="4" justify="center">
          <Spinner size={{ base: "sm", md: "md" }} color="teal.500" />
        </Flex>
      ) : (
        <>
          {calls.length === 0 ? (
            <Text fontSize={{ base: "md", md: "xl" }} fontWeight="medium" display="inline-flex" alignItems="center">
              <Icon as={HiVideoCamera} mr="2" color="teal.500" />
              Nenhuma chamada registrada
            </Text>
          ) : (
            <Stack pb="4" spacing={{ base: "4", md: "8" }}>
              {calls.map((call: any) => (
                <CardCall key={call.id} call={call} />
              ))}
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}

export default Calls;
