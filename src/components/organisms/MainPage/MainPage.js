import React, { useState } from "react";
import {
    Box,
    CircularProgress,
    Text,
    Center,
    Heading,
    VStack,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    useToast
  } from '@chakra-ui/react';
import useQuery from '../../../hooks/useQuery';
import ContactViewer from "../../molecules/ContactViewer/ContactViewer";
import ErrorText from "../../atoms/ErrorText/ErrorText";
import { fetchContext } from "../../../context/fetchContext";

const MainPage = () => {

    const {refetch, setRefetch} = React.useContext(fetchContext);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [addingNew, setAddingNew] = useState(false);

    const toast = useToast()
    const get_URL = 'https://61c32f169cfb8f0017a3e9f4.mockapi.io/api/v1/contacts'

    const {
        data: contacts = [],
        isLoading: imagesLoading,
        error: fetchError,
      } = useQuery(get_URL, refetch);


    const handleCreate = async () => {
        if(name === ''){
            toast({
                title: 'A name is required to create a contact.',
                status: 'error',
                duration: 9000,
                isClosable: true,
              })
            return
        }
        try {
            setAddingNew(true);
            const PostURL = `https://61c32f169cfb8f0017a3e9f4.mockapi.io/api/v1/contacts`
            const res = await fetch(PostURL, {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    birthday: new Date(birthday).toISOString()
                }),
            });
            if (res.status === 201) {
                setAddingNew(false);
                toast({
                    title: 'Contact successfully updated.',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                  })
                  setRefetch(true);
                  onClose()
            } else {
                setAddingNew(false);
                toast({
                    title: 'Error creating new contact.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                  })
                  setRefetch(true);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
        <VStack>
            <Box>
                <Center>
                    <VStack>
                        <Heading>Contact Viewer</Heading>
                        <Button colorScheme='blue' onClick={onOpen}>Add new contact</Button>
                    </VStack>
                    
                </Center>
            </Box>
            {(imagesLoading)? <CircularProgress
                        color="gray.600"
                        trackColor="blue.300"
                        size={7}
                        thickness={10}
                        isIndeterminate
                      /> :<ContactViewer contactsData={contacts} />}
            {fetchError && (
            <ErrorText textAlign="left">Failed to load contacts</ErrorText>
            )}
            {!fetchError && contacts?.length === 0 && (
                <Text textAlign="left" fontSize="lg" color="gray.500">
                No contacts found
                </Text>
            )}
        </VStack>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Add new contact</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {(addingNew)?<CircularProgress
                        color="gray.600"
                        trackColor="blue.300"
                        size={7}
                        thickness={10}
                        isIndeterminate
                      /> :
                <FormControl className='form'>
                    <FormLabel>Name</FormLabel>
                    <Input type='text' onChange={e => setName(e.target.value)} placeholder='Users Name' />
                    <FormLabel>Email</FormLabel>
                    <Input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Users Email' />
                    <FormLabel>Phone Number</FormLabel>
                    <Input type='text' value={phone} onChange={e => setPhone(e.target.value)} placeholder='Users Phone Number' />
                    <FormLabel>Birthday</FormLabel>
                    <Input type='date' value={birthday} onChange={e => setBirthday(e.target.value)} />
                </FormControl>}
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={onClose}>Cancel</Button>
                <Button colorScheme='teal' onClick={handleCreate}>Add New</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
      </>
    )
}

export default MainPage;