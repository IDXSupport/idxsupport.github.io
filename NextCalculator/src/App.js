import {
  React, useRef
} from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  Heading,
  Text,
  Link,
  Stack,
  VStack,
  Code,
  Grid,
  GridItem,
  extendTheme,
  withDefaultColorScheme,
  Center,
  Square,
  Circle,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Input,
  FormLabel,
  SimpleGrid,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  ButtonGroup,
  Button,
  Select,
  Checkbox,
  Wrap,
  WrapItem,
  InputGroup,
  InputRightElement,
  Switch,
  Textarea
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Output } from './Input'


const customTheme = extendTheme(withDefaultColorScheme({ colorScheme: 'green' }))


function App() {
        
  return (
    <ChakraProvider theme={customTheme}>
      <Container p='30' w='100%' maxW='1200px'>
        <Box m='1' maxW="">
          <Grid templateColumns='repeat(2, calc(100% - 65px) 60px)'
            gap={1}
            color='blackAlpha.700'
            fontWeight='bold'
            w="100%"
            >
            <GridItem bg='blue.800'>
              <Center >Header</Center>
            </GridItem>
            <GridItem bg='blue.800'> 
              <Circle size='100%'>
                <ColorModeSwitcher />
              </Circle>
            </GridItem>
          </Grid>
        </Box>
        <Box m='1' maxW="" pt='3'>
          <Grid
            h='200'
            templateRows='repeat(2, 1fr)'
            templateColumns='repeat(5, 1fr)'
            gap={4}
          >
            <GridItem rowSpan={2} colSpan={1} >
              <Center h='200'>
                <ButtonGroup size='lg' isAttached variant='outline'>
                  <Stack >
                    <Button>ID</Button>
                    <Button>Class(es)</Button>
                    <Button>Element</Button>
                  </Stack>
                </ButtonGroup>
              </Center>
            </GridItem>
            <GridItem colSpan={4}>
              <FormControl>
                <FormLabel htmlFor='url'>URL</FormLabel>
                <Input
                  id='url'
                  placeholder='mysite'
                  htmlSize={95}
                  errorBorderColor='red.300'
                  
                  />
              </FormControl>
            </GridItem>
            <GridItem colSpan={3}>
              <FormControl>
                <FormLabel>
                  ID/Class(es)/Element
                </FormLabel>
                <Input
                  placeholder='ID/Class(es)/Element'
                  htmlSize={60} />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} >
              <FormControl>
                <FormLabel noOfLines={1}>
                  Page Title 
                  <Switch id='title' size='md' pl={3} isChecked  />
                </FormLabel>
                <Input defaultValue='Search'
                  htmlSize={10}
                  list='titles'
                />
                <datalist id="titles">
                  <option>Search</option>
                  <option>Listings</option>
                  <option>Properties</option>
                  <option>Homes</option>
                </datalist>
              </FormControl>
            </GridItem>
          </Grid>
            <Box>
              <Output />
          </Box>
        </Box>
      </Container>
    </ChakraProvider>
  );
}

export default App;
