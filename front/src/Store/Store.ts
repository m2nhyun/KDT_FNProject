import create from 'zustand'

///// EC2 URL
interface url {
    URL : string
}
const URLstate = create<url>(set=>({
    URL : "http://ec2-3-39-203-178.ap-northeast-2.compute.amazonaws.com"
}))
export {URLstate};

///// 유저타입 상태
interface UserType {
    UserType: string;
    setUserTypeAdmin: () => void;
    setUserTypeWorker: () => void;
}

const UserTypeState = create<UserType>(set => ({
    UserType : "Worker",
    setUserTypeAdmin : ()=> set({UserType:"admin"}),
    setUserTypeWorker : () => set({UserType: "worker"})
}))

export default UserTypeState;

///// 유정정보
interface UserDatainterface{
    Memberid : string,
    Storeid : string,
    Token : string
    setMemberid : (res:string) => void;
    setStoreid : (res:string) => void;
    setToken : (res:string) => void;
}

const UserDataState = create<UserDatainterface>(set=>({
    Memberid : "none",
    Storeid :"none",
    Token : "none",
    setMemberid : res => set({Memberid: res}),
    setStoreid : res => set({Storeid : res}),
    setToken : res =>set({Token : res})
}))
export {UserDataState};

////// 스케쥴러 

interface ScheduleStore {
    startTime: string;
    endTime: string;
    registerTime: string;
    setSchedule: (startTime: string, endTime: string, registerTime: string) => void;
  }
  
  export const useScheduleStore = create<ScheduleStore>((set) => ({
    startTime: '',
    endTime: '',
    registerTime: '',
    setSchedule: (startTime, endTime, registerTime) => set({ startTime, endTime, registerTime }),
  }));

