// 이메일: (영어대소문자+숫자) + @ + (영어소문자) + (.com)
export const validateEmail = (email: string) => {
    return /([\d\w])+@{1}([a-z])+(.com$)/.test(email);
  };
  
  // 닉네임: 특수문자제외, 공백제외, 2~8글자
  export const validateNickname = (nickname: string) => {
    return /^[가-힣\d\w]{2,8}$/.test(nickname);
  };
  
  // 비밀번호: 4~10글자
  export const validatePassword = (value: string) => {
    return value.length >= 4 && value.length <= 10;
  };