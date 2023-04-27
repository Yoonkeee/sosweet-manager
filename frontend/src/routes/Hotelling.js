import {Button, Heading, Image, Text, VStack} from "@chakra-ui/react";
import {Link} from "react-router-dom";

export default function Hotelling() {
    return (
        <VStack bg={"gray.100"} minH={"100vh"}>
            <Image mt={'5vh'} h={'30vh'} src={'프로티콘.png'} rounded={'2xl'}/>
            <VStack textAlign={'center'}>
                <Heading>호텔링은 아직 미완성이에요😭</Heading>
                <Text>그대신 귀여운 🥰프로🥰 사진을 보여드릴게요!</Text>
                <Link to="/">
                    <Button colorScheme={"twitter"} variant={"solid"}>
                        &larr; 돌아가주세요...😢
                    </Button>
                </Link>
            </VStack>
            {/*<Image h={'80vh'} w={'100%'} src={'main_img2.jpeg'} objectFit={'cover'}></Image>*/}
        </VStack>
    );
}
