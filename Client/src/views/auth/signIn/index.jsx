import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  keyframes,
} from "@chakra-ui/react";

// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { postApi } from "services/api";
import { loginSchema } from "schema";
import { toast } from "react-toastify";
import Spinner from "components/spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../../../redux/slices/imageSlice";
import { setUser } from "../../../redux/slices/localSlice";

// Import the background image
import bgImage from '../../../assets/img/auth/bg-csn.png';

// Define the animation
const subtleGoldPulse = keyframes`
  0% { box-shadow: 0 0 15px 0 rgba(236, 190, 23, 0.4); }
  50% { box-shadow: 0 0 20px 5px rgba(236, 190, 23, 0.5); }
  100% { box-shadow: 0 0 15px 0 rgba(236, 190, 23, 0.4); }
`;

function SignIn() {
  // Chakra color mode
  const textColor = "navy.700";
  const textColorSecondary = "gray.400";
  const brandStars = "brand.500";
  const [isLoding, setIsLoding] = React.useState(false);
  const [checkBox, setCheckBox] = React.useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch the fetchRoles action on component mount
    dispatch(fetchImage("?isActive=true"));
  }, [dispatch]);

  const image = useSelector((state) => state?.images?.images);

  const [show, setShow] = React.useState(false);
  const showPass = () => setShow(!show);

  const initialValues = {
    username: "",
    password: "",
  };
  const {
    errors,
    values,
    touched,
    handleBlur,
    handleChange,
    resetForm,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { resetForm }) => {
      login();
    },
  });
  const navigate = useNavigate();

  const login = async () => {
    try {
      setIsLoding(true);
      let response = await postApi("api/user/login", values, checkBox);
      if (response && response.status === 200) {
        navigate("/superAdmin");
        toast.success("Login Successfully!");
        resetForm();
        dispatch(setUser(response?.data?.user))
      } else {
        toast.error(response.response.data?.error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <Flex minHeight="100vh" width="100%">
      {/* Left side - Sign-in form */}
      <Flex
        width={["100%", "50%"]}
        bg="black"
        alignItems="center"
        justifyContent="center"
        p={8}
        flexDirection="column"
      >
        <Flex
          width="100%"
          maxWidth="420px"
          flexDirection="column"
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(10px)"
          borderRadius="15px"
          p={6}
          border="1px solid rgba(236, 190, 23, 0.3)"
          animation={`${subtleGoldPulse} 3s infinite ease-in-out`}
          transition="all 0.3s ease-in-out"
          _hover={{
            transform: "scale(1.02)",
            boxShadow: "0 0 25px 10px rgba(236, 190, 23, 0.6)",
          }}
        >
          <Box mb={6}>
            <Heading color="white" fontSize={["24px", "36px"]} mb="10px">
              Sign In
            </Heading>
            <Text
              mb="36px"
              color="whiteAlpha.800"
              fontWeight="400"
              fontSize={["sm", "md"]}
            >
              Enter your email and password to sign in!
            </Text>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <FormControl isInvalid={errors.username && touched.username}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color="white"
                mb="8px"
              >
                Email<Text color="red.500">*</Text>
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                name="username"
                ms={{ base: "0px", md: "0px" }}
                type="email"
                placeholder="mail@simmmple.com"
                mb={errors.username && touched.username ? undefined : "24px"}
                fontWeight="500"
                size="lg"
                color="white"
                bg="rgba(255, 255, 255, 0.1)"
                borderColor={
                  errors.username && touched.username ? "red.300" : "whiteAlpha.300"
                }
                _placeholder={{ color: "whiteAlpha.500" }}
                _hover={{ borderColor: "whiteAlpha.400" }}
                _focus={{ borderColor: "white" }}
              />
              {errors.username && touched.username && (
                <FormErrorMessage mb="24px" color="red.500">
                  {errors.username}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              isInvalid={errors.password && touched.password}
              mb="24px"
            >
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color="white"
                display="flex"
              >
                Password<Text color="red.500">*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Enter Your Password"
                  name="password"
                  mb={errors.password && touched.password ? undefined : "24px"}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="lg"
                  variant="auth"
                  type={show ? "text" : "password"}
                  color="white"
                  bg="rgba(255, 255, 255, 0.1)"
                  borderColor={
                    errors.password && touched.password ? "red.300" : "whiteAlpha.300"
                  }
                  _placeholder={{ color: "whiteAlpha.500" }}
                  _hover={{ borderColor: "whiteAlpha.400" }}
                  _focus={{ borderColor: "white" }}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color="whiteAlpha.700"
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={showPass}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && touched.password && (
                <FormErrorMessage mb="24px" color="red.500">
                  {errors.password}
                </FormErrorMessage>
              )}
            </FormControl>
            <Flex justifyContent="space-between" align="center" mb="24px">
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  onChange={(e) => setCheckBox(e.target.checked)}
                  id="remember-login"
                  value={checkBox}
                  defaultChecked
                  colorScheme="yellow"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: "whiteAlpha.400" }}
                />
                <FormLabel
                  htmlFor="remember-login"
                  mb="0"
                  fontWeight="semi-bold"
                  color="white"
                  fontSize="sm"
                  ms="2"
                >
                  Keep me logged in
                </FormLabel>
              </FormControl>
            </Flex>
            <Button
              fontSize="sm"
              bg="transparent"
              color="white"
              fontWeight="500"
              w="100%"
              h="50"
              type="submit"
              mb="24px"
              disabled={isLoding ? true : false}
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
              borderRadius="15px"
              border="1px solid gold"
            >
              {isLoding ? <Spinner /> : "Sign In"}
            </Button>
          </form>
        </Flex>
        
        <Text
          color="white"
          fontSize="xs"
          textAlign="left"
          mt={6}
          maxWidth="420px"
        >
          * Note that Expert Casa Nova CRM is made only for Desktop. 
          Copyright: EXPERT CASA NOVA REALESTATE L.L.C
        </Text>
      </Flex>

      {/* Right side - Background image with welcome text */}
      <Flex
        display={["none", "flex"]}
        width={["0%", "50%"]}
        backgroundImage={`url(${bgImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.4)"
        />
        <Text
          color="white"
          fontSize={["2xl", "3xl", "4xl"]}
          fontWeight="bold"
          textAlign="center"
          zIndex="1"
          px={4}
        >
          Welcome to Expert Casa Nova CRM
        </Text>
      </Flex>
    </Flex>
  );
}

export default SignIn;
