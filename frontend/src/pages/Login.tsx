import React, { useContext, useRef, useState } from "react";
import {
  Container,
  Stack,
  Heading,
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useDisclosure,
  useToast,
  Image
} from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../contexts/Auth";
import logo from "../assets/logo.png";
 
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const { login, isAuthenticated } = useContext(AuthContext);
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Atenção",
        description: "Preencha todos os campos",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    login({ email, password }).then(() => {
      setLoading(false);
    });
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Flex h="full" bg="gray.100" align="center">
      <Container maxW="lg" py={{ base: "12", md: "24" }} px={{ base: "4", sm: "8" }}>
        <Stack spacing="8" alignItems="center">
          <Image src={logo} h="10" />
          <Box
            p="8"
            bg="white"
            boxShadow="md"
            borderRadius="xl"
          >
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="email">E-mail</FormLabel>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Senha</FormLabel>
                  <InputGroup>
                    <InputRightElement>
                      <IconButton
                        variant="link"
                        aria-label={isOpen ? "Mask password" : "Reveal password"}
                        icon={isOpen ? <HiEyeOff /> : <HiEye />}
                        onClick={onClickReveal}
                        colorScheme="gray"
                      />
                    </InputRightElement>
                    <Input
                      id="password"
                      ref={inputRef}
                      name="password"
                      type={isOpen ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
              </Stack>
              <Button onClick={handleLogin} isLoading={loading}>Entrar</Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Flex>
  );
}
 
export default Login;
