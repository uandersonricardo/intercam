import React from "react";
import { Flex } from "@chakra-ui/react";

import Header from "./Header";
import { Outlet } from "react-router-dom";
 
const Layout: React.FC = () => {
  return (
    <Flex h="full" w="full" direction="column" overflow="hidden">
      <Header />
      <Flex w="full" flex="1" overflow="auto">
        <Outlet />
      </Flex>
    </Flex>
  );
}
 
export default Layout;
