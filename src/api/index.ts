import axios from "axios";
import { Console } from "console";
import { useEffect } from "react";




const instance = axios.create({
  baseURL: "https://api.reptimate.store",
});

// 요청 타임아웃 설정
instance.defaults.timeout = 10000;

// 요청 인터셉터 추가
instance.interceptors.request.use(
    (config) => {
      // 요청을 보내기 전에 수행할 로직
      return config;
    },
    (error) => {
      // 요청 에러가 발생했을 때 수행할 로직
      console.log(error); // 디버깅
      return Promise.reject(error);
    }
  );
  
  // 응답 인터셉터 추가
  instance.interceptors.response.use(
    (response) => {
      // 응답에 대한 로직 작성
      const res = response.data;

      return response;
    },
    (error) => {
      // 응답에 에러가 발생했을 때 수행할 로직
      console.log(error); // 디버깅
      return Promise.reject(error);
    }
  );

export default instance;