
import '../css/LoadRecipe.css';
import {useState} from 'react';

export default function LoadRecipe({indType, indList, recipeList, handleLRRecipe})
{
    function RecipeBox({element}) {
        return(
            <div className="LR_RecipeBox MP_VerticalContainer">
                <div className='LR_RecipeBoxInner'
                onClick={() => handleLRRecipe(element)}>
                    <div className="LR_RecipeBox_Upper LR_RecipeBox_Upper_Opened">
                        <div className="LR_RecipeBox_Name MP_NormalText MP_textColor1">🥪 {element.recipeName}</div>
                        <div className="LR_RecipeBox_Bottom">
                            <div className="LR_RecipeBox_Info MP_NormalText MP_textColor2">재료 {element.ingredientsUidList.length} 개</div>
                            <div className="LR_RecipeBox_Info MP_NormalText MP_textColor2">{element.totalPrice.toLocaleString()} 원</div>
                        </div>
                    </div>
                    <div className='LR_RecipeBox_IndList MP_textColor1'>
                        {element.IngredientCountsText}
                    </div>
                </div>
            </div>
        )
    }

    const [currentSelectedRecipeType, setCurrentSelectedRecipeType] = useState(-1);
    function handleLRTopCategory(e, input)
    {
        if(currentSelectedRecipeType === input)
        {
            setCurrentSelectedRecipeType(-1);
        }
        else
        {
            setCurrentSelectedRecipeType(input);
        }
    }

    const [currentSelectedIndType, setCurrentSelectedIndType] = useState([]);
    function handleLRSideCategory(e, input)
    {
        if(currentSelectedIndType.includes(input))
        {
            setCurrentSelectedIndType(currentSelectedIndType.filter(id => id !== input));
        }
        else
        {
            setCurrentSelectedIndType([...currentSelectedIndType, input]);
        }
    }

    const categoryIcons = ["🍞", "🥬", "🧀", "🥓", "🥫"];
    const categoryTexts = ["빵", "채소", "치즈", "단백질", "소스"];
    const categoryClasses = ["MP_BreadTypeHead", "MP_VegetableTypeHead", "MP_CheeseTypeHead", "MP_MeatTypeHead", "MP_SourceTypeHead"];


    return(
        <>
            <div className="LR_Container MP_VerticalContainer">
                <div className="LR_Top MP_HorizontalContainer">
                    <div className={`LR_Top_BOX LR_Top_Left MP_HorizontalContainer ${currentSelectedRecipeType===1 ? 'LR_Top_BOX_Selected' : ''}`}
                            onClick={(e) => handleLRTopCategory(e, 1)}>
                        <img className="LR_Top_Imgs LR_Top_Left_Img" alt="LR_Left_Img" draggable="false"
                            src={`${process.env.PUBLIC_URL}/images/LR_Left_Img.png`} ></img>
                        <div className="LR_Top_Text MP_LargeText MP_textColor1">기본 메뉴</div>
                    </div>
                    <div className={`LR_Top_BOX LR_Top_Right MP_HorizontalContainer ${currentSelectedRecipeType===2 ? 'LR_Top_BOX_Selected' : ''}`}
                            onClick={(e) => handleLRTopCategory(e, 2)}>
                        <img className="LR_Top_Imgs LR_Top_Right_Img" alt="LR_Right_Img" draggable="false"
                            src={`${process.env.PUBLIC_URL}/images/LR_Right_Img.png`} ></img>
                        <div className="LR_Top_Text MP_LargeText MP_textColor1">나만의 메뉴</div>
                    </div>
                </div>
                <div className="LR_Bottom">
                    <div className="LR_Aside MP_VerticalContainer">
                        {indType.map((type, i) => (
                            <div key={'AsideFilterBox' + i} className={`LR_IndFilterBox LR_TypeHead ${categoryClasses[i]} ${currentSelectedIndType.includes(i) ? 'LR_IndFilterBox_Selected' : ''}`}
                                onClick={(e) => handleLRSideCategory(e, i)}>
                                <div className="LR_FilterBoxFront">{categoryIcons[i]}</div>
                                <div className="LR_FilterBoxText">{categoryTexts[i]}</div>
                                <div className="LR_FilterBoxBack">{categoryIcons[i]}</div>
                            </div>
                        ))}
                    </div>

                    <div className="LR_Main">
                        <div className="LR_RecipeLists">
                            {recipeList.map((element, recipeIndex) => {
                                // 1. 상단 타입 필터 (기본/나만의 메뉴)
                                const isTypeMatch = currentSelectedRecipeType === -1 || element.recipeType === currentSelectedRecipeType;

                                // 2. 사이드 재료 타입 필터
                                // 레시피의 재료 UID 리스트를 '타입 UID 리스트'로 변환합니다.
                                const recipeIngredientTypes = element.ingredientsUidList.map(uid => {
                                    const targetInd = indList.find(ind => ind.uid === uid);
                                    return targetInd ? targetInd.typeUid : null;
                                });

                                // 3. 사용자가 선택한 사이드 필터(currentSelectedIndType)가 포함되어 있는지 확인
                                const isIndMatch = currentSelectedIndType.length === 0 || 
                                    currentSelectedIndType.every(selectedTypeUid => recipeIngredientTypes.includes(selectedTypeUid + 1)); 
                                    // +1은 indType의 uid가 1부터 시작할 경우를 대비한 것이니 데이터 구조에 맞춰 조절하세요!

                                if (isTypeMatch && isIndMatch) {
                                    return <RecipeBox key={"RecipeListKey" + recipeIndex} element={element} />;
                                }
                                return null;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}