// 이메일: (영어대소문자+숫자) + @ + (영어소문자) + (.com)
export const validateEmail = (email: string) => {
  return /([\d\w])+@{1}([a-z])+(.com$)/.test(email);
};

// 닉네임: 특수문자제외, 공백제외, 2~8글자
export const validateNickname = (nickname: string) => {
  const lengthCondition = nickname.length >= 2 && nickname.length <= 8;

  const CharCondition = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$/.test(
    nickname
  );

  return lengthCondition && CharCondition;
};

export const validatePassword = (value: string) => {
  // 비밀번호: 8~64글자
  const lengthCondition = value.length >= 8 && value.length <= 64;

  // Check if the password contains at least one letter
  const letterCondition = /[a-zA-Z]/.test(value);

  // Check if the password contains at least one number
  const numberCondition = /\d/.test(value);

  // Check if the password contains at least one special character
  const specialCharCondition = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  return (
    lengthCondition &&
    letterCondition &&
    numberCondition &&
    specialCharCondition
  );
};
