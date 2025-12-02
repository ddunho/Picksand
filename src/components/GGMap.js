import { GoogleMap, InfoWindow, LoadScript } from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import '../css/GGMap.css';

const libraries = ["places"];

export default function GGMap({handleGPStoggle}) {

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const mapId = process.env.REACT_APP_GOOGLE_MAP_ID;

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const toggleListBtnRef = useRef(null);

  const UserAddrListRef = useRef(null);
  const ShopAddrListRef = useRef(null);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [center, setCenter] = useState(null);

  const containerStyle = { width: "100%", height: "500px" };

  useEffect(()=>{
    setCenter({ lat: 37.5381679, lng: 127.1262834 });
  },[])

  const PlaceTemplate = [{
    name: "현위치",
    formatted_address: "서울 강동구 천호대로 1027 동원천호빌딩 5층",
    rating: 4.5,
    place_id: "mock_place_id_001",

    geometry: {
      location: {
        lat: () => 37.5381679,
        lng: () => 127.1262834
      }
    }
  },
  {
    name: "천호점",
    formatted_address: "서대한민국 서울특별시 강동구 천호대로 1024",
    rating: 4.8,
    place_id: "mock_place_id_002",

    geometry: {
      location: {
        lat: () => 37.537869,
        lng: () => 127.125649
      }
    }
  },
  {
    name: "광나루점",
    formatted_address: "대한민국 서울특별시 광진구 광장동 200-2",
    rating: 4.4,
    place_id: "mock_place_id_003",

    geometry: {
      location: {
        lat: () => 37.5451255,
        lng: () => 127.1035741
      }
    }
  },
  {
    name: "한강 공원점",
    formatted_address: "대한민국 서울특별시 강동구 선사로 83-66",
    rating: 4.6,
    place_id: "mock_place_id_004",

    geometry: {
      location: {
        lat: () => 37.5476362,
        lng: () => 127.1165831
      }
    }
  },
  {
    name: "천호 위브점",
    formatted_address: "대한민국 서울특별시 강동구 천호동 414",
    rating: 4.7,
    place_id: "mock_place_id_005",

    geometry: {
      location: {
        lat: () => 37.539315,
        lng: () => 127.127047
      }
    }
  }];

  async function tempMarker()
  {
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

    for(let i = 0; i < PlaceTemplate.length; i ++)
    {
      const newMarker = new AdvancedMarkerElement({
        position: {
          lat: PlaceTemplate[i].geometry.location.lat(),
          lng: PlaceTemplate[i].geometry.location.lng()
        },
        map: mapRef.current,
        title: i === 0 ? "현위치" : "지점",
        content: (() => {
          const pin = document.createElement("div");
          pin.style.width = i === 0 ? "34px" : "28px";
          pin.style.height =  i === 0 ? "34px" : "28px";
          pin.style.borderRadius = i === 0 ? "50%" : "0%";
          pin.style.backgroundColor = "#ff543c"; // 원하는 색상
          pin.style.border = "3px solid white";
          pin.style.boxShadow = "0 0 6px rgba(0,0,0,0.4)";
          
          pin.style.display = "flex";
          pin.style.justifyContent = "center";
          pin.style.alignItems = "center";
          pin.innerText = i === 0 ? "◈" : "🥪";
          pin.style.color = "white";
          pin.style.fontSize = "24px";

          return pin;
        })()
      });

      newMarker.addListener("click", () => {
        setSelectedPlace(PlaceTemplate[i]);
        setCenter({ lat: PlaceTemplate[i].geometry.location.lat(), 
            lng:PlaceTemplate[i].geometry.location.lng() });
      });

      markersRef.current.push(newMarker);
    }
    
    setSelectedPlace(PlaceTemplate[0]);
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
          <GoogleMap mapContainerClassName="GGMap_Left" mapContainerStyle={containerStyle} center={center} zoom={18} onLoad={handleLoad} options={{ mapId: mapId, disableDefaultUI: true }}>
                    
            {selectedPlace && (
              <InfoWindow style={{ marginTop: "16px", padding: "8px", border: "1px solid #888"}}
                position =   {{lat: selectedPlace.geometry.location.lat(),
                              lng: selectedPlace.geometry.location.lng(),}}
                              zIndex={99}
                              
                key={selectedPlace.place_id + Math.random() * 3} // 이 부분을 추가
                options={{
                  pixelOffset: new window.google.maps.Size(0, -30), // X축 0, Y축 -30만큼 위로 이동

                }}>
                                
                <div>             
                  <h4>{selectedPlace.name}</h4>
                  <div>주소: {selectedPlace.formatted_address}</div>
                  <div>평점: {selectedPlace.rating || "N/A"}</div>
                  <div>위도: {selectedPlace.geometry.location.lat()}</div>
                  <div>경도: {selectedPlace.geometry.location.lng()}</div>
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${selectedPlace.place_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: "8px", display: "inline-block", color: "#4285F4" }}
                  >
                    여기서 주문하기!</a>
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
                        <div className='MP_FooterText_Large MP_textColor1'>OOO님</div>
                        <div className='MP_FooterText_Normal MP_textColor2'>서울특별시 중구 세종대로 110 (태평로1가) 401호</div>
                    </div>
                </div>

                <div className='GGMap_addrListContainer GGMap_Vertical_Container'>

                  <div className='GGMap_UserAddrList GGMap_addrList_Closed' ref={UserAddrListRef}>
                    <div className='GGMap_addrBox GGMap_Vertical_Container'>
                      <div className='GGMap_addrNameText'>집</div>
                      <div className="GGMap_addrLine"></div>
                      <div className='GGMap_addrDetailText'>서울특별시 중구 세종대로 110 (태평로1가) 401호</div>
                    </div>
                    <div className='GGMap_addrBox GGMap_Vertical_Container'>
                      <div className='GGMap_addrNameText'>직장</div>
                      <div className="GGMap_addrLine"></div>
                      <div className='GGMap_addrDetailText'>서울특별시 강동구 동남로 892 (상일동)</div>
                    </div>
                    <div className='GGMap_addrBox GGMap_Vertical_Container'>
                      <div className='GGMap_addrNameText'>학원</div>
                      <div className="GGMap_addrLine"></div>
                      <div className='GGMap_addrDetailText'>서울 강동구 천호대로 1027 동원천호빌딩 5층</div>
                    </div>
                    <div className='GGMap_addrBox GGMap_Vertical_Container'>
                      <div className='GGMap_addrNameText'>학원</div>
                      <div className="GGMap_addrLine"></div>
                      <div className='GGMap_addrDetailText'>서울 강동구 천호대로 1027 동원천호빌딩 5층</div>
                    </div>
                    <div className='GGMap_addrBox GGMap_Vertical_Container'>
                      <div className='GGMap_addrNameText'>학원</div>
                      <div className="GGMap_addrLine"></div>
                      <div className='GGMap_addrDetailText'>서울 강동구 천호대로 1027 동원천호빌딩 5층</div>
                    </div>
                    <div className='GGMap_addrBox GGMap_Vertical_Container'>
                      <div className='GGMap_addrNameText'>학원</div>
                      <div className="GGMap_addrLine"></div>
                      <div className='GGMap_addrDetailText'>서울 강동구 천호대로 1027 동원천호빌딩 5층</div>
                    </div>

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
                        <div className='MP_FooterText_Large MP_textColor1'>천호점</div>
                        <div className='MP_FooterText_Normal MP_textColor2'>서울 강동구 천호대로 1027 동원천호빌딩 5층</div>
                    </div>
                </div>

                <div className='GGMap_ShopAddrList GGMap_ShopAddrList_Closed' ref={ShopAddrListRef}>
                  <div className='GGMap_addrBox GGMap_Vertical_Container'>
                    <div className='GGMap_addrTopBox GGMap_Horizontal_Container'>
                      <div className='GGMap_addrNameText'>천호점</div>
                      <div className='GGMap_addrDistanceText'>(50m)</div>
                    </div>
                    
                    <div className="GGMap_addrLine"></div>
                    <div className='GGMap_addrDetailText'>서울특별시 중구 세종대로 110 (태평로1가) 401호</div>
                  </div>
                  <div className='GGMap_addrBox GGMap_Vertical_Container'>
                    <div className='GGMap_addrTopBox GGMap_Horizontal_Container'>
                      <div className='GGMap_addrNameText'>강변점</div>
                      <div className='GGMap_addrDistanceText'>(370m)</div>
                    </div>
                    
                    <div className="GGMap_addrLine"></div>
                    <div className='GGMap_addrDetailText'>서울특별시 강동구 동남로 892 (상일동)</div>
                  </div>
                  <div className='GGMap_addrBox GGMap_Vertical_Container'>
                    <div className='GGMap_addrTopBox GGMap_Horizontal_Container'>
                      <div className='GGMap_addrNameText'>군자점</div>
                      <div className='GGMap_addrDistanceText'>(620m)</div>
                    </div>
                    <div className="GGMap_addrLine"></div>
                    <div className='GGMap_addrDetailText'>서울특별시 광진구 천호대로 지하550 (능동 275-5)</div>
                  </div>
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
