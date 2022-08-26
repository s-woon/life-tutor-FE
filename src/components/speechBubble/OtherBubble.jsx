import React from 'react';
import styled from 'styled-components';

const OtherBubble = ({ messageTime, children}) => {
    return(
        <OtherBubbleWrapper>
            <OtherBubbleBox>
                <Bubble>{children}</Bubble>
                <BubbleTime>{messageTime}</BubbleTime>
            </OtherBubbleBox>
        </OtherBubbleWrapper>
    )
}

export default OtherBubble;

const OtherBubbleWrapper = styled.div`
    display:flex;
    width:100%;
`

const OtherBubbleBox = styled.div`
    display:flex;
    padding-left:20px;
    width:80%;
    gap:5px;
`
const BubbleTime = styled.div`
    display:flex;
    align-items:flex-end;
    color:#929292;
    min-width:25%;
    font-size:11px;
    font-weight:700;
    letter-spacing:-0.3px;
`

const Bubble = styled.div`
    display:flex;
    flex-wrap:wrap;
    padding:10px;
    border-radius:20px;
    font-size:14px;
    line-height:20px;
    font-weight:500;
    background:black;
    color:white;
    
`