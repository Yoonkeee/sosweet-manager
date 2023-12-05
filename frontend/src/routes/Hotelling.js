import { Box, VStack } from '@chakra-ui/react';
import { Temporal } from '@js-temporal/polyfill';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Hotelling() {
  const createEvent = scheduleData => {
    console.log(scheduleData);
  };
  const events = [{ title: 'Meeting', start: Temporal.Now.plainDateISO('Asia/Seoul').toString() }];
  const handleDateClick = arg => {
    // bind with an arrow function
    alert(arg.dateStr);
  };
  console.log(Temporal.Now.plainDateISO('Asia/Seoul').toString());
  return (
    <VStack bg="gray.100" minH="100vh" w="100%">
      <Box w="100%">
        <FullCalendar
          // headerToolbar={null}

          dateClick={handleDateClick}
          editable
          eventContent={renderEventContent}
          events={events}
          initialView="dayGridMonth"
          locale="ko"
          plugins={[dayGridPlugin, interactionPlugin]}
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
  );
}
