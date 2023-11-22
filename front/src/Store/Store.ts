import {create} from 'zustand'

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
    Token : string,
    Name : string,
    setMemberid : (res:string) => void;
    setStoreid : (res:string) => void;
    setToken : (res:string) => void;
    setName : (res:string) => void;
}

const UserDataState = create<UserDatainterface>(set=>({
    Memberid : "none",
    Storeid :"none",
    Token : "none",
    Name : "none",
    setMemberid : res => set({Memberid: res}),
    setStoreid : res => set({Storeid : res}),
    setToken : res =>set({Token : res}),
    setName : res => set({Name : res})
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

///// WorkList

interface WorkListinterface {
    workId : BigInt ;
    setWorkId : (res : BigInt) => void;
    workList : [] ;
    setWorkList : (res : []) => void;
}
export const WorkState = create<WorkListinterface> ((set) => ({
    workId : BigInt(0) ,
    setWorkId : res => set({workId : res}),
    workList : [],
    setWorkList : res => set({workList:res})

}))

///// TodoList
interface Contentinterface {
    contentId : BigInt,
    contents : string,
    checked : string
  }
interface TodoListinterface {
    contentId : BigInt;
    setContentId : (res : BigInt) => void;
    todoList : Contentinterface[];
    setTodoList : (res : Contentinterface[]) => void;
}
export const TodoState = create<TodoListinterface> ((set)=>({
    contentId : BigInt(0),
    setContentId : res => set({contentId : res}),
    todoList : [],
    setTodoList : res => set({todoList : res})
}))

///// CommentList
interface Cominterface {
    commentid : BigInt,
    name : string,
    comment : string
}
interface CommentListinterface {
    commentList : Cominterface[];
    setCommentList : (res : Cominterface[]) => void;
}
export const CommentState = create<CommentListinterface> ((set)=>({
    commentList : [],
    setCommentList : res => set({commentList : res})
}))