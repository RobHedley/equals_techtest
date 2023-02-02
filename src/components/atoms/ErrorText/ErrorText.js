import { Text } from '@chakra-ui/react';

const ErrorText = ({ children, ...props }) => {
    return (<Text fontSize="lg" color="red.300" {...props}>
      {children}
    </Text>)
};

export default ErrorText;