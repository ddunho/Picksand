
import '../css/LoadRecipe.css';
import {useState} from 'react';

export default function LoadRecipe({indType, indList, recipeList, handleLRRecipe, userInfo})
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

            console.log(recipeList);
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
                                const isTypeMatch =
                                    currentSelectedRecipeType === -1 ||
                                    element.recipeType === currentSelectedRecipeType;

                                if (!isTypeMatch) return null;

                                return (
                                    <RecipeBox
                                        key={`RecipeListKey${recipeIndex}`}
                                        element={element}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}