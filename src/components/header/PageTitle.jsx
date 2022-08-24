import React, { useContext } from 'react';
import { submitDataContext } from '../context/SubmitDataProvider';
import styled, { css } from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdArrowBackIosNew } from 'react-icons/md';
import { postingsAPI } from '../../shared/api';
import { AiOutlinePlus } from 'react-icons/ai';


const PageTitle = ({ title, isAction }) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;
    const context = useContext(submitDataContext);

    const { mutate:submitPosting, isError:mutateError } = useMutation(postingsAPI.postPosting, {
        onSuccess: ({data}) => {
            console.log(data);
            queryClient.invalidateQueries(["postings", "list"]);
            
        }
    });

    const postSubmitHandler = () => {
        //TODO: useMutation 사용해서 글 작성
        const {title, posting_content, hashtag} = context.state.postData;
        const newData = {
            title,
            posting_content,
            hashtag,
            imgUrl:'shdlfl' // TODO: 지우기
        }
        console.log(newData);
        submitPosting(newData);
        navigate('/viewer/posting/list');
    }

    
    if(mutateError) return <p>error</p>
    if(pathname === '/viewer/posting/list') return <PageTitleEmpty/>;
    return(
        <PageTitleWrapper>
            <PageTitleContent>
                <div className='back-icon' onClick={()=>navigate(-1)}><p><MdArrowBackIosNew/></p></div>
                <p>{title}</p>
                <HeaderActions isShow={isAction}>
                    {pathname==="/posting" && <p onClick={postSubmitHandler}>등록</p>}
                    {pathname==="/viewer/room" && <p style={{fontSize:"25px", color:"black"}} onClick={()=> navigate("/create/room")}><AiOutlinePlus/></p>}
                    {/* TODO: action이 필요한 페이지의 케이스를 위와 같이 다룸 */}
                </HeaderActions>
            </PageTitleContent>
        </PageTitleWrapper>
    )
}

export default PageTitle;

const PageTitleWrapper = styled.div`
    width:100%;
    max-width:480px;
    margin:0 auto;
    /* background:blue; */
    display:flex;
    align-items:center;
    height:60px;
    border-bottom:1px solid lightgray;
    p {
        margin:0;
    }
`

const PageTitleContent = styled.div`
    width:calc(100% - 40px);
    margin:0 auto;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:space-between;

    .back-icon p{
        display:flex;
        align-items:center;
        font-size:20px;
    }

    p {
        font-size:16px;
        letter-spacing:-0.3px;
        font-weight:600;
    }
    
`

const HeaderActions = styled.div`
    
    color:${({ theme }) => theme.colors.mainBlue};
    font-size:16px;
    letter-spacing:-0.3px;
    font-weight:600;
    p {
        cursor:pointer;
        display:flex;
        align-items:center;
    }
    ${props => {
            if(props.isShow === false) {
                return css`
                    visibility: hidden;
                `
            }
        }}
`

const PageTitleEmpty = styled.div`
    height:27px;
`