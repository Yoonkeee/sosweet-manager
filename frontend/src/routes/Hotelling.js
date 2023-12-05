import {Box, Button, Heading, Image, Text, VStack} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {Temporal} from "@js-temporal/polyfill";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import {locale} from "moment";
import {DayHeader} from "@fullcalendar/core/internal";

export default function Hotelling() {
    const createEvent = (scheduleData) => {
        console.log(scheduleData);
    };
    const events = [
        {title: 'Meeting', start: Temporal.Now.plainDateISO('Asia/Seoul').toString()}
    ]
    const handleDateClick = (arg) => { // bind with an arrow function
        alert(arg.dateStr)
    }
    console.log(Temporal.Now.plainDateISO('Asia/Seoul').toString())
    return (
        <VStack bg={"gray.100"} minH={"100vh"} w={'100%'}>
            <Box w={'100%'}>
                <FullCalendar
                    // headerToolbar={null}

                    locale={'ko'}
                    editable={true}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    dateClick={handleDateClick}
                    initialView='dayGridMonth'
                    events={events}
                    eventContent={renderEventContent}
                />
            </Box>
        </VStack>
    );
}

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}