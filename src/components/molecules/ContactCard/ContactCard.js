import React, { useState, useEffect } from 'react';
import {
    Box,
    Image,
    Text,
    Button,
    Card,
    CardFooter,
    CardBody,
    VStack,
    FormControl,
    FormLabel,
    Input,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    CircularProgress
  } from '@chakra-ui/react';
  import dateFormat from "dateformat";
  import { fetchContext } from '../../../context/fetchContext';

  import './ContactCard.css'

const ContactCard = ( props ) => {
    const { contact } = props;
    const {setRefetch} = React.useContext(fetchContext);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isExpanded, setisExpanded] = useState(false);
    const [boxStyle, setBoxStyle] = useState('boxStyle');
    const [name, setName] = useState(contact.name)
    const [email, setEmail] = useState(contact.email);
    const [phone, setPhone] = useState(contact.phone);
    const [birthday, setBirthday] = useState(dateFormat(contact.birthday, "yyyy-mm-dd"));
    const [contactId] = useState(contact.id);
    const [processing, setProcessing] = useState(false);
    const cancelRef = React.useRef()

    const toast = useToast()

    const handleBoxClick = () => {
        setisExpanded(isExpanded => !isExpanded)
    }

    const  handleSave = async () => {
        if(!contactId) {
            return
        }
        try {
            const PostURL = `https://61c32f169cfb8f0017a3e9f4.mockapi.io/api/v1/contacts/${contactId}`
            const res = await fetch(PostURL, {
                method: "PUT",
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    birthday: new Date(birthday).toISOString()
                }),
            });
            if (res.status === 200) {
                toast({
                    title: 'Contact successfully updated.',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                  })
                  setRefetch(true);
            } else {
                toast({
                    title: 'Error updating contact.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                  })
            }
        } catch (err) {
            console.log(err);
        }
        
    }

    const handleDelete = async () => {
            setProcessing(true);
            try {
                const PostURL = `https://61c32f169cfb8f0017a3e9f4.mockapi.io/api/v1/contacts/${contactId}`
                const res = await fetch(PostURL, {
                    method: "DELETE"
                });
                if (res.status === 200) {
                    setProcessing(false);
                    setRefetch(true);
                    onClose();
                    toast({
                        title: 'Contact successfully deleted.',
                        status: 'success',
                        duration: 9000,
                        isClosable: true,
                    })
                } else {
                    setProcessing(false);
                    onClose();
                    toast({
                        title: 'Error deleting contact.',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                      })
                }
            } catch (err) {
                console.log(err);
            };
    }

    useEffect(()=>{
        setBoxStyle(`boxStyle ${(isExpanded)?'boxOpen': ''}`)
    }, [isExpanded])

    return (
        <>
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            className={'card'}
            
        >
            <Image borderRadius='full' boxSize='100px' src={contact.avatar} alt={contact.name} className='avatar' />
            <CardBody className='cardBody'>
                <VStack>
                    <Text as='b' fontSize='2xl' >{contact.name}</Text>
                    <Button colorScheme='blue' onClick={handleBoxClick}>{(!isExpanded)?'View More':'View Less'}</Button>
                    <Box className={boxStyle}>
                    <FormControl className='form'>
                        <FormLabel>Name</FormLabel>
                        <Input type='text' value={name} mb={3} onChange={e => setName(e.target.value)} />
                        <FormLabel>Email</FormLabel>
                        <Input type='email' value={email} mb={3} onChange={e => setEmail(e.target.value)}/>
                        <FormLabel>Phone Number</FormLabel>
                        <Input type='text' value={phone} mb={3} onChange={e => setPhone(e.target.value)}/>
                        <FormLabel>Birthday</FormLabel>
                        <Input type='date' value={birthday} onChange={e => setBirthday(e.target.value)}/>
                    </FormControl>
                    <Box mt={3}>
                        <Button colorScheme='blue' mr={3} onClick={handleSave}>Save</Button>
                        <Button colorScheme='blue' onClick={onOpen}>Delete</Button>
                    </Box>
                </Box>
                </VStack>
            </CardBody>
            <CardFooter>
                
            </CardFooter>
        </Card>
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Contact
                </AlertDialogHeader>

                <AlertDialogBody>
                    {(processing)? <CircularProgress
                        color="gray.600"
                        trackColor="blue.300"
                        size={7}
                        thickness={10}
                        isIndeterminate
                      />
                    :<Text>Are you sure? You can't undo this action afterwards.</Text>}
                
                </AlertDialogBody>

                <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                </Button>
                <Button colorScheme='red' onClick={handleDelete} ml={3}>
                    Delete
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
}

export default ContactCard;