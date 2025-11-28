import { GoogleMap, InfoWindow, LoadScript } from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import '../css/GGMap.css';

  const libraries = ["places"];
export default function GGMap() {

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const addrListRef = useRef(false);
  const toggleListBtnRef = useRef(null);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [center, setCenter] = useState(null);

  const containerStyle = { width: "100%", height: "500px" };

  useEffect(()=>{
    setCenter({ lat: 37.5381679, lng: 127.1262834 });
  },[])

  const PlaceTemplate = {
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
  };

  function tempMarker()
  {
    const marker = new window.google.maps.Marker({
      position: {
        lat: 37.5381679,
        lng: 127.1262834
      },
      map: mapRef.current,
      title: "현위치",
    });

    marker.addListener("click", () => {
      setSelectedPlace(PlaceTemplate);
      setCenter({ lat: 37.5381679, lng:127.1262834 });
    });

    markersRef.current.push(marker);
    setSelectedPlace(PlaceTemplate);

    console.log("Marker temp!");
    console.log(marker);
  }




  const handleLoad = (map) => {
    
    console.log("LOADED!");

    mapRef.current = map;
    //const service = new window.google.maps.places.PlacesService(map);

    tempMarker();
  };

  function toggleAddrList() {
    //tempMarker();
    addrListRef.current.classList.toggle('GGMap_addrList_Closed');
    toggleListBtnRef.current.classList.toggle('GGMap_RightDDBtn_Closed')
  }


  return (
    <LoadScript googleMapsApiKey="AIzaSyDg6UKtr7Lv-i9XmSebhBf5NTWUnARcZLw" libraries={libraries}>
      <div className="GGMap_MainContainer">
        <div className="GGMap_InnerContainer GGMap_Horizontal_Container">
          <GoogleMap mapContainerClassName="GGMap_Left" mapContainerStyle={containerStyle} center={center} zoom={18} onLoad={handleLoad}>
                    
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
                    구글 지도에서 보기</a>
                </div>
              </InfoWindow>
            )}

          </GoogleMap>
        
          <div className="GGMap_Right">
            <div className="GGMap_RightInner GGMap_Vertical_Container">
              <div className='GGMap_RightTop'>
                <div className='MP_Footer_Box MP_HorizontalContainer MP_User'>
                    <img className='MP_Footer_Img' src={`${process.env.PUBLIC_URL}/images/profile_temp.png`} alt='profile_temp.png'/>
                    <div className='MP_Footer_TextBox MP_VerticalContainer'>
                        <div className='MP_FooterText_Large MP_textColor1'>OOO님</div>
                        <div className='MP_FooterText_Normal MP_textColor2'>서울특별시 중구 세종대로 110 (태평로1가) 401호</div>
                    </div>
                </div>
                <div className='GGMap_addrListContainer GGMap_Vertical_Container'>


                  <div className='GGMap_addrList GGMap_addrList_Closed' ref={addrListRef}>
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
                      ref={toggleListBtnRef} onClick={toggleAddrList}>
                    </button>
                  </div>
                  
                </div>
              </div>
              
              <div className='GGMap_shopListContainer'>
                <div className='MP_Footer_Box MP_HorizontalContainer MP_Shop'>
                    <img className='MP_Footer_Img' src={`${process.env.PUBLIC_URL}/images/shop_img.png`} alt='shop_img.png'/>
                    <div className='MP_Footer_TextBox MP_VerticalContainer'>
                        <div className='MP_FooterText_Large MP_textColor1'>천호점</div>
                        <div className='MP_FooterText_Normal MP_textColor2'>서울 강동구 천호대로 1027 동원천호빌딩 5층</div>
                    </div>
                </div>

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
    </LoadScript>
  );
}
