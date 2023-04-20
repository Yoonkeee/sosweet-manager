import {useEffect} from "react";
import {Image} from "@chakra-ui/react";

export default function Home() {
    useEffect(() => {
        // console.log(document.style.backgroundColor);
        // document.style.backgroundColor = "#ffffff";
        // console.log(document.style.backgroundColor);
    }, []);
    return (
        <Image h={'80vh'} w={'100vw'} src={'main_img2.jpeg'} objectFit={'cover'}></Image>
    )
}