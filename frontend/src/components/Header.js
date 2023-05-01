import {
    Box,
    Flex,
    Text,
    Button,
    Stack,
    // Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useDisclosure,
    Image,
    VStack,
    useToast,
} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import NewDog from "../modals/NewDog";
import {useMutation} from "react-query";
import {addNewDog, mainColor} from "../api";
import ModifyDog from "../modals/ModifyDog";
import AddPay from "../modals/AddPay";
import Cookies from "js-cookie";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setToday} from "../store";

export default function Header() {
    let statusBarHeight;
    if (window.innerWidth < 500) {
        statusBarHeight = 'env(safe-area-inset-top)';
    } else {
        statusBarHeight = '0';
    }
    // console.log('statusBarHeight : ' + (window.outerHeight - window.innerHeight) + 'px');
    // console.log('inner Height : ' + window.innerHeight + 'px');
    // console.log('20vh : ' + parseInt(window.innerHeight * 0.2) + 'px');

    return (
        <Box
            zIndex={1}
            // position={'absolute'}
            display={'flex'}
            alignContent={'center'}
            justifyContent={'center'}
            // mt={statusBarHeight}
            h={'10vh'}
            // h={`calc(10vh + ${statusBarHeight})`}
            // borderBottom={'2px'}
            // borderColor={'white'}
            background={mainColor}
        >
            <Link to={'/'}>
                <Image
                    h={'7vh'}
                    mt={'1.2vh'}
                    src={'./logo/logo_word.png'}
                    filter={'invert(1)'}
                />
            </Link>
        </Box>
    )
}

// const DesktopNav = () => {
//     const linkColor = useColorModeValue('white', 'gray.200');
//     const linkHoverColor = useColorModeValue('white', 'white');
//     const popoverContentBgColor = '#1a2a52';
//     const dispatch = useDispatch();
//
//     return (// 메인 메뉴
//         <Stack direction={'row'} spacing={4}>
//             {NAV_ITEMS.map((navItem) => (<Box key={navItem.label}>
//                 <Popover
//                     trigger={'hover'}
//                     placement={'bottom-start'}>
//                     <PopoverTrigger>
//                         <Link to={navItem.link} onClick={navItem.label === '시간표' ? () => dispatch(setToday()) : null}>
//                             <Button
//                                 p={2}
//                                 href={navItem.href ?? '#'}
//                                 fontSize={'3xl'}
//                                 fontWeight={800}
//                                 color={linkColor}
//                                 bg={'none'}
//                                 _hover={{
//                                     textDecoration: 'none',
//                                     color: linkHoverColor,
//                                     bg: '#526491',
//                                     rounded: 'xl',
//                                     transform: 'scale(1.2)',
//                                 }}>
//                                 {navItem.label}
//                             </Button>
//                         </Link>
//                     </PopoverTrigger>
//
//                     {navItem.children && (<PopoverContent
//                             // isOpen={isPopoverOpen}
//                             // onClick={handleClose}
//                             border={0}
//                             boxShadow={'xl'}
//                             bg={popoverContentBgColor}
//                             p={4}
//                             rounded={'xl'}
//                             minW={'sm'}>
//                             <Stack>
//                                 {navItem.children.map((child) => {
//                                     if (child.label === '신규 등록') {
//                                         return <AddNewDog {...child} key={child.label}/>
//                                     } else if (child.label === '결제 내역 등록') {
//                                         return <AddNewPay {...child} key={child.label}/>
//                                     } else if (child.label === '등록정보 수정') {
//                                         return <ModDog {...child} key={child.label}/>
//                                     } else {
//                                         return <DesktopSubNav {...child} key={child.label}/>
//                                     }
//                                 })}
//                             </Stack>
//                         </PopoverContent>
//                     )}
//                 </Popover>
//             </Box>))}
//         </Stack>);
// };
// const ModDog = (child) => {
//     const {isOpen, onOpen, onClose} = useDisclosure()
//     const {label, subLink, subLabel} = child;
//     const mutation = useMutation(addNewDog);
//     return (<>
//         <Box
//             cursor={'pointer'}
//             onClick={onOpen}
//             role={'group'}
//             display={'block'}
//             bg={'none'}
//             p={2}
//             rounded={'md'}
//             _hover={{bg: '#526491'}}>
//             <Button onClick={onOpen} bg={'transparent'} _hover={''} p={0}>
//                 <Stack direction={'row'} align={'center'}>
//                     {/*서브메뉴 - 라벨*/}
//                     <VStack alignItems={'flex-start'}>
//                         <Text
//                             transition={'all .3s ease'}
//                             // _groupHover={{color: 'white'}}
//                             fontSize={'xl'}
//                             fontWeight={800}>
//                             {label}
//                         </Text>
//                         {/*서브메뉴 - 라벨 디스크립션*/}
//                         <Text fontSize={'md'} fontWeight={500}>{subLabel}</Text>
//                     </VStack>
//                 </Stack>
//             </Button>
//         </Box>
//         <ModifyDog isOpen={isOpen} onClose={onClose}/>
//     </>);
// }
//
// const AddNewDog = (child) => {
//     const {isOpen, onOpen, onClose} = useDisclosure()
//     const {label, subLink, subLabel} = child;
//     return (<>
//         <Box
//             cursor={'pointer'}
//             onClick={onOpen}
//             role={'group'}
//             display={'block'}
//             bg={'none'}
//             p={2}
//             rounded={'md'}
//             _hover={{bg: '#526491'}}>
//             <Button onClick={onOpen} bg={'transparent'} _hover={''} p={0}>
//                 <Stack direction={'row'} align={'center'}>
//                     {/*서브메뉴 - 라벨*/}
//                     <VStack alignItems={'flex-start'}>
//                         <Text
//                             transition={'all .3s ease'}
//                             // _groupHover={{color: 'white'}}
//                             fontSize={'xl'}
//                             fontWeight={800}>
//                             {label}
//                         </Text>
//                         {/*서브메뉴 - 라벨 디스크립션*/}
//                         <Text fontSize={'md'} fontWeight={500}>{subLabel}</Text>
//                     </VStack>
//                 </Stack>
//             </Button>
//         </Box>
//         <NewDog isOpen={isOpen} onClose={onClose}/>
//     </>);
// }
//
//
// const AddNewPay = (child) => {
//     const {isOpen, onOpen, onClose} = useDisclosure()
//     const {label, subLink, subLabel} = child;
//     return (<>
//         <Box
//             cursor={'pointer'}
//             onClick={onOpen}
//             role={'group'}
//             display={'block'}
//             bg={'none'}
//             p={2}
//             rounded={'md'}
//             _hover={{bg: '#526491'}}>
//             <Button bg={'transparent'} _hover={''} p={0}>
//                 <Stack direction={'row'} align={'center'}>
//                     {/*서브메뉴 - 라벨*/}
//                     <VStack alignItems={'flex-start'}>
//                         <Text
//                             transition={'all .3s ease'}
//                             // _groupHover={{color: 'white'}}
//                             fontSize={'xl'}
//                             fontWeight={800}>
//                             {label}
//                         </Text>
//                         {/*서브메뉴 - 라벨 디스크립션*/}
//                         <Text fontSize={'md'} fontWeight={500}>{subLabel}</Text>
//                     </VStack>
//                 </Stack>
//             </Button>
//         </Box>
//         {/*<Button onClick={onOpen}>Open Modal</Button>*/}
//         <AddPay isOpen={isOpen} onClose={onClose}/>
//     </>);
// };
//
// const DesktopSubNav = ({label, subLink, subLabel}: NavItem) => {
//     return (// 서브 메뉴
//         <Box
//             role={'group'}
//             display={'block'}
//             bg={'none'}
//             p={2}
//             rounded={'md'}
//             _hover={{bg: '#526491'}}>
//             <Stack>
//                 <Link to={subLink}>
//                     {/*서브메뉴 - 라벨*/}
//                     <VStack alignItems={'flex-start'}>
//                         <Text
//                             transition={'all .3s ease'}
//                             _groupHover={{color: 'white'}}
//                             fontSize={'xl'}
//                             fontWeight={800}>
//                             {label}
//                         </Text>
//                         {/*서브메뉴 - 라벨 디스크립션*/}
//                         <Text fontSize={'md'} fontWeight={500}>{subLabel}</Text>
//                     </VStack>
//                 </Link>
//             </Stack>
//         </Box>);
// };
//
// const MobileNav = () => {
//   return (<Stack
//     bg={'#1a2a52'}
//     p={4}
//     display={{md: 'none'}}>
//     {NAV_ITEMS.map((navItem) => (<MobileNavItem key={navItem.label} {...navItem} />))}
//   </Stack>);
// };
//
// const MobileNavItem = ({label, children, href}: NavItem) => {
//     const {isOpen, onToggle} = useDisclosure();
//
//     return (<Stack spacing={4} onClick={children && onToggle}>
//         <Flex
//             py={2}
//             as={Link}
//             href={href ?? '#'}
//             justify={'space-between'}
//             align={'center'}
//             _hover={{textDecoration: 'none',}}>
//             <Text
//                 fontWeight={600}
//                 color={useColorModeValue('gray.600', 'gray.200')}>
//                 {label}
//             </Text>
//             {children && (<Icon
//                 as={ChevronDownIcon}
//                 transition={'all .25s ease-in-out'}
//                 transform={isOpen ? 'rotate(180deg)' : ''}
//                 w={6}
//                 h={6}
//             />)}
//         </Flex>
//         <Collapse in={isOpen} animateOpacity style={{marginTop: '0!important'}}>
//             <Stack
//                 mt={2}
//                 pl={4}
//                 borderLeft={1}
//                 borderStyle={'solid'}
//                 borderColor={useColorModeValue('gray.200', 'gray.700')}
//                 align={'start'}>
//                 {children && children.map((child) => (<Link key={child.label} py={2} href={child.href}>
//                     {child.label}
//                 </Link>))}
//             </Stack>
//         </Collapse>
//     </Stack>);
// };

interface NavItem {
    label: string;
    link: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
}

const NAV_ITEMS: Array<NavItem> = [{label: '시간표', link: '/timetable',}, {
    label: '내역', children: [
        {label: '이용시간 계산', subLabel: '이용 내역 취합하여 메세지 만들기', subLink: '/get-message'},
        {label: '이용 내역', subLabel: '놀이방 이용 내역 확인 및 수정하기', subLink: '/history'},
        {label: '결제 내역', subLabel: '놀이방 결제 내역 확인 및 수정하기', subLink: '/pay-history'},
        {label: '댕댕이 목록', subLabel: '등록된 댕댕이 목록 확인하기', subLink: '/dogs-list'},
    ],
}, {
    label: '등록', children: [
        {label: '결제 내역 등록', subLabel: '놀이방 이용권 구매 등록', subLink: '/payment'},
        {label: '신규 등록', subLabel: '새로운 댕댕이 등록하기', subLink: '/new-dog'},
        {label: '등록정보 수정', subLabel: '기존 댕댕이 정보 변경하기', subLink: '/edit-dog'},
    ],
},];