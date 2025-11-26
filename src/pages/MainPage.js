import '../css/MainPage.css'
import Header from '../components/Header.js'


function MainPage() {

    return(
        <div className='MP_noSelect'>
            <Header></Header>

            <main className='MP_main MP_HorizontalContainer'>

                <div className='MP_IngredientsContainer MP_MainContainers MP_VerticalContainer'>
                    <div className='MP_IngredientsTop MP_VerticalContainer'>
                        <div className='MP_LargeText MP_textColor1'>🥗 재료 선택</div>
                        <div className='MP_NormalText MP_textColor2'>원하는 재료를 클릭해서 추가하세요</div>
                    </div>

                    <div className='MP_IngredientTypeList'>
                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_BreadTypeHead '>🍞 빵</div>
                                <div className='MP_NormalText MP_textColor3'>2가지</div>
                            </div>
                            <div className='MP_IngredientList'>
                                <div className='MP_IngredientBox MP_HorizontalContainer'>
                                    <div className='MP_TypeImageBox MP_typeColor_Bread1'></div>
                                    <div className='MP_TypeTextBox MP_VerticalContainer'>
                                        <div className='MP_NormalText MP_textColor1'>호밀빵</div>
                                        <div className='MP_NormalText MP_textColor2'>2,000원</div>
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
                                <div className='MP_IngredientBox_empty'>
                                </div>
                            </div>
                        </div>

                        <div className='MP_IngredientsTypeContainer MP_VerticalContainer'>
                            <div className='MP_IngredientsHead MP_HorizontalContainer'>
                                <div className='MP_NormalText MP_TypeHead MP_VegetableTypeHead '>🥬 채소</div>
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
                                <div className='MP_NormalText MP_TypeHead MP_CheeseTypeHead '>🧀 치즈</div>
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

                <div className='MP_SandwichContainer MP_MainContainers MP_VerticalContainer'>
                    <div className='MP_SandwichTop MP_HorizontalContainer'>
                        <div className='MP_LargeText MP_textColor1'>🥪 샌드위치 미리보기</div>

                        <div className='MP_SandwichTopButtonBox'>
                            <div className='MP_SandwichTopBUttonIconBox'>
                                <img className='MP_SandwichTopButtonIcon' src={`${process.env.PUBLIC_URL}/images/BTN_undo.png`} alt='BTN_undo.png'/>
                            </div>
                            <div className='MP_SandwichTopBUttonIconBox'>
                                <img className='MP_SandwichTopButtonIcon' src={`${process.env.PUBLIC_URL}/images/BTN_refresh.png`} alt='BTN_refresh.png'/>
                            </div>
                        </div>
                    </div>

                    <div className='MP_SandwichMain'>
                        <div className='MP_SandwichMain_emptyDisplay MP_VerticalContainer'>
                            <img src={`${process.env.PUBLIC_URL}/images/empty_sandwich.png`} alt='empty_sandwich.png'/>
                            <div className='MP_LargeText MP_textColor3'>
                                재료를 선택해서<br/>
                                샌드위치를 만들어보세요!
                            </div>
                        </div>

                    </div>
                </div>

                <div className='MP_CartContainer MP_MainContainers MP_VerticalContainer'>
                    <div className='MP_CartTop'>
                        <div className='MP_CartTopText'>
                            <div className='MP_LargeText MP_textColor1'>🛒 장바구니</div>
                        </div>

                        <div className='MP_CartList MP_VerticalContainer'>
                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>
                                                        <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>                            <div className='MP_CartItemBox MP_HorizontalContainer'>
                                <div className='MP_CartItemIcon'></div>
                                <div className='MP_CartItemTextBox MP_VerticalContainer'>
                                    <div className='MP_NormalText MP_textColor1'>화이트빵</div>
                                    <div className='MP_NormalText MP_textColor2'>1,500원</div>
                                </div>
                                <div className='MP_CartItemRemove'>X</div>
                            </div>
                        </div>
                    </div>              
                    <div className='MP_CartBottom MP_VerticalContainer'>
                        <div className='MP_ingredient_total MP_HorizontalContainer'>
                            <div className='MP_LargeText MP_textColor1'>총 재료</div>
                            <div className='MP_LargeText MP_textColor3'>8개</div>
                        </div>
                        <div className='MP_ingredient_total MP_HorizontalContainer'>
                            <div className='MP_LargeText MP_textColor1'>총 금액</div>
                            <div className='MP_LargeText MP_textColor3'>3,500원</div>
                        </div>

                        <div className='MP_OrderButton'>
                            <div className='MP_LargeText'>주문하기 (3,500원)</div>
                        </div>
                    </div>
                </div>

            </main>

            <footer></footer>
        </div>
    )
}

export default MainPage
