import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import CalendarMo from "./CalendarMo";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import UserTypeState, {
  CalendarData,
  UserDataState,
  URLstate,
  WorkerListState,
} from "../../Store/Store";
import axios from "axios";
import { formatDate } from "@fullcalendar/core";
import styled from "styled-components";

interface CalendarConProps {
  // 다른 필요한 props가 있다면 추가
}

// fullcalendar css
const FullCalendarContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  // 캘린더 전체 사이즈 조정
  .fc {
    width: 100%;
  }

  // toolbar container
  .fc .fc-toolbar.fc-header-toolbar {
    margin: 0;
    padding: 0 40px;
    background-color: #040f2b;
    height: 63px;
    font-weight: 600;
    font-size: 12px;
    line-height: 29px;
    color: white;
    border-radius: 20px 20px 0px 0px;
  }

  // toolbar 버튼
  .fc .fc-button-primary {
    background-color: transparent;
    border: none;

    span {
      font-weight: 500;
      font-size: 25px;
    }

    :hover {
      background-color: transparent;
    }
  }
  .fc .fc-prev-button,
  .fc .fc-next-button {
    background-color: transparent;
    border: none;

    span {
      font-weight: 500;
      font-size: 25px;
    }

    :hover {
      background-color: transparent;
    }
  }

  // 요일 부분
  .fc-theme-standard th {
    height: 25px;
    padding-top: 3px;
    background: #e5edff;
    border: 1px solid #dddee0;
    font-weight: 500;
    font-size: 15px;
    line-height: 10px;
    color: #7b7b7b;
  }

  // 오늘 날짜 배경색
  .fc .fc-daygrid-day.fc-day-today {
    background-color: #fff8bd;
    color: #238ba2;
  }

  // 날짜별 그리드
  .fc .fc-daygrid-day-frame {
    padding: 5px;
  }

  // 날짜  ex) 2일
  .fc .fc-daygrid-day-top {
    flex-direction: row;
    margin-bottom: 2px;
  }

  // 각 이벤트 요소
  .fc-event {
    cursor: pointer;
    padding: 2px 3px;
    margin-bottom: 2px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 11px;
  }
  .fc-day-sun a {
    color: red;
  }
  .fc-day-sat a {
    color: blue;
  }
`;

function CalendarCon(props: CalendarConProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  // workerlist 갖고오기
  const { WorkerList } = WorkerListState((state) => state);

  // 시간 데이터 갖고오기
  const [nowDate, setNowDate] = useState<string | null>("");

  // month Date
  const [month, setMonth] = useState<string | null>(() => {
    const currentDate = new Date();
    return `${currentDate.toISOString().slice(0, 16)}:00`;
  });

  const [worker, setWorker] = useState<string>("");
  const [gowork, setowork] = useState<string>("");
  const [leavework, setLeaveWork] = useState<string>("");

  const { UserType } = UserTypeState((state) => state);
  const { URL } = URLstate((state) => state);
  const { Storeid, Memberid, Name } = UserDataState((state) => state);

  const memberid = Memberid;
  const storeid = Storeid;

  // modal open 두개로 쪼개기
  const [isDateModalOpen, setDateModalOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);

  function handleDateClick(arg: any) {
    setSelectedDate(arg.date);
    setDateModalOpen(true);
    setEventModalOpen(false); // 모달이 열릴 때 다른 모달은 닫아줍니다.
  }

  // function openModal() {
  //   setModalOpen(true);
  // }

  // function handleModalClose() {
  //   setDateModalOpen(false);
  //   setEventModalOpen(false);
  // }
  // function dateClick(info: any) {
  //   console.log(info);
  //   console.log(info.view);
  // }

  // month 값.
  // 해당 달 정보 보내기
  // 달 변경 확인하기

  const handleDatesSet = (arg: any) => {
    const startDate = new Date(arg.startStr);

    // arg.startStr이 유효한 날짜 형식인지 확인
    if (isNaN(startDate.getTime())) {
      console.error("Invalid start date:", arg.startStr);
      return;
    }

    // 한 달을 더함ㅌ
    startDate.setMonth(startDate.getMonth() + 1);

    // 12월에서 1월로 갈 때 연도를 늘림
    if (startDate.getMonth() === 0) {
      startDate.setFullYear(startDate.getFullYear() + 1);
    }
    const formattedDate = `${startDate.toISOString().slice(0, 16)}:00`;

    const currentDate = new Date();
    const currentDateStr = `${currentDate.toISOString().slice(0, 16)}:00`;

    if (month == null) {
      setMonth(currentDateStr);
    } else {
      setMonth(formattedDate);
    }
  };

  const handleDidMount = () => {};

  const currentDate = new Date();
  const formmatDate = `${currentDate.toISOString().slice(0, 16)}:00`;

  useEffect(() => {
    const loadCalendarData = async () => {
      const monthOnly = new Date().getMonth() + 1;
      console.log("monthOnly : ", monthOnly);

      try {
        const calendarData =
          UserType === "admin"
            ? await axios.get<{ data: CalendarData[] }>(
                `${URL}/admin/schedule/${memberid}/${storeid}/${month}`
              )
            : await axios.get<{ data: CalendarData[] }>(
                `${URL}/user/schedule/${memberid}/${storeid}/${month}`
              );

        const eventsArray = calendarData.data.data.map((item: CalendarData) => {
          const workerName = WorkerList[item.worker];

          const start: Date =
            UserType === "admin"
              ? new Date(item.start as string)
              : new Date(item.gowork as string);
          const end: Date =
            UserType === "admin"
              ? new Date(item.end as string)
              : new Date(item.leavework as string);

          return {
            title: workerName ? workerName : item.worker,
            start: start,
            end: end,
            attendid: item.attendid,
            wage: item.wage,
            worker: item.worker,
          };
        });

        setEvents(eventsArray);
        // console.log(calendarData.data.data);
      } catch (error) {
        console.log("에러", error);
      }
    };

    // 페이지가 처음으로 마운트될 때만 실행
    loadCalendarData();
  }, [WorkerList]); // 두 번째 인자에 빈 배열을 전달하여 페이지가 처음으로 마운트될 때만 실행

  useEffect(() => {
    const loadMonthData = async () => {
      console.log("month", month);
      try {
        const calendarData =
          UserType === "admin"
            ? await axios.get<{ data: CalendarData[] }>(
                `${URL}/admin/schedule/${memberid}/${storeid}/${month}`
              )
            : await axios.get<{ data: CalendarData[] }>(
                `${URL}/user/schedule/${memberid}/${storeid}/${month}`
              );

        const eventsArray = calendarData.data.data.map((item: CalendarData) => {
          const workerName = WorkerList[item.worker];

          const start: Date = new Date(item.start as string);
          const end: Date = new Date(item.end as string);
          const gowork: Date = new Date(item.gowork as string);
          const leavework: Date = new Date(item.leavework as string);
          return {
            title: workerName ? workerName : item.worker,
            start: start,
            end: end,
            attendid: item.attendid,
            wage: item.wage,
            worker: item.worker,
            gowork: gowork,
            leavework: leavework,
          };
        });

        // Set the events array
        setEvents(eventsArray);
        // console.log(calendarData.data.data);
        console.log(eventsArray);
      } catch (error) {
        console.log("에러", error);
      }
    };

    // loadMonthData 함수를 실행
    loadMonthData();
  }, [month]);

  function sendDataFromModal(data: any) {
    console.log("Data received in CalendarCon:", data);

    const workerName = WorkerList[data.worker];

    // 근무자 이름을 이벤트 제목으로 사용
    // const title = data.worker;
    // const title = data.worker === data.memberid ? data.Name : data.worker;

    // 출근 시간을 이벤트 시작 시간으로 사용
    // 퇴근 시간을 이벤트 종료 시간으로 사용
    const end = new Date(data.end);
    const start = new Date(data.start);
    const gowork = new Date(data.gowork);
    const leavework = new Date(data.leavework);
    const wage = data.wage;
    const worker = data.worker;

    const newEvent = {
      title: workerName ? workerName : data.worker,
      start: start,
      end: end,
      wage: wage,
      worker: worker,
      gowork: gowork,
      leavework: leavework,
    };

    setEvents([...events, newEvent]);
  }

  // gowork , leavework

  function updateEvent(newEvent: any) {
    // attendid가 같은 이벤트 찾기
    const updatedEvents = events.map((event: any) => {
      if (event.attendid === newEvent.attendid) {
        return newEvent; // attendid가 같으면 업데이트
      }
      return event;
    });

    setEvents(updatedEvents); // 업데이트된 이벤트로 상태 업데이트
  }

  function handleEventClick(arg: any) {
    const clickedEvent = arg.event.extendedProps;
    const attendid = clickedEvent.attendid; // attendid 가져오기
    const worker = clickedEvent.worker;

    if (UserType === "admin") {
      setEventModalOpen(true);
      setDateModalOpen(false); // 모달이 열릴 때 다른 모달은 닫아줍니다.)
      // console.log(events);
      // const clickedEvent = arg.event.extendedProps;
      // console.log(clickedEvent);
      setSelectedEvent({
        title: arg.event.title,
        start: arg.event.start,
        end: arg.event.end,
        attendid: attendid, // attendid 추가
        wage: arg.event.wage,
        worker: worker,
        gowork: arg.event.gowork,
        leavework: arg.event.leavework,
        // 이벤트에서 가져와야 하는 다른 속성들을 추가할 수 있습니다.
      });
      const extendedProps = arg.event.extendedProps;

      // if (Object.keys(extendedProps).length > 0) {
      //   console.log("Click Event Extended Props:", extendedProps);
      //   // console.log("Extended Props:", extendedProps);
      // } else {
      // console.log("Extended Props is an empty object.");
      // }
      console.log("extendedProps : ", extendedProps);
    } else {
      setEventModalOpen(true);
      setDateModalOpen(false); // 모달이 열릴 때 다른 모달은 닫아줍니다.)
      setSelectedEvent({
        title: arg.event.title,
        start: arg.event.start,
        end: arg.event.end,
        attendid: attendid,
        wage: arg.event.wage,
        worker: worker,
        gowork: arg.event.gowork,
        leavework: arg.event.leavework,
      });
      console.log(events);
      const clickedEvent = arg.event.extendedProps;
      console.log(clickedEvent);
      console.log("Click Event Extended Props:", arg.event.extendedProps);
    }
  }

  /// return 시작
  return (
    <>
      <FullCalendarContainer>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dayMaxEvents={true}
          eventDisplay="list-item"
          height={"80vh"}
          editable={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          weekends={true}
          headerToolbar={{
            left: "prev today",
            center: "title",
            right: "next",
          }}
          events={events}
          eventChange={() => {
            console.log("dkssud");
          }}
          // customButtons={CustomButtons}
          datesSet={handleDatesSet}
          viewDidMount={handleDidMount}
        />
      </FullCalendarContainer>
      {isDateModalOpen && (
        <CalendarMo
          isOpen={isDateModalOpen}
          closeModal={() => setDateModalOpen(false)}
          sendDataToCon={sendDataFromModal}
          selectedDate={selectedDate}
          selectedEvent={null} // 선택된 이벤트는 null로 설정
        />
      )}
      {isEventModalOpen && (
        <CalendarMo
          isOpen={isEventModalOpen}
          closeModal={() => setEventModalOpen(false)}
          sendDataToCon={sendDataFromModal}
          selectedDate={null} // 선택된 날짜는 null로 설정
          selectedEvent={selectedEvent}
        />
      )}
    </>
  );
}

export default CalendarCon;
