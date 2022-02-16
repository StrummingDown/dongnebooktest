import { atom } from "recoil";

export const userState = atom({
  key: "user",
  default: {},
});

export const loginState = atom({
  key: "login",
  default: localStorage.getItem("token"),
});

export const titleStorage = atom({
  key: "title",
  default: "",
});

export const contentStorage = atom({
  key: "content",
  default: "",
});

export const imageStorage = atom({
  key: "image",
  default: {},
});

export const searchLocation = atom({
  key: "location",
  default: "",
});

export const mapResultsStorage = atom({
  key: "mapSearchResults",
  default: [],
});

export const currentLocationStorage = atom({
  key: "currentLocation",
  default: {},
});

export const currentLatitude = atom({
  key: "currentLatitude",
  default: 0,
});

export const currentLongtitude = atom({
  key: "currentLongtitude",
  default: 0,
});

export const currentaddress = atom({
  key: "address",
  default: "",
});

export const headerState = atom({
  key: "header",
  default: false,
});
