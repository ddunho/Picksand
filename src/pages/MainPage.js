import '../css/MainPage.css'
import GGMap from '../components/GGMap';

import { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web'

function DropIngredient({item, index}) {

  const xAlter = useRef(Math.random() * 30 - 15).current; 
  let yAlter = 75 - (index * 25);

  const styles = useSpring({
    from: { opacity: 0, x: xAlter, y: -750},
    to: { opacity: 1, x : xAlter, y: 0},
    delay: 0 + (item.addDelay ?? 0), 
    config: { mass: 1, tension: 270, friction: 26, bounce: 4 }, // 스프링 물리 설정
  })

  return (
    <animated.img
      src={`${process.env.PUBLIC_URL}/images/sandwichimg/${item.img}`}
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

    const [index,setIndex] = useState("index");
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [mobileCurrentSelectedIndBTN, setMobileCurrentSelectedIndBTN] = useState();

    const lastSelectedAry = useRef([[],[],[]]);
    const GGMapRef = useRef(null);
    const IngredientsContainerRef = useRef(null);
    const MobileIngredientsContainerRef = useRef(null);
    const LeftBackCoverRef = useRef(null);
    const SandwichContainerRef = useRef(null);
    const CartContainerRef = useRef(null);

    useEffect(()=>{
        setIndex(0);
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
        }

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
            setSelectedIngredients(prev => [...prev, ind[0]]);
        }

        if(ingredient.uid === '')
        {
            ingredient.addDelay = 150;
            ingredient.uid = 'Ind_uid'+index;
        }

        setIndex(index+1);

        //
        addToLastSelected();
        setSelectedIngredients(prev => [...prev, ingredient]);
    };

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

    function handleMobileCartToggle() {
        CartContainerRef.current.classList.toggle('MP_CartContainer_Closed')
    }

    const ind = [
        { uid : 'Ind_uid:first', id: 0, name: "빵", img: "Bread.png" },
        { uid : '', id: 1, name: "양상추", img: "Lettuce.png" },
        { uid : '', id: 2, name: "올리브", img: "Olive.png" },
        { uid : '', id: 3, name: "피클", img: "Pickle.png" },
        { uid : '', id: 4, name: "토마토", img: "Tomato.png"},
        { uid : 'Ind_uid:last', id: 5, name: "빵", img: "Bread.png" , addDelay: 500},
    ];



    return(
        <div className='MP_noSelect'>

            <main className='MP_main MP_HorizontalContainer'>

<div className='MP_Mobile_IngredientsContainer' ref={MobileIngredientsContainerRef}>
                <div className='MP_IngredientsContainer MP_MainContainers MP_VerticalContainer' ref={IngredientsContainerRef}>
                    <div className='MP_IngredientsTop MP_VerticalContainer'>
                        <div className='MP_LargeText MP_textColor1'>🥗 재료 선택</div>
                        <div className='MP_NormalText MP_textColor2'></div>
                    </div>

                    <div className='MP_IngredientTypeList'>
                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_BreadTypeHead '>🍞 빵</div>
                                <div className='MP_NormalText MP_textColor3'>2가지</div>
                            </div>
                            <div className='MP_IngredientList'>
                                <div className='MP_IngredientBox MP_HorizontalContainer'
                                    onClick={() => handleAddIngredient(ind[1])}>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread1'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>호밀빵</div>
                                        <div className='MP_NormalText MP_textColor2'>2,000원</div>
                                    </div>
                                    <div className='MP_TypeAddBtn'>
                                        <div className='MP_TypeAddBtn_InnerText'>+</div>
                                    </div>
                                </div>
                                
                                <div className='MP_IngredientBox MP_HorizontalContainer MP_SoldOut '>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread2'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                        <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                    </div>
                                    <div className='MP_TypeAddBtn'>
                                        <div className='MP_TypeAddBtn_InnerText'>+</div>
                                    </div>
                                </div>
                                
                                <div className='MP_IngredientBox MP_HorizontalContainer'
                                    onClick={() => handleAddIngredient(ind[2])}>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread2'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                        <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                    </div>
                                    <div className='MP_TypeAddBtn'>
                                        <div className='MP_TypeAddBtn_InnerText'>+</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_VegetableTypeHead '>🥬 채소</div>
                                <div className='MP_NormalText MP_textColor3'>2가지</div>
                            </div>
                            
                            <div className='MP_IngredientList'>
                                <div className='MP_IngredientBox MP_HorizontalContainer'
                                    onClick={() => handleAddIngredient(ind[3])}>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread2'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                        <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                    </div>
                                    <div className='MP_TypeAddBtn'>
                                        <div className='MP_TypeAddBtn_InnerText'>+</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_CheeseTypeHead '>🧀 치즈</div>
                                <div className='MP_NormalText MP_textColor3'>2가지</div>
                            </div>
                            
                            <div className='MP_IngredientList'>
                                <div className='MP_IngredientBox MP_HorizontalContainer'
                                    onClick={() => handleAddIngredient(ind[4])}>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread2'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                        <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                    </div>
                                    <div className='MP_TypeAddBtn'>
                                        <div className='MP_TypeAddBtn_InnerText'>+</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_MeatTypeHead '>🥓 단백질</div>
                                <div className='MP_NormalText MP_textColor3'>2가지</div>
                            </div>
                            
                            <div className='MP_IngredientList'>
                                <div className='MP_IngredientBox MP_HorizontalContainer'>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread2'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                        <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                    </div>
                                    <div className='MP_TypeAddBtn'>
                                        <div className='MP_TypeAddBtn_InnerText'>+</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_SourceTypeHead '>🥫 소스</div>
                                <div className='MP_NormalText MP_textColor3'>2가지</div>
                            </div>
                            
                            <div className='MP_IngredientList'>
                                <div className='MP_IngredientBox MP_HorizontalContainer'>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread2'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                        <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                    </div>
                                    <div className='MP_TypeAddBtn'>
                                        <div className='MP_TypeAddBtn_InnerText'>+</div>
                                    </div>
                                </div>
                                
                                <div className='MP_IngredientBox MP_HorizontalContainer'>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread2'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                        <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                    </div>
                                    <div className='MP_TypeAddBtn'>
                                        <div className='MP_TypeAddBtn_InnerText'>+</div>
                                    </div>
                                </div>
                                
                                <div className='MP_IngredientBox MP_HorizontalContainer'>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread2'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                        <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                    </div>
                                    <div className='MP_TypeAddBtn'>
                                        <div className='MP_TypeAddBtn_InnerText'>+</div>
                                    </div>
                                </div>
                                
                                <div className='MP_IngredientBox MP_HorizontalContainer'>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread2'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                        <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                    </div>
                                    <div className='MP_TypeAddBtn'>
                                        <div className='MP_TypeAddBtn_InnerText'>+</div>
                                    </div>
                                </div>
                                <div className='MP_IngredientBox MP_HorizontalContainer'>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread2'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                        <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                    </div>
                                    <div className='MP_TypeAddBtn'>
                                        <div className='MP_TypeAddBtn_InnerText'>+</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            onClick={() => handleMobileIndClose()}>

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
     
                    <div className='MP_SandwichMain'>
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
                    <div className='MP_CartTop'>
                        <div className='MP_CartTopText'>
                            <div className='MP_LargeText MP_textColor1'>🛒 장바구니</div>
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
                            <div className='MP_LargeText MP_textColor3'>8개</div>
                        </div>
                        <div className='MP_cartPrice MP_ingredient_total MP_HorizontalContainer'>
                            <div className='MP_LargeText MP_textColor1'>총 금액</div>
                            <div className='MP_LargeText MP_textColor3'>3,500원</div>
                        </div>

                        <div className='MP_OrderButton'
                            onClick={() => handleAddIngredient(ind[5])}>
                            <div className='MP_LargeText'>주문하기 (3,500원)</div>
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
                            onClick={() => handleMobileCartToggle()}>

                <div className='MP_MobileFooterCartBTN_emoji'>🛒</div> 
                장바구니
            </div>
        </div>
    )
}

export default MainPage
