import '../css/MainPage.css'
import GGMap from '../components/GGMap';
import axios from 'axios';

import { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web'

function DropIngredient({item, index}) {

  const xAlter = useRef(Math.random() * 30 - 15).current; 
  //let yAlter = 75 - (index * 25);

  const styles = useSpring({
    from: { opacity: 0, x: xAlter, y: -750},
    to: { opacity: 1, x : xAlter, y: 50},
    delay: 0 + (item.addDelay ?? 0), 
    config: { mass: 1, tension: 270, friction: 26, bounce: 4 }, // 스프링 물리 설정
  })

  return (
    <animated.img
      src={`${process.env.PUBLIC_URL}/images/sandwichimg/${item.imgAddr}`}
      alt={item.name}
      style={{ ...styles, position: "relative", zIndex: index}} 
      className={'MP_noPointerEv MP_SandwichImg'}
    />
  );
}

function CartIngredient({item, index, handleRemoveIngredient}) {

  return (
        <div className={`MP_CartItemBox MP_HorizontalContainer 
            ${item.uid === 'Ind_uid:first' ? 'MP_noPointerEv' : ''}
            ${item.uid === 'Ind_uid:last' ? 'MP_noPointerEv' : ''}`}
            onClick={() => handleRemoveIngredient(item)}>

            <div className='MP_CartItemIcon'></div>
            <div className='MP_CartItemTextBox MP_VerticalContainer'>
                <div className='MP_NormalText MP_textColor1'>{item.name} {index}</div>
                <div className='MP_NormalText MP_textColor2'>1,500원</div>
            </div>
            {(item.uid !== 'Ind_uid:first' && item.uid !== 'Ind_uid:last') && 
                <div className='MP_CartItemRemove'>X</div>}
        </div>
  );
}

function MainPage() {

    const [currentTowerIndex,setCurrentTowerIndex] = useState(0);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [currentTotalPrice, setCurrentTotalPrice] = useState(0);
    const [mobileCurrentSelectedIndBTN, setMobileCurrentSelectedIndBTN] = useState();
    const [mobileCurretnSelectedType, setMobileCurretnSelectedType] = useState(0);
    const [isMobileView, setIsMobileView] = useState(false);

    const lastSelectedAry = useRef([[],[],[]]);
    const GGMapRef = useRef(null);
    const IngredientsContainerRef = useRef(null);
    const MobileIngredientsContainerRef = useRef(null);
    const LeftBackCoverRef = useRef(null);
    const SandwichContainerRef = useRef(null);
    const CartContainerRef = useRef(null);
    const SandwichMainRef = useRef(null);

    //axios
    const [indType,setIndType] = useState();
    const [indList,setIndList] = useState();
    const [isLoaded,setIsLoaded] = useState(false);

    useEffect(()=>{

        // 미디어 쿼리 객체 생성 (426px 이하)
        const mediaQuery = window.matchMedia('(max-width: 426px)');

        const updateMobileView = () => {
            setIsMobileView(mediaQuery.matches);
        };

        updateMobileView();
        mediaQuery.addEventListener('change', updateMobileView);

        // 1. 필요한 모든 비동기 요청을 Promise 배열로 만듭니다.
        const loadIngredientTypePromise = axios.get(
            `${process.env.REACT_APP_API_URL}/IngredientType/getAllWithCount`
        );

        const loadIngredientListPromise = axios.get(
            `${process.env.REACT_APP_API_URL}/Ingredient/findAll`
        );

        // 2. Promise.all로 모든 요청을 묶고, 모두 완료되면 then 블록 실행
        Promise.all([loadIngredientTypePromise, loadIngredientListPromise])
            .then(([indTypeResp, indListResp]) => {
            // 응답 순서는 Promise 배열의 순서와 같습니다.

            // 3. 상태 업데이트
            setIndType(indTypeResp.data);
            setIndList(indListResp.data);
            
            // 4. 모든 데이터 로딩이 완료되었으므로 로딩 상태 변경
            setIsLoaded(true);

            // * 디버깅용 콘솔 로그 (개선된 코드에서는 이곳에 위치하는 것이 좋습니다)
        })
        .catch(error => {
            console.error('데이터 로딩 중 오류 발생:', error);
            // 필요하다면 에러 처리 (예: 에러 상태 설정, 사용자에게 메시지 표시)
        });

    },[])

    function addToLastSelected()
    {
        lastSelectedAry.current.push(selectedIngredients.slice());
    }

    function handleMobileTypeSelect(e, input) {

        if(mobileCurrentSelectedIndBTN)
        {
            mobileCurrentSelectedIndBTN.classList.remove('MP_Mobile_IngredientTypeBTN_selected');
        }

        setMobileCurrentSelectedIndBTN(e.currentTarget);

        e.currentTarget.classList.add('MP_Mobile_IngredientTypeBTN_selected');

        IngredientsContainerRef.current.classList.add('MP_IngredientsContainer_SomeSelected');
        MobileIngredientsContainerRef.current.classList.add('MP_Mobile_IngredientsContainer_Opened');
        LeftBackCoverRef.current.classList.add('MP_Mobile_LeftBackCover_Act');

        SandwichContainerRef.current.classList.add('MP_SandwichContainer_Half')

        IngredientsContainerRef.current.classList.remove('MP_BreadTypeHead');
        IngredientsContainerRef.current.classList.remove('MP_VegetableTypeHead');
        IngredientsContainerRef.current.classList.remove('MP_CheeseTypeHead');
        IngredientsContainerRef.current.classList.remove('MP_MeatTypeHead');
        IngredientsContainerRef.current.classList.remove('MP_SourceTypeHead');

        switch(input)
        {
            case 0 : 
                IngredientsContainerRef.current.classList.add('MP_BreadTypeHead');
                break;
            case 1 :
                IngredientsContainerRef.current.classList.add('MP_VegetableTypeHead');
                break;
            case 2 :
                IngredientsContainerRef.current.classList.add('MP_CheeseTypeHead');
                break;
            case 3 :
                IngredientsContainerRef.current.classList.add('MP_MeatTypeHead');
                break;
            case 4 :
                IngredientsContainerRef.current.classList.add('MP_SourceTypeHead');
                break;
            default :
                break;
        }

        setMobileCurretnSelectedType(input);

    }

    function handleMobileIndClose() {

        if(!mobileCurrentSelectedIndBTN)
        {
            return;
        }

        mobileCurrentSelectedIndBTN.classList.remove('MP_Mobile_IngredientTypeBTN_selected')
        IngredientsContainerRef.current.classList.remove('MP_IngredientsContainer_SomeSelected');

        MobileIngredientsContainerRef.current.classList.remove('MP_Mobile_IngredientsContainer_Opened');
        LeftBackCoverRef.current.classList.remove('MP_Mobile_LeftBackCover_Act');
        
        SandwichContainerRef.current.classList.remove('MP_SandwichContainer_Half')

        IngredientsContainerRef.current.classList.remove('MP_BreadTypeHead');
        IngredientsContainerRef.current.classList.remove('MP_VegetableTypeHead');
        IngredientsContainerRef.current.classList.remove('MP_CheeseTypeHead');
        IngredientsContainerRef.current.classList.remove('MP_MeatTypeHead');
        IngredientsContainerRef.current.classList.remove('MP_SourceTypeHead');
    }

    function handleAddIngredient(ingredient) {

        if(selectedIngredients.length === 0)
        {
            setSelectedIngredients(prev => [...prev, indList[0]]);
        }

        if(ingredient.uid === '')
        {
            ingredient.addDelay = 150;
            ingredient.uid = 'Ind_uid'+currentTowerIndex;
        }

        setCurrentTowerIndex(prevIndex => prevIndex + 1);

        //
        addToLastSelected();
        setSelectedIngredients(prev => [...prev, ingredient]);
    };

    useEffect(()=>{

        const SandwichContainerCurrentScroll = SandwichContainerRef.current.scrollTop;
        
        let totalPrice = 0;
        for(let i = 0 ; i < selectedIngredients.length; i++)
        {
            totalPrice += parseInt(selectedIngredients[i].price);
        }
        console.log(totalPrice);
        setCurrentTotalPrice(totalPrice);
        
        if(selectedIngredients.length > 10)
        {
            let newTop = 25 * (selectedIngredients.length - 10);
            SandwichMainRef.current.style.top = `${newTop}px`;
            if (SandwichMainRef.current) {
                const scrollTargetElement = SandwichContainerRef.current; // 또는 스크롤바가 붙은 다른 컨테이너
                scrollTargetElement.scrollTop = SandwichContainerCurrentScroll + 25;
            }
        }
        else
        {
            SandwichMainRef.current.style.top = `0px`;
        }

    },[selectedIngredients])

    function handleUndoIngredient() {

        if(lastSelectedAry.current.length < 1)
        {
            return;
        }

        setSelectedIngredients([...lastSelectedAry.current.pop()]);
    }

    function handleResetIngredient() {

        if(selectedIngredients.length === 0)
        {
            return;
        }
        
        //
        addToLastSelected();
        setSelectedIngredients([]);
    }

    function handleRemoveIngredient(item) {

        if(item.uid === 'Ind_uid:first' 
            || item.uid === 'Ind_uid:last')
        {
            return;
        }

        //

        let newAry = [...selectedIngredients];

        for(let i = 0; i < newAry.length; i++)
        {
            if(newAry[i].uid === item.uid)
            {
                newAry.splice(i, 1);
                break;
            }
        }

        if(newAry.length === 1)
        {
            handleResetIngredient();
        }
        else
        {
            addToLastSelected();
            setSelectedIngredients(newAry);
        }
    }

    const [isOrdering, setIsOrdering] = useState(false);
    async function handleOrder() {

        if(isOrdering)
        {
            return;
        }

        if(selectedIngredients.length < 1)
        {
            return;
        }

        console.log(selectedIngredients);
        console.log(currentTotalPrice);

        setIsOrdering(true);

        try{
            const requestData = {
                "recipe":{
                recipeType: 1,
                name: "createdInCart",
                totalPrice: currentTotalPrice
                },
                "inds": selectedIngredients
            };

            let result = await axios.post(`${process.env.REACT_APP_API_URL}/Recipe/addNewWithInds`,
                requestData,
                { 
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );

            console.log(result);
            alert(`성공!`);

        }catch(error){
            const errorMassage = error.response && error.response.data ? error.response.data : '개별 처리에 실패 했습니다.';
            alert(`${errorMassage}`);
        }
        finally{
            setIsOrdering(false);
        }
    }

//

    function handleGPStoggle(input) {
        
        if(input)
        {
            GGMapRef.current.classList.remove('MP_GPSPopupDisabled');
        }
        else
        {
            GGMapRef.current.classList.add('MP_GPSPopupDisabled');
        }
    }

    const [mobile_isCartOpen, setMobile_isCartOpen] = useState(false);
    function handleMobileCartOrderBTN() {

        if(mobile_isCartOpen)
        {
            //Order
            handleOrder();
        }
        else
        {
            setMobile_isCartOpen(true);
            CartContainerRef.current.classList.remove('MP_CartContainer_Closed')
        }
    }
    function handleMobileCartCloseBTN() {

        setMobile_isCartOpen(false);
        CartContainerRef.current.classList.add('MP_CartContainer_Closed')
    }

    function IngredientList({index}) {
        
        const datas = indList.filter((d)=>{
            return d.typeUid === indType[index].uid;
        })

        return(
            <div className='MP_IngredientList'>
                {datas.map((element, index, array) => 
                    <IndBoxes key={"IndBoxesKey" + element.uid} ingredient={element}></IndBoxes>)}
            </div>
        )
    }

    function IndBoxes({ingredient}) {
        return(
            <div className='MP_IngredientBox MP_HorizontalContainer'
                onClick={() => handleAddIngredient(indList[ingredient.uid - 1])}>
                <div className='MP_TypeImageBox MP_typeColor_Bread1'></div>
                <div className='MP_TypeTextBox MP_VerticalContainer'>
                    <div className='MP_NormalText MP_textColor1'>{ingredient.name}</div>
                    <div className='MP_NormalText MP_textColor2'>{ingredient.price}원</div>
                </div>
                <div className='MP_TypeAddBtn'>
                    <div className='MP_TypeAddBtn_InnerText'>+</div>
                </div>
            </div>
        )
    }


/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////// */


    
    return(
        <div className='MP_noSelect'>

            <main className='MP_main MP_HorizontalContainer'>

<div className='MP_Mobile_IngredientsContainer' ref={MobileIngredientsContainerRef}>
                <div className='MP_IngredientsContainer MP_MainContainers MP_VerticalContainer' ref={IngredientsContainerRef}>
                    <div className='MP_IngredientsTop MP_VerticalContainer'>
                        <div className='MP_LargeText MP_textColor1'>🥗 재료 선택</div>
                        <div className='MP_NormalText MP_textColor2'></div>
                    </div>

                    {!isLoaded && <div>로딩중!</div>}

                    {isLoaded && 
                    <div className='MP_IngredientTypeList'>

                        {(!isMobileView || mobileCurretnSelectedType === 0)  &&
                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_BreadTypeHead '>🍞 빵</div>
                                <div className='MP_NormalText MP_textColor3'>{indType[0].ingredientCount} 가지</div>
                            </div>
                            <IngredientList index={0}/>
                        </div>}

                        {(!isMobileView || mobileCurretnSelectedType === 1)  &&
                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_VegetableTypeHead '>🥬 채소</div>
                                <div className='MP_NormalText MP_textColor3'>{indType[1].ingredientCount} 가지</div>
                            </div>
                            <IngredientList index={1}/>
                        </div>}

                        {(!isMobileView || mobileCurretnSelectedType === 2)  &&
                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_CheeseTypeHead '>🧀 치즈</div>
                                <div className='MP_NormalText MP_textColor3'>{indType[2].ingredientCount} 가지</div>
                            </div>
                            <IngredientList index={2}/>
                        </div>}
                        
                        {(!isMobileView || mobileCurretnSelectedType === 3) &&
                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_MeatTypeHead '>🥓 단백질</div>
                                <div className='MP_NormalText MP_textColor3'>{indType[3].ingredientCount} 가지</div>
                            </div>
                            <IngredientList index={3}/>
                        </div>}

                        {(!isMobileView || mobileCurretnSelectedType === 4) &&
                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_SourceTypeHead '>🥫 소스</div>
                                <div className='MP_NormalText MP_textColor3'>{indType[4].ingredientCount} 가지</div>
                            </div>
                            <IngredientList index={4}/>
                        </div>}

                    </div>}

                </div>

                <div className='MP_Mobile_LeftAside'>
                    
                    <div className='MP_Mobile_IngredientTypeBTNList'>
                        <div className='MP_Mobile_IngredientTypeBTN MP_NormalText MP_SourceTypeHead'
                            onClick={(e) => handleMobileTypeSelect(e,4)}>🥫<br/><div>소<br/>스</div></div>
                        <div className='MP_Mobile_IngredientTypeBTN MP_NormalText MP_MeatTypeHead'
                            onClick={(e) => handleMobileTypeSelect(e,3)}>🥓<br/><div>단<br/>백<br/>질</div></div>
                        <div className='MP_Mobile_IngredientTypeBTN MP_NormalText MP_CheeseTypeHead'
                            onClick={(e) => handleMobileTypeSelect(e,2)}>🧀<br/><div>치<br/>즈</div></div>
                        <div className='MP_Mobile_IngredientTypeBTN MP_NormalText MP_VegetableTypeHead'
                            onClick={(e) => handleMobileTypeSelect(e,1)}>🥬<br/><div>채<br/>소</div></div>
                        <div className='MP_Mobile_IngredientTypeBTN MP_NormalText MP_BreadTypeHead'
                            onClick={(e) => handleMobileTypeSelect(e,0)}>🍞<br/><div>빵</div></div>
                    </div>
                </div>

                <div className='MP_Mobile_LeftBackCover' ref={LeftBackCoverRef}
                            onPointerDown={() => handleMobileIndClose()}>

                </div>
</div>
                <div className='MP_SandwichContainer MP_MainContainers MP_VerticalContainer' ref={SandwichContainerRef}>
              
                    <div className='MP_SandwichTop MP_HorizontalContainer'>

                        <div className='MP_SandwichTopText MP_LargeText MP_textColor1'></div>

                        <div className='MP_SandwichTopButtonBox'>
                            <div className='MP_SandwichTopBUttonIconBox'
                                    onClick={() => handleUndoIngredient()}>
                                <img className='MP_SandwichTopButtonIcon' src={`${process.env.PUBLIC_URL}/images/BTN_undo.png`} alt='BTN_undo.png'/>
                            </div>
                            <div className='MP_SandwichTopBUttonIconBox'
                                    onClick={() => handleResetIngredient()}>
                                <img className='MP_SandwichTopButtonIcon' src={`${process.env.PUBLIC_URL}/images/BTN_refresh.png`} alt='BTN_refresh.png'/>
                            </div>
                        </div>
                    </div>
     
                    <div className='MP_SandwichMain' ref={SandwichMainRef}>
                        <div className='MP_SandwichImgPlace'>

                            {selectedIngredients.map((element, index) => (
                                <DropIngredient key={index+'_SandMain'} item={element} index={index} />
                            ))}

                        </div>

                        {selectedIngredients.length === 0 && (
                            <div className='MP_SandwichMain_emptyDisplay MP_VerticalContainer'>
                            <img src={`${process.env.PUBLIC_URL}/images/empty_sandwich.png`} alt='empty_sandwich.png'/>
                            <div className='MP_SandwichMain_emptyText MP_LargeText MP_textColor3'>
                                재료를 선택해서<br/>
                                샌드위치를 만들어보세요!
                            </div>
                            </div>
                        )}
                    </div>


                </div>

                <div className='MP_CartContainer MP_MainContainers MP_VerticalContainer MP_CartContainer_Closed' ref={CartContainerRef}>
                    
                    <div className='MP_MobileCartTopHandle'
                        onClick={() => handleMobileCartCloseBTN()}>
                        ▼　　▼　　▼
                    </div>
                    
                    <div className='MP_CartTop'>
                        <div className='MP_CartTopText'>
                            <div className='MP_LargeText MP_textColor1'>
                                🛒 장바구니 {mobile_isCartOpen && `(${selectedIngredients.length})`}</div>
                            
                        </div>

                        <div className='MP_CartList MP_VerticalContainer'>
                            
                            {selectedIngredients.map((element, index) => (
                                <CartIngredient key={index+'_Cart'} item={element} index={index}
                                handleRemoveIngredient={handleRemoveIngredient}/>
                            ))}

                        </div>
                    </div>              
                    <div className='MP_CartBottom MP_VerticalContainer'>
                        <div className='MP_cartAmount MP_ingredient_total MP_HorizontalContainer'>
                            <div className='MP_LargeText MP_textColor1'>총 재료</div>
                            <div className='MP_LargeText MP_textColor3'>{selectedIngredients.length}개</div>
                        </div>
                        <div className='MP_cartPrice MP_ingredient_total MP_HorizontalContainer'>
                            <div className='MP_LargeText MP_textColor1'>총 금액</div>
                            <div className='MP_LargeText MP_textColor3'>{currentTotalPrice}원</div>
                        </div>

                        <div className='MP_OrderButton'
                            onClick={() => handleOrder()}>
                            <div className='MP_LargeText'>주문하기 {currentTotalPrice}원</div>
                        </div>
                    </div>
                </div>

            </main>

            <div className='MP_Footer MP_HorizontalContainer'>
                <div className='MP_Footer_Box MP_HorizontalContainer MP_Shop'
                            onClick={() => handleGPStoggle(true)}>
                    <img className='MP_Footer_Img' src={`${process.env.PUBLIC_URL}/images/shop_img.png`} alt='shop_img.png'/>
                    <div className='MP_Footer_TextBox MP_VerticalContainer'>
                        <div className='MP_FooterText_Large MP_textColor1'>천호점</div>
                        <div className='MP_FooterText_Normal MP_textColor2'>서울 강동구 천호대로 1027 동원천호빌딩 5층</div>
                    </div>
                </div>

                <div className='MP_FooterText_Large MP_textColor1 MP_FooterArrow'> → </div>

                <div className='MP_Footer_Box MP_HorizontalContainer MP_User'>
                    <img className='MP_Footer_Img' src={`${process.env.PUBLIC_URL}/images/profile_temp.png`} alt='profile_temp.png'/>
                    <div className='MP_Footer_TextBox MP_VerticalContainer'>
                        <div className='MP_FooterText_Large MP_textColor1'>OOO님</div>
                        <div className='MP_FooterText_Normal MP_textColor2'>서울특별시 중구 세종대로 110 (태평로1가) 401호</div>
                    </div>
                </div>

            </div>


            <div className='MP_GPSPopupContainer MP_GPSPopupDisabled' ref={GGMapRef}>
                <div className='MP_GPSPopup'>
                    <GGMap handleGPStoggle={handleGPStoggle}></GGMap>
                </div>
                <div className='MP_GPSPopupBackground'
                            onClick={() => handleGPStoggle(false)}>
                </div>
            </div>

            <div className='MP_MobileFooterCartBTN'
                            onClick={() => handleMobileCartOrderBTN()}>

                <div className='MP_MobileFooterCartInner'>
                        {!mobile_isCartOpen && 
                            <div className='MP_MobileFooterCartInnerText'>
                                <div className='MP_MobileFooterCartBTN_emoji'>🛒</div> 
                                        장바구니</div>}
                        {mobile_isCartOpen && 
                            <div className='MP_MobileFooterCartInnerText'>
                                <div className='MP_MobileFooterCartBTN_orderEmoji'>💳️</div> 
                                        결제하기</div>}
                </div>
                
            </div>
        </div>
    )
}

export default MainPage
