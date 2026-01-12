import { GoogleMap, InfoWindow, LoadScript } from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import '../css/GGMap.css';

const libraries = ["places"];

const CurrentPosition = {
  lat : 37.5381679,
  lng : 127.1262834,
  storeId :'currentPosition',
  storeLocation : '',
  storeName: "현위치",
}
const shopAddrInfos = [{
  name: "현위치", formatted_address: "서울 강동구 천호대로 1027 동원천호빌딩 5층",
  place_id: "mock_place_id_001",

  geometry: { location: { lat: () => 37.5381679, lng: () => 127.1262834 } }
},
{
  name: "천호점", formatted_address: "서대한민국 서울특별시 강동구 천호대로 1024",
  place_id: "mock_place_id_002",

  geometry: { location: { lat: () => 37.537869, lng: () => 127.125649 } }
},
{
  name: "광나루점", formatted_address: "대한민국 서울특별시 광진구 광장동 200-2",
  place_id: "mock_place_id_003",

  geometry: { location: { lat: () => 37.5451255, lng: () => 127.1035741 } }
},
{
  name: "한강 공원점", formatted_address: "대한민국 서울특별시 강동구 선사로 83-66",
  place_id: "mock_place_id_004",

  geometry: { location: { lat: () => 37.5476362, lng: () => 127.1165831 } }
},
{
  name: "천호 위브점", formatted_address: "대한민국 서울특별시 강동구 천호동 414",
  place_id: "mock_place_id_005",

  geometry: { location: { lat: () => 37.539315, lng: () => 127.127047 } }
}];
  const userAddrInfos = [
  {addrName : "집", addrDetailText : "서울특별시 강동구 천호대로 1005"},
  //37.538851 127.124463
  {addrName : "직장", addrDetailText : "서울특별시 강동구 천호옛길 85"},
  //37.5366673 127.1253673
  {addrName : "학원", addrDetailText : "서울특별시 강동구 천호제2동 454-2"},
  //37.5390761 127.1255516
  {addrName : "집2", addrDetailText : "서울특별시 강동구 올림픽로72길 20"}
  //37.5394772 127.1248288
];

export default function GGMap({handleGPStoggle, userInfo, shopInfos}) {

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const mapId = process.env.REACT_APP_GOOGLE_MAP_ID;

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const toggleListBtnRef = useRef(null);

  const UserAddrListRef = useRef(null);
  const ShopAddrListRef = useRef(null);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const containerStyle = { width: "100%", height: "500px" };

//

  const [currentSelectedUserAddr, setCurrentSelectedUserAddr] = useState(0);
  const [currentSelectedShopAddr, setCurrentSelectedShopAddr] = useState(0);

  async function tempMarker()
  {
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

    const currentPosMarker = createNewPin(CurrentPosition, AdvancedMarkerElement,0);
      currentPosMarker.addListener("click", () => {

        const newPos = { 
          lat: CurrentPosition.lat, 
          lng: CurrentPosition.lng 
        };

        mapRef.current.setCenter(newPos);
        setSelectedPlace(CurrentPosition);

      });
      
      markersRef.current.push(currentPosMarker);


    for(let i = 0; i < shopInfos.length; i ++)
    {
      const newMarker = createNewPin(shopInfos[i], AdvancedMarkerElement);

      newMarker.addListener("click", () => {

        const newPos = { 
          lat: shopInfos[i].lat, 
          lng: shopInfos[i].lng 
        };

        mapRef.current.setCenter(newPos);
        setSelectedPlace(shopInfos[i]);

      });
      
      markersRef.current.push(newMarker);
    }
    
    setSelectedPlace(CurrentPosition);
    mapRef.current.setCenter({lat: 37.5381679, lng: 127.1262834});
  }

  function createNewPin(input, AdvancedMarkerElement, type = 1)
  {
    const result = new AdvancedMarkerElement({
      position: {
        lat: input.lat,
        lng: input.lng
      },
      map: mapRef.current,
      title: type === 0 ? "현위치" : "지점",
      content: (() => {
        const pin = document.createElement("div");
        pin.style.width = type === 0 ? "34px" : "28px";
        pin.style.height =  type === 0 ? "34px" : "28px";
        pin.style.borderRadius = type === 0 ? "50%" : "0%";
        pin.style.backgroundColor = "#ff543c"; // 원하는 색상
        pin.style.border = "3px solid white";
        pin.style.boxShadow = "0 0 6px rgba(0,0,0,0.4)";
        
        pin.style.display = "flex";
        pin.style.justifyContent = "center";
        pin.style.alignItems = "center";
        pin.innerText = type === 0 ? "◈" : "🥪";
        pin.style.color = "white";
        pin.style.fontSize = "24px";

        return pin;
      })()
    })

    return result;
  }



  const handleLoad = (map) => {
    
    console.log("LOADED!");

    mapRef.current = map;
    //const service = new window.google.maps.places.PlacesService(map);

    tempMarker();
  };

  function toggleUserAddrList() {
    //tempMarker();
    UserAddrListRef.current.classList.toggle('GGMap_addrList_Closed');
    toggleListBtnRef.current.classList.toggle('GGMap_RightDDBtn_Closed')
  }

  function toggleShopAddrList_Mobile() {
    ShopAddrListRef.current.classList.toggle('GGMap_ShopAddrList_Closed');
  }

  function toggleUserAddrList_Mobile() {
    toggleUserAddrList();
  }


  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <div className="GGMap_MainContainer">
        <div className="GGMap_InnerContainer GGMap_Horizontal_Container">
          <GoogleMap mapContainerClassName="GGMap_Left" mapContainerStyle={containerStyle} zoom={18} 
          onLoad={handleLoad} options={{ mapId: mapId, disableDefaultUI: true }}>
                    
            {selectedPlace && (
              <InfoWindow style={{ marginTop: "16px", padding: "8px", border: "1px solid #888"}}
                position =   {{lat: selectedPlace.lat,
                              lng: selectedPlace.lng,}}
                              zIndex={99}
                              
                key={selectedPlace.storeId} // 이 부분을 추가
                options={{
                  pixelOffset: new window.google.maps.Size(0, -30), // X축 0, Y축 -30만큼 위로 이동
                }}
                  onCloseClick={() => {
                  setSelectedPlace(null);
                }}>
                                
                <div>             
                  <h4>{selectedPlace.storeName}</h4>
                  <div>주소: {selectedPlace.storeLocation}</div>
                  <div>위도: {selectedPlace.lat}</div>
                  <div>경도: {selectedPlace.lng}</div>
                </div>
              </InfoWindow>
            )}

          </GoogleMap>
        
          <div className="GGMap_Right">
            <div className="GGMap_RightInner GGMap_Vertical_Container">
              <div className='GGMap_RightTop'>
                <div className='MP_Footer_Box MP_HorizontalContainer MP_User' onClick={toggleUserAddrList_Mobile}>
                    <img className='MP_Footer_Img' src={`${process.env.PUBLIC_URL}/images/profile_temp.png`} alt='profile_temp.png'/>
                    <div className='MP_Footer_TextBox MP_VerticalContainer'>
                        <div className='MP_FooterText_Large MP_textColor1'>{userInfo.nickname}</div>
                        <div className='MP_FooterText_Normal MP_textColor2'>{userAddrInfos[currentSelectedUserAddr].addrDetailText}</div>
                    </div>
                </div>

                <div className='GGMap_addrListContainer GGMap_Vertical_Container'>
                  <div className='GGMap_UserAddrList GGMap_addrList_Closed' ref={UserAddrListRef}>
                    {userAddrInfos.map((element, index) => (
                      <div
                        key={`addr_${index}`}
                        className='GGMap_addrBox GGMap_Vertical_Container'
                        onClick={(e) => setCurrentSelectedUserAddr(index)}
                      >
                        <div className='GGMap_addrNameText'>{element.addrName}</div>
                        <div className="GGMap_addrLine"></div>
                        <div className='GGMap_addrDetailText'>{element.addrDetailText}</div>
                      </div>
                    ))}

                    <button className="GGMap_RightDDBtn GGMap_RightDDBtn_Closed" 
                      ref={toggleListBtnRef} onClick={toggleUserAddrList}>
                    </button>
                  </div>
                  
                </div>
              </div>
              
              <div className='GGMap_shopListContainer'>
                <div className='MP_Footer_Box MP_HorizontalContainer MP_Shop' onClick={toggleShopAddrList_Mobile}>
                    <img className='MP_Footer_Img' src={`${process.env.PUBLIC_URL}/images/shop_img.png`} alt='shop_img.png'/>
                    <div className='MP_Footer_TextBox MP_VerticalContainer'>
                        <div className='MP_FooterText_Large MP_textColor1'>{shopInfos[currentSelectedShopAddr].storeName}</div>
                        <div className='MP_FooterText_Normal MP_textColor2'>{shopInfos[currentSelectedShopAddr].storeLocation}</div>
                    </div>
                </div>

                <div className='GGMap_ShopAddrList GGMap_ShopAddrList_Closed' ref={ShopAddrListRef}>
                  {shopInfos.slice(1).map((element, index) => (
                    <div
                      key={`shopAddr_${index+1}`}
                      className='GGMap_addrBox GGMap_Vertical_Container'
                      onClick={(e) => {setCurrentSelectedShopAddr(index+1); setSelectedPlace(element)}}
                    >
                      <div className='GGMap_addrTopBox GGMap_Horizontal_Container'>
                      <div className='GGMap_addrNameText'>{element.name}</div>
                      <div className='GGMap_addrDistanceText'>(?m)</div>
                    </div>
                    
                    <div className="GGMap_addrLine"></div>
                    <div className='GGMap_addrDetailText'>{element.formatted_address}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="GGMap_MobileQuitBTN"
            onClick={() => handleGPStoggle(false)}>
          X
        </div>

      </div>
    </LoadScript>
  );
}
