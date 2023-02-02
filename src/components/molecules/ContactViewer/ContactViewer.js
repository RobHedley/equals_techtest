import {
    Box,
    Wrap,
    WrapItem,
  } from '@chakra-ui/react';
import ErrorText from "../../atoms/ErrorText/ErrorText";
import ContactCard from "../ContactCard/ContactCard";
import './ContactViewer.css'

const ContactViewer = ( props ) => {
    const { contactsData } = props;
    if (!contactsData) return <ErrorText textAlign="left">No contacts available</ErrorText>

    return (
        <Box className='outer'>
            <Wrap className='wrapper'>
                {contactsData.map ((contact, index) => {
                    return (
                        <WrapItem key={index}>
                            <ContactCard contact={contact}/>
                        </WrapItem>
                    )
                })}
            </Wrap>
        </Box>
    )
}

export default ContactViewer;