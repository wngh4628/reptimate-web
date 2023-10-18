// 이메일: (영어대소문자+숫자) + @ + (영어소문자) + (.com)
export const validateEmail = (email: string) => {
    return /([\d\w])+@{1}([a-z])+(.com$)/.test(email);
  };
  
  // 닉네임: 특수문자제외, 공백제외, 2~8글자
  export const validateNickname = (nickname: string) => {
    return /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/.test(nickname);
  };
  
  // 비밀번호: 8~64글자
  export const validatePassword = (value: string) => {
    return value.length >= 8 && value.length <= 64;
  };