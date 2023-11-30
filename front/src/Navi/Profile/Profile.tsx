import { useEffect, useState, SyntheticEvent } from "react"
import UserTypeState, { ProfileState, URLstate, UserDataState, WorkerListState } from "../../Store/Store"
import axios from "axios"
import ReactModal from "react-modal"
import ProfileModal from "./ProfileModal"

import "./scss/Profile.scss"

export default function Profile () {

    const {URL} = URLstate(state=>state)
    const {UserType} = UserTypeState(state=>state)
    const {Memberid, Token, Storeid, setToken, setName} = UserDataState(state=>state)
    const {userImg,companyImg,name,phonenumber,companyNumber,companyName, setuserImg, setcompanyImg, setname, setphonenumber, setcompanyName, setcompanyNumber} = ProfileState(state=>state)
    const {setWorkList} = WorkerListState(state=>state)


    useEffect(()=> {
        const loadUserData = async () => {
            const UserRes = await axios.post(`${URL}/detail`,{memberid :Memberid})
            const Userprofile = UserRes.data.data.member
            const Storeprofile = UserRes.data.data.store

            setuserImg(Userprofile.memberimg)
            setname(Userprofile.name)
            setName(Userprofile.name)
            setphonenumber(Userprofile.phonenumber)

            setcompanyName(Storeprofile.companyname)
            setcompanyNumber(Storeprofile.companynumber)
            setcompanyImg(Storeprofile.companyimg)
            if(UserType === 'admin'){
                const WorkerList = await axios.get(`${URL}/admin/attendance/workerlist/${Memberid}/${Storeid}`)
                console.log(WorkerList.data.data)
                setWorkList(WorkerList.data.data)
            }     
        }
        loadUserData()
    },[Memberid,URL])

    const [modalOpenis, setmodalOpenis] = useState(false)

    const editProfle = () => {
        setmodalOpenis(true)
    }

    const CodeGenerater = async () => {
        const CodeRes = await axios.post(`${URL}/generate`,{companynumber : companyNumber})
        const Code = CodeRes.data
        setToken(Code)
        console.log(Code)
    }


    const defalutImg = (e:SyntheticEvent<HTMLImageElement, Event> | any) => {
        e.currentTarget.src = "https://kdt9hotdog.s3.ap-northeast-2.amazonaws.com/alba/defalut_image.png";
    }

    return (
        <div className="profile">
            
            <div className="profile-img">
                <img src={UserType ==="admin" ? companyImg === null ? "" : companyImg : userImg === null ? "" : userImg } 
                        alt='profile-image' 
                        onError={defalutImg}/>
            </div>
            <div className="profile-info">
                <p>{name}</p>
                <p>{phonenumber}</p>
                <p>{companyName}</p>
            </div>
            
            {UserType === "admin" ?
                <>  
                    <div className="profile-info">
                         <p>{companyNumber}</p>
                    </div>
                    <button onClick={(e)=>CodeGenerater()}>초대코드 발급</button>
                    <div style={{display:"none"}}>{Token}</div>
                </> 
                :
                <></>
            }
            
            <button type="button" onClick={(e)=>{editProfle()}}>프로필수정</button>
            <ReactModal
                ///// modal 설정
                isOpen={modalOpenis}
                onRequestClose={()=>setmodalOpenis(false)}
                ariaHideApp={false}
                shouldCloseOnOverlayClick={true}
            >
                 <ProfileModal></ProfileModal>
            </ReactModal>  
        </div>
    )
}