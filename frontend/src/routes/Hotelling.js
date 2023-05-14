import {Box, Button, Heading, Image, Text, VStack} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.css';
// // If you use the default popups, use this.
// frontend/node_modules/@toast-ui/calendar/dist/toastui-calendar.css
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import {Temporal} from "@js-temporal/polyfill";
// import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import interactionPlugin from '@fullcalendar/interaction';
// import {locale} from "moment";
// import {DayHeader} from "@fullcalendar/core/internal";

export default function Hotelling() {
    const createEvent = (scheduleData) => {
        console.log(scheduleData);
    };
    console.log(Temporal.Now.plainDateISO().toString())
    // const createEvent = (scheduleData) => {
    //     console.log(scheduleData);
    // };
    // const events = [
    //     {title: '프로', start: Temporal.Now.plainDateISO().toString()}
    // ]
    // const handleDateClick = (arg) => { // bind with an arrow function
    //     alert(arg.dateStr)
    // }
    // console.log(Temporal.Now.plainDateISO().toString())
    return (
        <VStack bg={"gray.100"} minH={"80vh"} w={'100%'}>
            <Box w={'100%'} minH={'100%'}>
                <Calendar
                    onBeforeCreateEvent={createEvent}
                    useDetailPopup={true}
                    useCreationPopup={true}
                    useFormPopup={true}
                    height={'60vh'}
                    timezones={[
                        {
                            timezoneOffset: 540,
                            displayLabel: 'GMT+09:00',
                            tooltip: 'Seoul'
                        }
                    ]}
                    view={'month'}
                    month={{
                        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
                        visibleWeeksCount: 3,
                    }}
                    usageStatistics={false}
                    calendars={[
                        {
                            id: '0',
                            name: 'Private',
                            backgroundColor: 'lightgreen',
                            borderWidth: '0px',
                            padding: '0px',
                            margin: '0px',
                        },
                    ]}
                    template={{

                    }}
                    theme={{
                        month: {
                            dayName: {
                                backgroundColor: 'white',
                                borderBottom: '2px solid #e9e9e9',
                            },
                            events: {
                                backgroundColor: 'white',
                                borderColor: 'white',
                                borderWidth: '1px',
                                borderRadius: '0px',
                                color: 'black',
                            }
                        }
                    }}
                    events={[
                        {
                            id: '1',
                            calendarId: '0',
                            title: '프로19입실',
                            category: 'allday',
                            dueDateClass: '',
                            padding: '0px',
                            margin: '0px',
                            // bgColor: 'green',
                            when: Temporal.Now.plainDateISO().toString(),
                            // start: Temporal.Now.plainDateISO().toString(),
                            // end: Temporal.Now.plainDateISO().add({days: 1}).toString(),
                        },
                        {
                            id: '2',
                            calendarId: '0',
                            category: 'allday',
                            title: "이벤트 제목",
                            when: Temporal.Now.plainDateISO().toString(),
                            marginLeft: 0,
                            marginRight: 0,
                            height: 30,
                        }
                    ]}
                />
            </Box>
        </VStack>


        // <VStack bg={"gray.100"} minH={"100vh"} w={'100%'}>
        //     <Box w={'100%'}>
        //         <FullCalendar
        //             // headerToolbar={null}
        //             editable={true}
        //             plugins={[dayGridPlugin, interactionPlugin]}
        //             dateClick={handleDateClick}
        //             initialView='dayGridMonth'
        //             events={events}
        //             eventContent={renderEventContent}
        //         />
        //     </Box>
        // </VStack>
    );
}

// function renderEventContent(eventInfo) {
//     return (
//         <>
//             <b>{eventInfo.timeText}</b>
//             <i>{eventInfo.event.title}</i>
//         </>
//     )
// }