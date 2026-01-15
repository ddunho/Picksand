import '../css/MainPage.css'
import GGMap from '../components/GGMap';
import LoadRecipe from '../components/LoadRecipe';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { useContext, useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web'
import { useAxios } from '../api/axiosInterceptor';
import { AuthContext } from "../context/AuthProvider";

import toast, { Toaster } from 'react-hot-toast';

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
      draggable="false"
      src={`${process.env.PUBLIC_URL}/images/sandwichimg/${item.imgAddr}`}
      alt={item.name}
      style={{ ...styles, position: "relative", zIndex: index}} 
      className={`MP_noPointerEv MP_SandwichImg ${item.typeUid === 5 ? "MP_Thin" : ""}`}
    />
  );
}

function CartIngredient({item, index, handleRemoveIngredient, sandwichIndex, alterName = null, amount = 1}) {

  return (
        <div className={`MP_CartItemBox MP_HorizontalContainer 
            ${item.uid === 'Ind_uid:first' ? 'MP_noPointerEv' : ''}
            ${item.uid === 'Ind_uid:last' ? 'MP_noPointerEv' : ''}`}
            onClick={(e) => handleRemoveIngredient(e, item, sandwichIndex)}>

            <div className='MP_CartItemIcon'
                style={{"backgroundColor" : item.bgColor, "borderColor" : item.borderColor}}></div>
            <div className='MP_CartItemTextBox MP_VerticalContainer'>
                <div className='MP_NormalText MP_textColor1'>{alterName ? alterName : (item.name + " " + index)}</div>
                <div className='MP_NormalText MP_textColor2'>{(item.price * amount).toLocaleString()}원</div>
            </div>
            {(item.uid !== 'Ind_uid:first' && item.uid !== 'Ind_uid:last') && 
                <div className='MP_CartItemRemove'>X</div>}
        </div>
  );
}

function makeStackedIngredients(indList, targetIngredients) {

    const uidIndexMap = new Map(
        indList.map((item, index) => [item.uid, index])
    );

    const countMap = new Map();
    for (const ingredient of targetIngredients) {
        const uid = ingredient.uid;
        countMap.set(uid, (countMap.get(uid) || 0) + 1);
    } 


    let tempList = [];

    for (const [uid, count] of countMap.entries()) {

        const index = uidIndexMap.get(uid);
        if (index === undefined) continue;

        let newInd = {
            name : indList[index].name + ' x' + count,
            ingredient : indList[index],
            amount : count
        };

        tempList.push(newInd);
    }
    
    return tempList;
}

function CartModeChangeSwitch({ value, onChange }) {
    return (
        <label className="MP_CartModeSwitch">
            <input
                type="checkbox"
                checked={value}
                onChange={e => onChange(e.target.checked)}
            />
            <div className="MP_CartModeSwitchText MP_textColor1 MP_NormalText">묶음 모드</div>
            <div className="MP_CartModeSwitchSlider">    
                <div className="MP_CartModeSwitchSliderBall"/>
            </div>
        </label>
    );
}

function SandwichBox({sandwichIndex,
    currentSelectedSandwich, 
    indList, LoadRecipeDatas,
    sandwichAry, setSandwichAry,isCartMode,
    lastSelectedAry, userInfo})
{
    const [openedCartSandwichAry, setOpenedCartSandwichAry] = useState([]);
    const [currentEditingSandwichName, setCurrentEditingSandwichName] = useState(-1);

    const inputRef = useRef(null);
    const readyRef = useRef(false);
    const cartBlurReasonRef = useRef(null);
    const targetSandwich = sandwichAry[sandwichIndex];

    useEffect(() => {
        if (currentEditingSandwichName === sandwichIndex && inputRef.current) {
            
            setTimeout(() => {
                inputRef.current.focus();
                inputRef.current.select();
                readyRef.current = true;
            }, 0); 
        } else {
            readyRef.current = false;
        }
    }, [sandwichIndex, currentEditingSandwichName]);

    
    function handleRemoveIngredient(e, item, sandwichIndex) {

        console.log("REMOVE");
        e.stopPropagation();
        
        console.log("sandwichIndex : " + sandwichIndex);
        console.log(sandwichAry[sandwichIndex]);

        const removeIndex =
            sandwichAry[sandwichIndex].Ingredients.findLastIndex(
                ing => ing === item
            );
        
        setSandwichAry(prev =>
            prev.map((sandwich, index) =>
                index === sandwichIndex
                    ? {
                        ...sandwich,
                        Ingredients: sandwich.Ingredients.filter(
                            (element, i) => i !== removeIndex
                        )
                    }
                    : sandwich
            )
        );
    }
    
    function handleSandwichSelect(input) {

        console.log("Select : " + input);
        currentSelectedSandwich.current = input;
        console.log("Select Name : " + sandwichAry[currentSelectedSandwich.current].name);

        lastSelectedAry.current = [];

        setSandwichAry(prev =>
            prev.map((sandwich, index) =>
                index === currentSelectedSandwich.current
                    ? {
                        ...sandwich,
                        Ingredients: [...sandwichAry[input].Ingredients]
                    }
                    : sandwich
            )
        );
    }

    function handleSandwichBoxToggleBTN(e, sandwichIndex) {

        e.stopPropagation();

        setOpenedCartSandwichAry(prev =>
            prev.includes(sandwichIndex)
                ? prev.filter(i => i !== sandwichIndex)
                : [...prev, sandwichIndex]
        );

    }
    
    function handleSandwichBoxRemoveBTN(e, sandwichIndex) {

        e.stopPropagation();

        if(sandwichAry.length === 1)
        {
            setSandwichAry([
                {
                    name: '나만의 샌드위치',
                    Ingredients: [],
                }
            ]);

            currentSelectedSandwich.current = 0;
        }
        else
        {
            if (currentSelectedSandwich.current === sandwichIndex) {
                currentSelectedSandwich.current = 0;
            } else if (currentSelectedSandwich.current > sandwichIndex) {
                currentSelectedSandwich.current -= 1;
            }

            setSandwichAry(prev =>
                prev.filter((element, index) => index !== sandwichIndex)
            );
        }
        
        setOpenedCartSandwichAry(prev =>
            prev
                .filter(i => i !== sandwichIndex)
                .map(i => (i > sandwichIndex ? i - 1 : i))
        );
    }

    const [isSaving, setIsSaving] = useState(false);
    async function handleSandwichBoxSaveBTN(e, sandwichIndex)
    {
        if(isSaving)
        {
            return;
        }

        if(!userInfo || Object.keys(userInfo).length === 0)
        {
            toast.error("로그인이 필요합니다.");
            return;
        }


        //이하는 레시피 저장시

        let target = sandwichAry[sandwichIndex];
        if(target.Ingredients.length < 1)
        {
            return;
        }
        
        setIsSaving(true);
        let totalPrice = 0;
        for(let x = 0; x < target.Ingredients.length; x++)
        {
            totalPrice += target.Ingredients[x].price
        }

        const reqData = {
            "recipe":{
            recipeType: 2,
            name: target.name,
            totalPrice: totalPrice,
            userUid: userInfo.id
            },
            "inds": target.Ingredients
        }


        try{

            let result = await axios.post(`${process.env.REACT_APP_API_URL}/server-b/Recipe/addNewWithInds`,
                reqData,
                { 
                    headers: {'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
                }
            );

            console.log(result.data);
            await LoadRecipeDatas(indList);
            toast.success(result.data);

        }catch(error){
            const errorMassage = error.response && error.response.data ? error.response.data : '개별 처리에 실패 했습니다.';
            toast.error(`${errorMassage}`);
        }
        finally{
            setIsSaving(false);
        }
    }

    

    function handleEditingSandwichName(e, sandwichIndex)
    {
        e.stopPropagation();

        setCurrentEditingSandwichName(sandwichIndex);
    }

    
    function handleSaveSandwichName(sandwichIndex, newName)
    {
        if(newName==='' || cartBlurReasonRef.current === "Escape")
        {
            setCurrentEditingSandwichName(-1);
            return;
        }
        
        setSandwichAry(prev =>
            prev.map((sandwich, index) =>
                index === sandwichIndex
                    ? {
                        ...sandwich,
                        name: newName
                    }
                    : sandwich
            )
        );

        setCurrentEditingSandwichName(-1);
    }

    return(
        <div className={`MP_CartSandwichBox MP_VerticalContainer
            ${currentSelectedSandwich.current === sandwichIndex ? 'MP_CartSandwichBox_Selected' : ''}`}
                onClick={() => handleSandwichSelect(sandwichIndex)}>
            <div className='MP_CartSandwichTop'>
                {currentEditingSandwichName === sandwichIndex?
                    <input className='MP_CartSandwichTop_EditInput' name={`EditInput_${sandwichIndex}`} type='text' defaultValue={targetSandwich.name} maxLength='10' ref={inputRef} 
                        onClick={e => e.stopPropagation()}
                        //onChange={e => handleChangeSandwichName(e.target.value)}
                        onBlur={(e) => { if (readyRef.current) {
                                handleSaveSandwichName(sandwichIndex, e.target.value); }}}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {cartBlurReasonRef.current = "Enter"; e.currentTarget.blur();}
                            if (e.key === 'Escape')  {cartBlurReasonRef.current = "Escape"; e.currentTarget.blur();}
                        }}>
                    </input>
                    :<div className="MP_CartSandwichTop_Left MP_LargeText MP_textColor1"
                        onClick={(e) => handleEditingSandwichName(e, sandwichIndex)}>
                        {targetSandwich.name}
                    </div>
                }
                <div className="MP_CartSandwichTop_Right MP_HorizontalContainer">
                    <div className={`MP_CartSandwichTop_BTNs MP_CartSandwichTop_Right_Toggle
                    ${openedCartSandwichAry.includes(sandwichIndex) ? '' : 'MP_CartSandwichTop_Right_Toggle_Closed'}`}
                        onClick={(e) => handleSandwichBoxToggleBTN(e, sandwichIndex)}>
                    </div>
                    <div className="MP_CartSandwichTop_BTNs MP_CartSandwichTop_Right_Edit MP_textColor2"
                        onClick={(e) => handleEditingSandwichName(e, sandwichIndex)}>
                        N
                    </div>
                    <div className="MP_CartSandwichTop_BTNs MP_CartSandwichTop_Right_Save MP_textColor2"
                        onClick={(e) => handleSandwichBoxSaveBTN(e, sandwichIndex)}>
                        <div>+</div>
                    </div>
                    <div className="MP_CartSandwichTop_BTNs MP_CartSandwichTop_Right_Remove MP_textColor2"
                        onClick={(e) => handleSandwichBoxRemoveBTN(e, sandwichIndex)}>
                        X
                    </div>
                </div>
            </div>
            {targetSandwich.Ingredients.length > 0 &&
                <div className={`MP_CartIngredientList MP_VerticalContainer
                    ${openedCartSandwichAry.includes(sandwichIndex) ? 'MP_CartIngredientList_Closed' : ''}`}>
                    

                    {!isCartMode && targetSandwich.Ingredients.map((element, index) => (
                        <CartIngredient key={index+'_Cart'} item={element} index={index}
                            sandwichIndex={sandwichIndex} handleRemoveIngredient={handleRemoveIngredient}/>
                    ))}

                    {isCartMode && makeStackedIngredients(indList, targetSandwich.Ingredients)
                    .map((element, index) => (
                        <CartIngredient key={element.ingredient.uid +'_Cart_Stack'} item={element.ingredient} index={index}
                        sandwichIndex={sandwichIndex} handleRemoveIngredient={handleRemoveIngredient}
                        alterName={element.name} amount={element.amount}/>
                    ))}
                </div>
            }
        </div>
    )
}


function IngredientList({index, indList, indType, handleAddIngredient}) {

    
    const datas = indList.filter((d)=>{
        return d.typeUid === indType[index].uid;
    })

    return(
        <div className='MP_IngredientList'>
            {datas.map((element, index, array) => 
                <IndBoxes key={"IndBoxesKey" + element.uid} ingredient={element}
                    indList = {indList} handleAddIngredient={handleAddIngredient}></IndBoxes>)}
            {datas.length % 2 !== 0 
                ? <div className='MP_IngredientBox_empty'></div> 
                : null}
        </div>
    )
}

function IndBoxes({ingredient, handleAddIngredient}) {
    return(
        <div className='MP_IngredientBox MP_HorizontalContainer'
            onClick={() => handleAddIngredient(ingredient)}>
            <div className='MP_TypeImageBox' 
                style={{"backgroundColor" : ingredient.bgColor, "borderColor" : ingredient.borderColor}} ></div>
            <div className='MP_TypeTextBox MP_VerticalContainer'>
                <div className='MP_NormalText MP_textColor1'>{ingredient.name}</div>
                <div className='MP_NormalText MP_textColor2'>{ingredient.price.toLocaleString()}원</div>
            </div>
            <div className='MP_TypeAddBtn'>
                <div className='MP_TypeAddBtn_InnerText'>+</div>
            </div>
        </div>
    )
}

function MainPage() {

    const navigate = useNavigate();
    const api = useAxios();

    const { accessToken } = useContext(AuthContext);

    const [currentTowerIndex,setCurrentTowerIndex] = useState(0);
    const [currentTotalPrice, setCurrentTotalPrice] = useState(0);
    const [currentTotalIndCount, setCurrentTotalIndCount] = useState(0);
    const [mobileCurrentSelectedIndBTN, setMobileCurrentSelectedIndBTN] = useState();
    const [mobileCurretnSelectedType, setMobileCurretnSelectedType] = useState(0);
    const [isMobileView, setIsMobileView] = useState(false);
    const [isCartMode,setIsCartMode] = useState(false);
    const [currentSelectedShopAddr, setCurrentSelectedShopAddr] = useState(0);

    const [userInfo, setUserInfo] = useState(null);

    const [sandwichAry, setSandwichAry] = useState([
        {
            name: '나만의 샌드위치',
            Ingredients: [],
        }
    ]);
    const currentSelectedSandwich = useRef(0);
    const lastSelectedAry = useRef([[],[],[]]);
    const GGMapRef = useRef(null);
    const IngredientsContainerRef = useRef(null);
    const MobileIngredientsContainerRef = useRef(null);
    const LeftBackCoverRef = useRef(null);
    const SandwichContainerRef = useRef(null);
    const CartContainerRef = useRef(null);
    const SandwichMainRef = useRef(null);

    const LoadRecipeRef = useRef(null);

    //axios
    const [indType,setIndType] = useState();
    const [indList,setIndList] = useState();
    const [shopInfos, setShopInfos] = useState(null);
    const [recipeList, setRecipeList] = useState([]);
    /* 
        {
            recipeName: 'DefaultName',
            recipeType: 0,
            recipeOwner: 0,
            totalPrice: 0,
            ingredientsUidList: [],
            IngredientCountsText:"",
        } 
    */

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
            `${process.env.REACT_APP_API_URL}/server-b/IngredientType/getAllWithCount`
        );

        const loadIngredientListPromise = axios.get(
            `${process.env.REACT_APP_API_URL}/server-b/Ingredient/findAll`
        );

        const loadShopListPromise = axios.get(
            `${process.env.REACT_APP_API_URL}/server-c/store/getStore`
        )

        // 2. Promise.all로 모든 요청을 묶고, 모두 완료되면 then 블록 실행
        Promise.all([loadIngredientTypePromise, loadIngredientListPromise, loadShopListPromise])
            .then(([indTypeResp, indListResp, shopRes]) => {
            // 응답 순서는 Promise 배열의 순서와 같습니다.

            // 3. 상태 업데이트
            setIndType(indTypeResp.data);
            setIndList(indListResp.data);
            setShopInfos(shopRes.data);
            
            return LoadRecipeDatas(indListResp.data);
        })
        .then(() => {
            // 4. 모든 데이터 로딩이 완료되었으므로 로딩 상태 변경
            setIsLoaded(true); // ⭐ 여기서 보장
        })
        .catch(error => {
            console.error('데이터 로딩 중 오류 발생:', error);
            // 필요하다면 에러 처리 (예: 에러 상태 설정, 사용자에게 메시지 표시)
        });


    },[])

    useEffect(() => {

        if (!accessToken) return;
            
        async function fetchUserInfo() {
            try {
            const userRes = await api.get(
                `${process.env.REACT_APP_API_URL}/server-a/members/userinfo`
            );

            setUserInfo(userRes.data);
            console.log(userRes.data);

            } catch (err) {
            console.error("유저 정보 조회 실패", err);
            }
        };

        fetchUserInfo();

    }, [accessToken, api]);

    useEffect(() => {

        if (!userInfo) return;

        console.log("LoadRecipe By UserInfo");

        LoadRecipeDatas(indList);

    }, [userInfo]);


    function LoadRecipeDatas(indData)
    {
        return axios.get(`${process.env.REACT_APP_API_URL}/server-b/Recipe/getAllList`,
        {
            params: userInfo?.id != null
                ? { inputUserUid: userInfo.id }
                : {}
        })
        .then(response => {
            let loadRecipeList = response.data;
            console.log(loadRecipeList);

            //console.log(" inputUserUid: " + userInfo.id);
            //

            const uidIndexMap = new Map(
                indData.map((item, index) => [item.uid, index])
            );
            //console.log(uidIndexMap);

            //

            for(let i = 0 ; i < loadRecipeList.length; i++)
            {
                const uidList = loadRecipeList[i].ingredientsUidList;
                const countMap = new Map();

                // 1. UID별 개수 집계
                for (const uid of uidList) {
                    countMap.set(uid, (countMap.get(uid) || 0) + 1);
                }

                // 2. 문자열 생성
                const textParts = [];

                for (const [uid, count] of countMap.entries()) {
                    const index = uidIndexMap.get(uid);
                    if (index === undefined) continue;

                    const name = indData[index].name;
                    textParts.push(`${name} x${count}`);
                }

                loadRecipeList[i].IngredientCountsText = textParts.join(", ");
                //console.log(loadRecipeList[i].IngredientCountsText)
            }

            setRecipeList(loadRecipeList);

        })
        .catch(error => {
            console.error(error);
        });
    }

    function addToLastSelected()
    {
        lastSelectedAry.current.push(sandwichAry[currentSelectedSandwich.current].Ingredients);
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

        //console.log("N : " + currentSelectedSandwich.current);

        if(sandwichAry[currentSelectedSandwich.current].Ingredients.length === 0
            && ingredient.typeUid !== 1
        )
        {
            setSandwichAry(prev =>
                prev.map((sandwich, index) =>
                    index === currentSelectedSandwich.current
                        ? {
                            ...sandwich,
                            Ingredients: [...sandwich.Ingredients, indList[0]]
                        }
                        : sandwich
                )
            );

            //sandwichAry[currentSelectedSandwich.current].current.selectedIngredients.push(indList[0]);
        }

        if(ingredient.uid === '')
        {
            ingredient.addDelay = 150;
            ingredient.uid = 'Ind_uid'+currentTowerIndex;
        }

        setCurrentTowerIndex(prevIndex => prevIndex + 1);

        //
        addToLastSelected();
        setSandwichAry(prev =>
            prev.map((sandwich, index) =>
                index === currentSelectedSandwich.current
                    ? {
                        ...sandwich,
                        Ingredients: [...sandwich.Ingredients, ingredient]
                    }
                    : sandwich
            )
        );
        //
        //sandwichAry.current[currentSelectedSandwich.current].selectedIngredients.push(ingredient);

    };
    
    function handleAddNewSandwich() {

        const newEmptySandwich = {
            name: '새 샌드위치 ' + sandwichAry.length,
            Ingredients: []
        }
        createNewSandwich(newEmptySandwich);
    }

    useEffect(()=>{

        const SandwichContainerCurrentScroll = SandwichContainerRef.current.scrollTop;

        let totalPrice = 0;
        let totalIndCount = 0;

        for(let j = 0 ; j < sandwichAry.length; j++)
        {            
            for(let i = 0 ; i < sandwichAry[j].Ingredients.length; i++)
            {
                totalPrice += parseInt(sandwichAry[j].Ingredients[i].price);
                totalIndCount += 1;
            }
        }

        //console.log(totalPrice);
        setCurrentTotalPrice(totalPrice);
        setCurrentTotalIndCount(totalIndCount);

        let newTop = 0;
        let scrollAlt = 0;

        for(let i = 0; i < sandwichAry[currentSelectedSandwich.current].Ingredients.length; i++)
        {
            if(sandwichAry[currentSelectedSandwich.current].Ingredients[i].typeUid !== 5)
            {
                newTop += 25;
                scrollAlt = 25;
            }
            else
            {
                scrollAlt = 0;
            }
        }

        if(newTop > 250)
        {
            SandwichMainRef.current.style.top = `${newTop - 250}px`;
            if (SandwichMainRef.current) {
                const scrollTargetElement = SandwichContainerRef.current; // 또는 스크롤바가 붙은 다른 컨테이너
                
                scrollTargetElement.scrollTop = SandwichContainerCurrentScroll + scrollAlt;
            }
        }
        else
        {
            SandwichMainRef.current.style.top = `0px`;
        }

    },[sandwichAry])

    function handleUndoIngredient() {

        if(lastSelectedAry.current.length < 1)
        {
            return;
        }

        setSandwichAry(prev =>
            prev.map((sandwich, index) =>
                index === currentSelectedSandwich.current
                    ? {
                        ...sandwich,
                        Ingredients: [...lastSelectedAry.current.pop()]
                    }
                    : sandwich
            )
        );
    }

    function handleResetIngredient() {

        if(sandwichAry[currentSelectedSandwich.current].Ingredients.length === 0)
        {
            return;
        }
        
        //
        addToLastSelected();

        setSandwichAry(prev =>
            prev.map((sandwich, index) =>
                index === currentSelectedSandwich.current
                    ? {
                        ...sandwich,
                        Ingredients: []
                    }
                    : sandwich
            )
        );
    }


    function handleOrder() {


        //

        let reqDatas = [];

        for(let i = 0 ; i < sandwichAry.length; i++)
        {
            if(sandwichAry[i].Ingredients.length > 0)
            {
                let target = sandwichAry[i];

                let totalPrice = 0;
                for(let x = 0; x < target.Ingredients.length; x++)
                {
                    totalPrice += target.Ingredients[x].price
                }

                const newData = {
                    "shopInfo": shopInfos[currentSelectedShopAddr],
                    "recipe":{
                    recipeType: 2,
                    name: target.name,
                    totalPrice: totalPrice
                    },
                    "inds": target.Ingredients
                }

                reqDatas.push(newData);
            }
        }

        if(reqDatas.length < 1)
        {
            return;
        }
        
        
        console.log(reqDatas);
            
        //PageNavigate
        navigate("/orderpay", {
            state: { reqDatas }
        });


        return;

    }


    async function handleGPStoggle(input) {

        if(input)
        {
            GGMapRef.current.classList.remove('MP_GPSPopupDisabled');
        }
        else
        {
            GGMapRef.current.classList.add('MP_GPSPopupDisabled');
        }
    }

    function handleLoadRecipetoggle(input) {
        if(input)
        {
            LoadRecipeRef.current.classList.remove('MP_LoadRecipePopupDisabled');
        }
        else
        {
            LoadRecipeRef.current.classList.add('MP_LoadRecipePopupDisabled');
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


    

    function handleLRRecipe(selectedRecipe)
    {

        handleLoadRecipetoggle(false);

        let newIngredients = [];

        for(let i = 0 ; i < selectedRecipe.ingredientsUidList.length; i++)
        {
            newIngredients.push(indList[selectedRecipe.ingredientsUidList[i]-1]);
        }

        const newSandwich = {
            name: selectedRecipe.recipeName,
            Ingredients: newIngredients
        }

        console.log(newIngredients);

        createNewSandwich(newSandwich);
    }

    function createNewSandwich(input)
    {
        currentSelectedSandwich.current = sandwichAry.length;
        
        setSandwichAry(prev => [
                ...prev,
                {
                    name: input.name,
                    Ingredients: input.Ingredients
                }
            ]);
    }

/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
    const categoryIcons = ["🍞", "🥬", "🧀", "🥓", "🥫"];
    const categoryTexts = ["빵", "채소", "치즈", "단백질", "소스"];
    const categoryTexts_Mobile = [
        <>빵</>,
        <>채<br/>소</>,
        <>치<br/>즈</>,
        <>단<br/>백<br/>질</>,
        <>소<br/>스</>
    ];

    const categoryClasses = ["MP_BreadTypeHead", "MP_VegetableTypeHead", "MP_CheeseTypeHead", "MP_MeatTypeHead", "MP_SourceTypeHead"];


    return(
        <div className='MP_noSelect'>
            <Toaster/>

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

                        {indType.map((type, i) => (
                            (!isMobileView || mobileCurretnSelectedType === i)  && (
                            <div key={'IndTypeBTN_'+i} className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                                <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                    <div className={`MP_NormalText MP_TypeHead ${categoryClasses[i]}`}>{categoryIcons[i] + " " + categoryTexts[i]}</div>
                                    <div className='MP_NormalText MP_textColor3'>{indType[i].ingredientCount} 가지</div>
                                </div>
                                <IngredientList index={i} indList={indList} indType={indType} handleAddIngredient={handleAddIngredient}/>
                            </div>)
                        ))}
                    </div>}

                </div>

                <div className='MP_Mobile_LeftAside'>
                    <div className='MP_Mobile_IngredientTypeBTNList'>
                        {indType && [...indType].reverse().map((type, i) => (
                            <div key={'MobileIndTypeBTN_'+i} className={`MP_Mobile_IngredientTypeBTN MP_NormalText ${categoryClasses[indType.length - 1 - i]}`}
                                onClick={(e) => handleMobileTypeSelect(e,indType.length - 1 - i)}>
                                    {categoryIcons[indType.length - 1 - i]}<br/>
                                    <br/>{categoryTexts_Mobile[indType.length - 1 - i]}
                                </div>
                        ))}
                    </div>
                </div>

                <div className='MP_Mobile_LeftBackCover' ref={LeftBackCoverRef}
                            onPointerDown={() => handleMobileIndClose()}>

                </div>
</div>
                <div className='MP_SandwichContainer MP_MainContainers MP_VerticalContainer' ref={SandwichContainerRef}>
              
                    <div className='MP_SandwichTop MP_HorizontalContainer'>

                        <div className='MP_SandwichTopText MP_LargeText MP_textColor1'>
                            🥪 {sandwichAry[currentSelectedSandwich.current].name}
                        </div>

                        <div className='MP_SandwichTopButtonBox'>
                            <div className='MP_SandwichTopBUttonIconBox'
                                    onClick={() => handleUndoIngredient()}>
                                <img className='MP_SandwichTopButtonIcon' draggable="false" src={`${process.env.PUBLIC_URL}/images/BTN_undo.png`} alt='BTN_undo.png'/>
                            </div>
                            <div className='MP_SandwichTopBUttonIconBox'
                                    onClick={() => handleResetIngredient()}>
                                <img className='MP_SandwichTopButtonIcon' draggable="false" src={`${process.env.PUBLIC_URL}/images/BTN_refresh.png`} alt='BTN_refresh.png'/>
                            </div>
                        </div>

                        <div className='MP_SandwichTopNameText MP_textColor1'>
                            {sandwichAry[currentSelectedSandwich.current].name}
                        </div>
                    </div>
     
                    <div className='MP_SandwichMain' ref={SandwichMainRef}>
                        <div className='MP_SandwichImgPlace'>

                            {sandwichAry[currentSelectedSandwich.current]?.Ingredients?.map((element, index) => (
                                <DropIngredient key={index+'_SandMain' + currentSelectedSandwich.current} item={element} index={index} />
                            ))}

                        </div>

                        {sandwichAry[currentSelectedSandwich.current].Ingredients.length === 0 && (
                            <div className='MP_SandwichMain_emptyDisplay MP_VerticalContainer'>
                            <img draggable="false" src={`${process.env.PUBLIC_URL}/images/empty_sandwich.png`} alt='empty_sandwich.png'/>
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
                        <div className='MP_CartTopHeader MP_HorizontalContainer'>
                            <div className='MP_CartTopText'>
                                <div className='MP_LargeText MP_textColor1'>
                                    🛒 장바구니 {mobile_isCartOpen && `(${sandwichAry[currentSelectedSandwich.current].Ingredients.length})`}</div>
                            </div>

                            <div className='MP_CartTopModSwitchContainer'>
                                <CartModeChangeSwitch value={isCartMode} onChange={setIsCartMode}></CartModeChangeSwitch>
                            </div>
                        </div>

                        <div className='MP_CartList MP_VerticalContainer'>
                            {sandwichAry.map((element, sandwichIndex) => (
                                <SandwichBox key={"CartListKey" + sandwichIndex} sandwichIndex={sandwichIndex}
                                currentSelectedSandwich={currentSelectedSandwich} LoadRecipeDatas={LoadRecipeDatas}
                                indList={indList} sandwichAry={sandwichAry} setSandwichAry={setSandwichAry}
                                isCartMode={isCartMode} lastSelectedAry={lastSelectedAry} userInfo={userInfo}/>
                            ))}
                            
                            <div className='MP_CartAddSandwichBTN MP_HorizontalContainer'>
                                <div className='MP_CardAddNewSandwichBTN MP_CartAddNewSandwich_LeftBTN'
                                    onClick={() => handleAddNewSandwich()}>

                                    <div className='MP_CartAddSandwichBTN_Icon MP_LargeText'>
                                        <div className='MP_CartAddSandwichBTN_IconText MP_textColor2'>+</div>
                                    </div>
                                    <div className="MP_CartAddSandwichBTN_Text MP_LargeText MP_textColor2">
                                        추가하기
                                    </div>
                                </div>

                                <div className="MP_CardAddNewSandwichBTN MP_CartAddNewSandwich_RightBTN"
                                    onClick={() => handleLoadRecipetoggle(true)}>
                                    
                                    <div className='MP_CartAddSandwichBTN_Icon MP_LargeText'>
                                        <div className='MP_CartAddSandwichBTN_IconText MP_textColor2'>+</div>
                                    </div>
                                    <div className="MP_CartAddSandwichBTN_Text MP_LargeText MP_textColor2">
                                        불러오기
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>              
                    <div className='MP_CartBottom MP_VerticalContainer'>
                        <div className='MP_cartAmount MP_ingredient_total MP_HorizontalContainer'>
                            <div className='MP_LargeText MP_textColor1'>총 재료</div>
                            <div className='MP_LargeText MP_textColor3'>{currentTotalIndCount}개</div>
                        </div>
                        <div className='MP_cartPrice MP_ingredient_total MP_HorizontalContainer'>
                            <div className='MP_LargeText MP_textColor1'>총 금액</div>
                            <div className='MP_LargeText MP_textColor3'>{currentTotalPrice.toLocaleString()}원</div>
                        </div>

                        <div className='MP_OrderButton'
                            onClick={() => handleOrder()}>
                            <div className='MP_LargeText'>주문하기 {currentTotalPrice.toLocaleString()}원</div>
                        </div>
                    </div>
                </div>

            </main>

            <div className='MP_Footer MP_HorizontalContainer'>
                <div className='MP_Footer_Box MP_HorizontalContainer MP_Shop'
                            onClick={() => handleGPStoggle(true)}>
                    <img className='MP_Footer_Img' draggable="false" src={`${process.env.PUBLIC_URL}/images/shop_img.png`} alt='shop_img.png'/>
                    <div className='MP_Footer_TextBox MP_VerticalContainer'>
                        <div className='MP_FooterText_Large MP_textColor1'>{shopInfos?.[currentSelectedShopAddr]?.storeName ? shopInfos[currentSelectedShopAddr].storeName : "로딩중"}</div>
                        <div className='MP_FooterText_Normal MP_textColor2'>{shopInfos?.[currentSelectedShopAddr]?.storeLocation ? shopInfos[currentSelectedShopAddr].storeLocation : ""}</div>
                    </div>
                </div>

                <div className='MP_FooterText_Large MP_textColor1 MP_FooterArrow'> → </div>

                <div className='MP_Footer_Box MP_HorizontalContainer MP_User'
                            onClick={() => handleGPStoggle(true)}>
                    <img className='MP_Footer_Img' draggable="false" src={`${process.env.PUBLIC_URL}/images/profile_temp.png`} alt='profile_temp.png'/>
                    <div className='MP_Footer_TextBox MP_VerticalContainer'>
                        <div className='MP_FooterText_Large MP_textColor1'>
                             {userInfo?.nickname ? `${userInfo.nickname}님` : "로그인이 필요합니다"}
                        </div>
                        <div className='MP_FooterText_Normal MP_textColor2'>
                             {userInfo?.address ? `${userInfo.address + " " + userInfo.addressDetail}` : ""}</div>
                    </div>
                </div>

            </div>

{/*POPUPS*/}

            <div className='MP_GPSPopupContainer MP_GPSPopupDisabled' ref={GGMapRef}>
                <div className='MP_GPSPopup'>
                    {isLoaded && <GGMap handleGPStoggle={handleGPStoggle} userInfo={userInfo} shopInfos={shopInfos}
                    currentSelectedShopAddr={currentSelectedShopAddr} setCurrentSelectedShopAddr={setCurrentSelectedShopAddr}></GGMap>}
                </div>
                <div className='MP_GPSPopupBackground'
                            onClick={() => handleGPStoggle(false)}>
                </div>
            </div>

            <div className='MP_LoadRecipeContainer MP_LoadRecipePopupDisabled' ref={LoadRecipeRef}>
                <div className='MP_LoadRecipePopup'>
                    {isLoaded && <LoadRecipe indType={indType} indList={indList} recipeList={recipeList} 
                        handleLRRecipe={handleLRRecipe} userInfo={userInfo}></LoadRecipe>}
                </div>
                <div className='MP_LoadRecipePopupBackground'
                            onClick={() => handleLoadRecipetoggle(false)}>
                </div>
            </div>

{/*POPUPS*/}

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
