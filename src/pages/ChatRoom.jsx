import React, { useEffect, useContext, useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import * as StompJS from 'stompjs'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userContext } from '../components/context/UserProvider';
import { chatroomAPI } from '../shared/api';


import SubmitForm from '../components/submitForm/SubmitForm';
import MyBubble from '../components/speechBubble/MyBubble';
import OtherBubble from '../components/speechBubble/OtherBubble';
import Header from '../components/header/Header';



const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const nicknameRef = useRef("");
    const chatRef = useRef(null);
    const tempRef = useRef(null);

    const queryClient = useQueryClient();

    const context = useContext(userContext);
    const { userInfo } = context.state;

    const navigate = useNavigate();
    const roomId = useParams().roomId;

    const sock = new SockJS(`${process.env.REACT_APP_API_URL}/iting`);
    const client= StompJS.over(sock);
    const headers = {}; // TODO: 토큰 말고 어떤걸 넣을지?

    const { mutate } = useMutation(chatroomAPI.exitRoom, {
        onSuccess:() => {
            queryClient.invalidateQueries(["rooms"]);
        }
    })

    const disConnect = () => {
        client.disconnect(() => {
            client.unsubscribe();
        });
    }

    const sendMsg = (messageText) => {
        const sendMessage = {
            "enter":"COMM",
            "messageType":"TEXT",
            "nickname":nicknameRef.current,
            "message":messageText
        }
        client.send(`/api/pub/${roomId}`, {}, JSON.stringify(sendMessage));
    }

    const scrollToBottom = () => {
        chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }


    useEffect(()=> {
        chatroomAPI.enterRoom(roomId).then((res) => {
            nicknameRef.current = res.data;
        }).catch((e) => {
            console.log(e);
        });
       
        client.connect(headers, ()=> {
            
            client.send(`/api/pub/${roomId}`, {}, JSON.stringify({
                "enter":"ENTER",
                "messageType":"TEXT",
                "nickname":nicknameRef.current
            }))

            client.subscribe(`/api/sub/${roomId}`, (data) => {
                const newMessage = JSON.parse(data.body);
                setMessages((prev) => [...prev, newMessage]);
            })
        })

        return(()=> {
            mutate(roomId);
            disConnect();
        })
    }, []);

    useEffect(()=> {
        if(!userInfo.nickname) {
            navigate("/viewer/room");
        }
    }, [])

    /** 메세지가 쌓여 스크롤이 생기면 자동으로 스크롤을 내려주는 코드 */
    useEffect(()=> {
        scrollToBottom();
    }, [messages])

    


    return (
        <ChatRoomWrapper ref={tempRef}>
        <Header/>
        <ChatArea>
            {messages?.map((msg, index) => msg.nickname === nicknameRef.current ?
            <MyBubble messageTime={msg.time} key={index}>{msg.message}</MyBubble>:<OtherBubble messageTime={msg.time} key={index}>{msg.message}</OtherBubble>)}
            <div ref={chatRef} style={{height:"10px"}}></div>
        
        </ChatArea>
        <SubmitForm sendMsg={sendMsg}/>
        </ChatRoomWrapper>
        
    );
}

export default ChatRoom;

const ChatRoomWrapper = styled.div`
    padding-top:71px;
    padding-bottom:65px;
    width:100%;
    /* height:calc(100vh - 71px - 70px); */
    /* height:calc(100vh - 71px - 70px); */
    /* height:calc(100vh - 71px - 70px);
    display:flex;
    flex-direction:column;
    justify-content:flex-end; */
`

const ChatArea = styled.div`
    overflow-y:auto;
    /* height:calc(100vh - 71px - 70px); */
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:flex-end;
    gap:10px;
    
`