import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    * {
        margin:0;
        padding:0;
    }
    
    input {
        border:2px solid lightgray;
    }

    input:focus {
        outline:none;
        border-color: ${({ theme }) => theme.colors.mainBlue};
    }

    body {
        background:${({ theme }) => theme.colors.backgroundGray};
    }
`

export default GlobalStyle;