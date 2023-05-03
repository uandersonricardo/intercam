import React, { useContext, useEffect, useState } from "react";
import { Button, Flex, Heading, Text, Container, Stack, Icon, Spacer, useToast, Spinner, Avatar, Tooltip } from "@chakra-ui/react";
import { HiUsers, HiVideoCamera } from "react-icons/hi";
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/Auth";
import api from "../config/api";
import CardCall from "../components/CardCall";
import environment from "../config/environment";
 
const Dashboard: React.FC = () => {
  const { id, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [calls, setCalls] = useState([]);
  const [people, setPeople] = useState([]);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    api.get("/users/home", { params: { user: id } }).then((res) => {
      setCalls(res.data.calls);
      setPeople(res.data.people);
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
      <Heading as="h1" fontSize={{ base: "2xl", md: "4xl" }}>Bem-vindo, {user?.name || "usuário"}!</Heading>
      <Heading as="h5" fontSize={{ base: "md", md: "lg" }} fontWeight="medium">Seu interfone está ativo.</Heading>
      <Stack mt={{ base: "4", md: "8" }} spacing={{ base: "4", md: "8" }}>
        <Text fontSize={{ base: "md", md: "xl" }} fontWeight="medium" display="inline-flex" alignItems="center">
          <Icon as={HiVideoCamera} mr="2" color="teal.500" />
          Últimas chamadas
          <Spacer />
          <Button
            fontSize={"sm"}
            fontWeight={400}
            variant={"link"}
          >
            <Link to="/calls">
              Ver mais
            </Link>
          </Button>
        </Text>
        {loading ? (
          <Flex w="full" p="4" justify="center">
            <Spinner size={{ base: "sm", md: "md" }} color="teal.500" />
          </Flex>
        ) : (
          <>
            {calls.length > 0 ? (
              <>
                {calls.map((call: any) => (
                  <CardCall key={call.id} call={call} />
                ))}
              </>
            ) : (
              <Text w="full" align="center" color="gray.500" py={{ base: "6", md: "10" }}>
                Nenhuma chamada recente
              </Text>
            )}
          </>
        )}
        <Text fontSize={{ base: "md", md: "xl" }} fontWeight="medium" display="inline-flex" alignItems="center">
          <Icon as={HiUsers} mr="2" color="teal.500" />
          Pessoas
          <Spacer />
          <Button
            fontSize={"sm"}
            fontWeight={400}
            variant={"link"}
          >
            <Link to="/people">
              Ver mais
            </Link>
          </Button>
        </Text>
        {loading ? (
          <Flex w="full" p="4" justify="center">
            <Spinner size={{ base: "sm", md: "md" }} color="teal.500" />
          </Flex>
        ) : (
          <>
            {people.length > 0 ? (
              <Flex columnGap="4" rowGap="4" pb="4" flexWrap="wrap">
                {people.map((person: any) => (
                  <Tooltip key={person.id} label={person.name} aria-label="Tooltip">
                    <Avatar name={person.name} src={`${environment.API_URL}/${person.image}`} size={{ base: "lg", md: "xl" }} />
                  </Tooltip>
                ))}
              </Flex>
            ) : (
              <Text w="full" align="center" color="gray.500" py={{ base: "6", md: "10" }}>
                Nenhuma pessoa cadastrada
              </Text>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}
 
export default Dashboard;
