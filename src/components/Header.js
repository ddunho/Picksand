import styled from "styled-components";

const HeaderWrapper = styled.div`
    display : flex;
    justify-content : center;
    width : 100%;
    height : 104px;
    display : flex;
    justify-content : center;
    background-color : #FFFEFB;

    & > div{
        display : flex;
        justify-content : space-between;
        align-items : center;
        width : calc(100vw - 60px);
        height : 104px;
    }

    & > div > div:first-child{
        display : flex;
        gap : 4px;
        & > img{
            width : 60px;
            height : 60px;
        }

        & > div{
            margin-top : 6px;

            & > p:first-child{
                font-size : 24px;
                color : #7C290C;
                margin-bottom : 4px;
            }

            & > p:last-child{
                font-size : 18px;
                color : #F54A00;
            }
        }
}
    & > div > button{
        border-radius:8px;
        border : none;
        padding:0; 
        overflow:visible; 
        cursor:pointer;
        width : 60px;
        height : 40px;
        background : linear-gradient(90deg, #FF6B00 0%, #FE9800 100%);

        & > p{
            color : #7C290C;
        }
    }
`

function Header(){
    return(
        <header>
            <HeaderWrapper>
                <div>
                    <div>
                        <img src="/images/sandwichlogo.png" alt="로고"></img>
                        <div>
                            <p>픽샌</p>
                            <p>원하는 재료로 직접 만들어 보세요</p>
                        </div>
                    </div>
                    <button>
                        <p>로그인</p>
                    </button>
                </div>
            </HeaderWrapper>
        </header>
    );
}

export default Header;