import React from "react";
import { Button, Flex, Icon, Spacer, Text } from "@chakra-ui/react";
import { HiCheckCircle, HiClock, HiExclamationCircle, HiXCircle } from "react-icons/hi";
import { formatDate } from "../utils/date";
import { Link } from "react-router-dom";

interface CardCallProps {
  call: Record<string, any>;
}
 
const CardCall: React.FC<CardCallProps> = ({ call }) => {
  if (call.answer === null) {
    return (
      <Link to={`/calls/${call.id}`}>
        <Button display="flex" w="full" h="auto" alignItems="flex-start" borderWidth="1px" borderColor="gray.200" p={{ base: "4", md: "6" }} borderRadius={{ base: "md", md: "lg" }} flexDirection="column">
          <Flex fontSize={{ base: "xs", md: "sm" }} align="center" w="full">
            <Icon as={HiExclamationCircle} color="yellow.400" />
            <Text ml="1" color="teal.200">Pendente</Text>
            <Spacer />
            <Icon as={HiClock} color="teal.200" />
            <Text ml="1" color="teal.200">{formatDate(call.createdAt)}</Text>
          </Flex>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="medium" mt={{ base: "1", md: "2" }} color="white" w="full" textAlign="left">{call.person?.name || "Não identificado"}</Text>
        </Button>
      </Link>
    );
  }

  return (
    <Link to={`/calls/${call.id}`}>
      <Button
        display="flex"
        w="full"
        h="auto"
        alignItems="flex-start"
        borderWidth="1px"
        borderColor="gray.200"
        p={{ base: "4", md: "6" }}
        borderRadius={{ base: "md", md: "lg" }}
        flexDirection="column"
        bg="white"
        _hover={{
          bg: "gray.50"
        }}
        _active={{
          bg: "gray.50"
        }}
      >
        <Flex fontSize={{ base: "xs", md: "sm" }} align="center" w="full">
          {call.answer === true ? (
            <>
              <Icon as={HiCheckCircle} color="green.400" />
              <Text ml="1" color="gray.400">Entrada aprovada</Text>
            </>
          ) : (
            <>
              <Icon as={HiXCircle} color="red.400" />
              <Text ml="1" color="gray.400">Entrada recusada</Text>
            </>
          )}
          <Spacer />
          <Icon as={HiClock} color="gray.400" />
          <Text ml="1" color="gray.400">{formatDate(call.createdAt)}</Text>
        </Flex>
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="medium" mt={{ base: "1", md: "2" }} w="full" color="black" textAlign="left">{call.person?.name || "Não identificado"}</Text>
      </Button>
    </Link>
  );
}
 
export default CardCall;
