import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import '../css/GGMap.css';

  const libraries = ["places"];
export default function FoodPlaceSelector() {

    //const defaultPlaceId = "ChIJY2dm7EZvZDURcQ0PwHQ5Mn4"; // 하이미디어 천호점
    const defaultlatlng = { lat: 37.5381679, lng: 127.1262834 };
    const defaultPlaceDetails = {
    name: "하이미디어 천호점",
    formatted_address: "서울특별시 강동구 천호동 ...",
    rating: 4.3,
    geometry: { location: { lat: () => 37.5381679, lng: () => 127.1262834 } },
    photos: [], // 필요하면 미리 설정 가능
    place_id: null//defaultPlaceId
    };

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const addrListRef = useRef(false);
  const toggleListBtnRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(defaultlatlng);
  const [placeDetails, setPlaceDetails] = useState(defaultPlaceDetails);
  const [center, setCenter] = useState(null);

  const containerStyle = { width: "100%", height: "500px" };

  useEffect(()=>{
    setCenter(defaultlatlng);
  },[])

  useEffect(() => {
  if (!mapRef.current) return;

  // 기존 마커 제거
  markersRef.current.forEach(marker => marker.setMap(null));
  markersRef.current = [];

  // 새 마커 생성
  results.forEach(place => {
    const marker = new window.google.maps.Marker({
      position: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
      map: mapRef.current,
      title: place.name,
    });

    marker.addListener("click", () => {
      setSelectedPlace(place);
      setCenter({ lat:place.geometry.location.lat(), lng:place.geometry.location.lng() });
    });

    markersRef.current.push(marker);
  });
}, [results]);


  function SearchResultBox()
  {
    return(
      <>
      {results.map((place, i) => (
        <div
          key={i}
          style={{ marginBottom: "12px", borderBottom: "1px solid #ccc", paddingBottom: "8px", cursor: "pointer" }}
          onClick={() => {
            setSelectedPlace(place);
            setSelectedMarker({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
            setCenter({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
          }}
        >
          <b>⭐ {place.rating || "N/A"} {place.name}</b>
          <div>{place.formatted_address}</div>
        </div>
      ))}
      </>
    )
  }


  const handleLoad = (map) => {
    
  if (!defaultPlaceDetails.place_id) {
    mapRef.current = map;
    setCenter(defaultlatlng);
    return;
  }

    const service = new window.google.maps.places.PlacesService(map);

    // 초기 place_id 정보 가져오기
    service.getDetails(
      {
        placeId: defaultPlaceDetails.place_id,//defaultPlaceId,
        fields: ["name", "geometry", "formatted_address", "rating", "photos", "place_id"],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaceDetails(place);
          setSelectedMarker({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
          setCenter({lat:selectedMarker.lat, lng:selectedMarker.lng});
        }
      }
    );
  };

  const searchPlace = () => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.textSearch({ query }, (res, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setResults(res);
      }
    });
  };

  function toggleAddrList() {
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
                key={selectedPlace.place_id} // 이 부분을 추가
                options={{
                  pixelOffset: new window.google.maps.Size(0, -30) // X축 0, Y축 -30만큼 위로 이동
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


                  <div className='GGMap_addrList' ref={addrListRef}>
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

                    <button className="GGMap_RightDDBtn GGMap_RightDDBtn_Open" 
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

              <SearchResultBox style={{ marginTop: "16px" }}>
              </SearchResultBox>

              {selectedPlace && (
                <div style={{ marginTop: "16px", padding: "8px", border: "1px solid #888" }}>
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
                    구글 지도에서 보기
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}
