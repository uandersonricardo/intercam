import { extendTheme, withDefaultColorScheme, withDefaultProps } from "@chakra-ui/react"

const theme = extendTheme(
  {
    styles: {
      global: {
        'html, body, #root': {
          margin: 0,
          padding: 0,
          backgroundColor: 'gray.100',
          height: '100%'
        }
      }
    },
    components: {
      Input: {
        defaultProps: {
          focusBorderColor: "teal.500",
        }
      },
      Select: {
        defaultProps: {
          focusBorderColor: "teal.500",
        }
      }
    }
  },
  withDefaultColorScheme({ colorScheme: "teal" }),
);

export default theme;
