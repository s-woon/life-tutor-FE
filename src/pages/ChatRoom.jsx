import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import * as StompJS from 'stompjs'
import axios from 'axios';
import instance from '../shared/axios';
import { userContext } from '../components/context/UserProvider';



const ChatRoom = () => {
    const context = useContext(userContext);
    const { userInfo } = context.state;
    const navigate = useNavigate();
    const roomId = useParams().roomId;
    const sock = new SockJS(`${process.env.REACT_APP_API_URL}/iting`) //TODO: url 넣기
    const client= StompJS.over(sock);


    const headers = {} // TODO: 토큰 말고 어떤걸 넣을지?
    useEffect(()=> {
        const enterRoom = async () => {
            const res = await instance.put(`/api/chat/room/${roomId}/enter`);
            const data = res.data;
        }

        enterRoom().catch(console.error);
       
        client.connect(headers, ()=> {
            
            client.send(`/api/pub/${roomId}`, {}, JSON.stringify({
                "enter":"ENTER",
                "messageType":"TEXT",
                "nickname":userInfo.nickname, // FIXME: 여기다가 nickname 넣기
            }))

            client.subscribe(`/api/sub/${roomId}`, (data) => {
                const newMessage = JSON.parse(data.body);
                console.log(newMessage);
                
            })
        })

        return(()=> {
            disConnect();
        })
    }, []);

    useEffect(()=> {
        if(!userInfo.nickname) {
            /** 새로고침 시 나가기 API 넣기 */
            navigate("/viewer/room");
        }
    }, [])

    const disConnect = () => {
        client.disconnect(() => {
            client.unsubscribe();
        });
        // navigate('/viewer/posting/list');
    }

    const sendMsg = () => {
        client.send(`/api/pub/${roomId}`, {}, JSON.stringify({
            "enter":"COMM",
            "messageType":"TEXT",
            "nickname":userInfo.nickname,
            "message":"안녕하세요"
        }))
    }


    return (
        <>
        <button onClick={sendMsg}>보내기</button>
        </>
    );
}

export default ChatRoom;