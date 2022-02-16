import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import iconblack from "../../img/iconblack.png";
import loading from "../../img/loading.gif";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  searchLocation,
  mapResultsStorage,
  currentLocationStorage,
  currentLatitude,
  currentLongtitude,
  currentaddress,
} from "../../state";
import { createNumericLiteral } from "typescript";

declare global {
  interface Window {
    kakao: any;
  }
}

const ExchangeLocation = styled.div`
  margin-top: 10px;
  width: 95%;
  height: 400px;
`;

const Conatiner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 400px;
  color: grey;
`;
const Loading = styled.img`
  margin-top: 10px;
`;

type KakaoMap = {
  panTo(arg: any): any;
  setCenter(arg: any): any;
};

const Map = () => {
  const place = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [marker, setMarker] = useState<any>(null);
  const [infowindow, setInfoWindow] = useState<any>(new window.kakao.maps.InfoWindow({ zindex: 1 }));
  const [geocoder, setGeocoder] = useState<any>(new window.kakao.maps.services.Geocoder());
  const latitude = useSetRecoilState(currentLatitude);
  const longtitude = useSetRecoilState(currentLongtitude);
  const storeaddress = useSetRecoilState(currentaddress);
  const searchContent = useRecoilValue(searchLocation);
  const currentLocation = useRecoilValue(currentLocationStorage);
  const setMapSearchResults = useSetRecoilState(mapResultsStorage);
  const imageSrc = iconblack;
  const imageSize = new window.kakao.maps.Size(64, 69);
  const imageOption = { offset: new window.kakao.maps.Point(35, 69) };
  const makerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  // 주소-좌표 변환 객체를 생성합니다
  // const geocoder = new window.kakao.maps.services.Geocoder();

  function searchDetailAddrFromCoords(coords: any, callback: any) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  }

  useEffect(() => {
    const container = place.current;
    //인포윈도우
    // const infowindow = new window.kakao.maps.InfoWindow({ zindex: 1 });

    let a;
    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      a = "a";

      let locPosition = new window.kakao.maps.LatLng(lat, lon);
      let kakaoMap = new window.kakao.maps.Map(container, {
        center: locPosition,
      });

      window.kakao.maps.event.addListener(kakaoMap, "tilesloaded", () => {
        setMapLoaded(true);
      });

      kakaoMap.setCenter(locPosition);
      displayMarker(locPosition);

      //현재위치 설정하는것

      function displayMarker(locPosition: any) {
        // 마커를 생성합니다
        let marker = new window.kakao.maps.Marker({
          map: kakaoMap,
          position: locPosition,
          image: makerImage,
        });
        setMarker(marker);

        searchDetailAddrFromCoords(locPosition, function (result: any, status: any) {
          storeaddress(
            result[0].address.region_1depth_name +
              " " +
              result[0].address.region_2depth_name +
              " " +
              result[0].address.region_3depth_name
          );

          let detailAddr = !!result[0].road_address
            ? "<div>도로명주소 : " + result[0].road_address.address_name + "</div>"
            : "";
          detailAddr += "<div>지번 주소 : " + result[0].address.address_name + "</div>";

          let content = '<div class="bAddr" style="width:250px; padding:5px">' + detailAddr + "</div>";

          marker.setPosition(locPosition);
          marker.setMap(kakaoMap);

          infowindow.setContent(content);
          infowindow.open(kakaoMap, marker);
        });

        window.kakao.maps.event.addListener(kakaoMap, "click", function (mouseEvent: any) {
          console.log("마우스이벤트정보", mouseEvent);
          // 클릭한 위도, 경도 정보를 가져옵니다
          searchDetailAddrFromCoords(mouseEvent.latLng, function (result: any, status: any) {
            storeaddress(
              result[0].address.region_1depth_name +
                " " +
                result[0].address.region_2depth_name +
                " " +
                result[0].address.region_3depth_name
            );
            let detailAddr = !!result[0].road_address
              ? "<div>도로명주소 : " + result[0].road_address.address_name + "</div>"
              : "";
            detailAddr += "<div>지번 주소 : " + result[0].address.address_name + "</div>";

            let content = '<div class="bAddr" style="width:250px; padding:5px">' + detailAddr + "</div>";

            map?.setCenter(mouseEvent.latLng);
            marker.setPosition(mouseEvent.latLng);
            marker.setMap(kakaoMap);

            console.log("위도", mouseEvent.latLng?.getLat());
            console.log("경도", mouseEvent.latLng?.getLng());

            latitude(mouseEvent.latLng?.getLat());
            longtitude(mouseEvent.latLng?.getLng());

            infowindow.setContent(content);
            infowindow.open(kakaoMap, marker);
          });
        });
      }

      console.log("위도2", lat, "type", typeof lat);
      console.log("경도2", lon);
      setMap(kakaoMap);
      latitude(lat);
      longtitude(lon);
    });

    console.log("A는?", a); // "a"

    // 지도 중심좌표를 접속위치로 변경합니다
  }, []);

  useEffect(() => {
    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(searchContent, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        console.log("검색reuslt결과", result);
        setMapSearchResults(result);
        // console.log("results -> ", result);
        // const firstItem = result[0];
        // const { y, x } = firstItem;Z

        // const moveLatLng = new window.kakao.maps.LatLng(y, x);
        // map?.panTo(moveLatLng);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 없습니다.");
      } else {
        // alert("서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    });
  }, [searchContent]);

  useEffect(() => {
    let coords: any = currentLocation;
    const moveLatLng = new window.kakao.maps.LatLng(coords.y, coords.x);
    console.log("위도??", coords.y);
    console.log("경도?", coords.x);
    latitude(coords.y);
    longtitude(coords.x);
    map?.panTo(moveLatLng);
    marker?.setPosition(moveLatLng);
    searchDetailAddrFromCoords(moveLatLng, function (result: any, status: any) {
      storeaddress(
        result[0].address.region_1depth_name +
          " " +
          result[0].address.region_2depth_name +
          " " +
          result[0].address.region_3depth_name
      );
      if (result) {
        let detailAddr = !!result[0]?.road_address
          ? "<div>도로명주소 : " + result[0]?.road_address.address_name + "</div>"
          : "";
        detailAddr += "<div>지번 주소 : " + result[0]?.address.address_name + "</div>";

        let content = '<div class="bAddr" style="width:250px; padding:5px">' + detailAddr + "</div>";
        marker?.setPosition(moveLatLng);
        marker?.setMap(map);

        infowindow.setContent(content);
        infowindow.open(map, marker);
      }
    });
  }, [currentLocation]);

  return (
    <ExchangeLocation ref={place}>
      {mapLoaded ? null : (
        <Conatiner>
          now loading...
          <Loading src={loading} />
        </Conatiner>
      )}
    </ExchangeLocation>
  );
};

export default Map;
