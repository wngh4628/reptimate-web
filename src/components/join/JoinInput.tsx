"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import {
  validateEmail,
  validatePassword,
  validateNickname,
} from "../join/JoinExp";
import { register, emailSend } from "@/api/join/join";
import Swal from "sweetalert2";

export default function JoinInput() {
  const router = useRouter();

  const [canEdit, setEmailEdit] = useState(true);

  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCechkPassword] = useState("");

  const [emailCode, setEmailCode] = useState("");
  const [emailCodeChk, setEmailCodeChk] = useState("");

  const [isPremium, setIsPremium] = useState(false);

  const [agreement, setagreement] = useState(false);
  const [privacy, setprivacy] = useState(false);
  const [agreeWithMarketing, setAgreeWithMarketing] = useState(false);

  const [emailErrM, setemailErrM] = useState(false);
  const [nickErrM, setnickErrM] = useState(false);
  const [isJoinTry, setJoinTry] = useState(false);

  const onEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setEmail(value);
    setemailErrM(false);
  };
  const onEmailCodeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setEmailCodeChk(value);
  };
  const onNickNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setNickName(value);
    setJoinTry(false);
  };
  const onPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setPassword(value);
  };
  const onCheckPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setCechkPassword(value);
  };

  function onagreementHandler() {
    setagreement(!agreement);
  }
  function onprivacyHandler() {
    setprivacy(!privacy);
  }
  function onagreeWithMarketingHandler() {
    setAgreeWithMarketing(!agreeWithMarketing);
  }

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // status code 분기 처리
      router.replace("/login");
    },
    onError: (err: {
      response: { status: number; data: { errorCode: string } };
    }) => {
      if (err.response.status == 409) {
        if (err.response.data.errorCode == "EXIST_EMAIL") {
          setemailErrM(true);
        } else {
          setnickErrM(true);
          setJoinTry(true);
        }
      } else {
      }
    },
  });
  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 리프레시 막기
    if (
      validateEmail(email) &&
      validateNickname(nickName) &&
      validatePassword(password) &&
      password === checkPassword
    ) {
      mutation.mutate({
        email: email,
        nickName: nickName,
        password: password,
        agreeWithMarketing: agreeWithMarketing,
        loginMethod: "",
      });
    } else {
      alert("회원가입에 실패했습니다. 입력란을 확인 후 다시 시도해주세요.");
    }
  };

  const mutationEmailSend = useMutation({
    mutationFn: emailSend,
    onSuccess: (data) => {
      const a = JSON.stringify(data.data);
      const resulta = JSON.parse(a);
      const b = JSON.stringify(resulta.result);
      const resultb = JSON.parse(b);
      setEmailCode(resultb.signupVerifyToken);
      setEmailEdit(!canEdit);
    },
  });
  function onEmailSendHandler() {
    if (validateEmail(email)) {
      Swal.fire({
        text: "이메일이 전송 되었습니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      mutationEmailSend.mutate({ email: email, type: "NEWUSER" });
    } else {
      alert("이메일 형식에 맞게 작성해 주세요.");
    }
  }
  function onEmailCodeValidateHandler() {
    if (emailCode == emailCodeChk) {
    } else {
      alert("이메일 인증 코드를 다시 확인해주세요.");
    }
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="mt-20">
        <div className=" ml-auto mr-auto max-xl:pl-[40px] max-xl:pr-[40px] max-w-7xl">
          <div className="m-auto pt-[48px] pb-[160px] w-[400px] max-[374px]:w-full max-[374px]:pt-[23px] max-[374px]:pb-[40px]">
            <h2 className="text-[32px] tracking-[-.48px] pb-[46px] text-center">
              회원가입
            </h2>

            <div className="pb-[32px] relative">
              <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                이메일 주소*
              </h3>
              <div className="relative m-0 p-0">
                <input
                  type="email"
                  placeholder="예) repti@mate.co.kr"
                  onChange={onEmailHandler}
                  readOnly={canEdit ? false : true}
                  className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"
                />
                <button
                  type="button"
                  onClick={onEmailSendHandler}
                  className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-cente hover:text-main-color"
                >
                  인증 발송
                </button>
              </div>
              {!validateEmail(email) && (
                <p className="text-xs text-main-color">
                  올바른 형식의 이메일을 작성해 주세요.
                </p>
              )}
              {!validateEmail(email) && isJoinTry && (
                <p className="block absolute leading-[16px] text-xs text-main-color">
                  이미 가입한 이메일입니다.
                </p>
              )}
              {/* <p className=" text-[11px] text-[#f15746]"> 에러메시지 </p> */}
            </div>

            <div className="pb-[32px] relative">
              <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                인증코드
              </h3>
              <div className="relative m-0 p-0">
                <input
                  type="text"
                  placeholder=""
                  onChange={onEmailCodeHandler}
                  className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"
                />
                <button
                  type="button"
                  onClick={onEmailCodeValidateHandler}
                  className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-center hover:text-main-color"
                >
                  인증
                </button>
              </div>
            </div>

            <div className="pb-[32px] relative">
              <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                비밀번호
              </h3>
              <div className="relative m-0 p-0">
                <input
                  type="password"
                  onChange={onPasswordHandler}
                  placeholder="영문, 숫자, 특수문자 조합 8-16자"
                  className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"
                />
              </div>
              {!validatePassword(password) && (
                <p className="block absolute leading-[16px] text-xs text-main-color">
                  영문, 숫자, 특수문자를 조합하여 입력해주세요.
                </p>
              )}
            </div>

            <div className="pb-[32px] relative">
              <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                비밀번호 확인
              </h3>
              <div className="relative m-0 p-0">
                <input
                  type="password"
                  onChange={onCheckPasswordHandler}
                  className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"
                />
              </div>
            </div>

            <div className="pb-[32px] relative">
              <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                닉네임
              </h3>
              <div className="relative m-0 p-0">
                <input
                  type="nickname"
                  placeholder="2-8자 이내"
                  onChange={onNickNameHandler}
                  className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"
                />
              </div>
              {!nickErrM && isJoinTry && (
                <p className="text-xs text-main-color">
                  중복되는 닉네임이 존재합니다.
                </p>
              )}
            </div>

            <div className="pb-[40px]">
              <div className="mt-[16px] block">
                <div className="relative">
                  <div className="relative text-[0px]">
                    <input
                      id="agreement"
                      type="checkbox"
                      name=""
                      className="overflow-hidden w-[1px] h-[1px] absolute border-0 p-0 bg-clip-border"
                    />
                    <label
                      htmlFor="agreement"
                      onClick={onagreementHandler}
                      className="relative cursor-pointer inline-flex"
                    >
                      {!agreement && (
                        <img
                          className="h-[24px] w-[24px]"
                          src="/join/unchecked.png"
                          alt=""
                        />
                      )}
                      {agreement && (
                        <img
                          className="h-[24px] w-[24px]"
                          src="/join/checked.png"
                          alt=""
                        />
                      )}
                      <span className="pl-[8px] tracking-[-.07px] text-[14px] align-text-top ml-3">
                        이용약관 동의
                      </span>
                    </label>
                    <a
                      href="https://foremost-hub-705.notion.site/c3a95741989f4efcb0b8b85efd1cc62d?pvs=4"
                      className="absolute top-[2px] right-0 text-[12px] leading-[20px] tracking-[-.18px] text-[rgba(34,34,34,.5)]"
                    >
                      {" "}
                      내용 보기{" "}
                    </a>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative text-[0px]">
                    <input
                      id="privacy"
                      type="checkbox"
                      name=""
                      className="overflow-hidden w-[1px] h-[1px] absolute border-0 p-0 bg-clip-border"
                    />
                    <label
                      htmlFor="privacy"
                      onClick={onprivacyHandler}
                      className="relative cursor-pointer inline-flex"
                    >
                      {!privacy && (
                        <img
                          className="h-[24px] w-[24px]"
                          src="/join/unchecked.png"
                          alt=""
                        />
                      )}
                      {privacy && (
                        <img
                          className="h-[24px] w-[24px]"
                          src="/join/checked.png"
                          alt=""
                        />
                      )}
                      <span className="pl-[8px] tracking-[-.07px] text-[14px] align-text-top ml-3">
                        개인정보 수집 및 이용 동의
                      </span>
                    </label>
                    <a
                      href="https://foremost-hub-705.notion.site/ec25d9a0f4014962adc3298f98d53e72?pvs=4"
                      className="absolute top-[2px] right-0 text-[12px] leading-[20px] tracking-[-.18px] text-[rgba(34,34,34,.5)]"
                    >
                      {" "}
                      내용 보기{" "}
                    </a>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative text-[0px]">
                    <input
                      id="advertise"
                      type="checkbox"
                      name=""
                      className="overflow-hidden w-[1px] h-[1px] absolute border-0 p-0 bg-clip-border"
                    />
                    <label
                      htmlFor="advertise"
                      onClick={onagreeWithMarketingHandler}
                      className="relative cursor-pointer inline-flex"
                    >
                      {!agreeWithMarketing && (
                        <img
                          className="h-[24px] w-[24px]"
                          src="/join/unchecked.png"
                          alt=""
                        />
                      )}
                      {agreeWithMarketing && (
                        <img
                          className="h-[24px] w-[24px]"
                          src="/join/checked.png"
                          alt=""
                        />
                      )}
                      <span className="pl-[8px] tracking-[-.07px] text-[14px] align-text-top ml-3">
                        [선택] 광고성 정보 수신에 모두 동의합니다.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className=" items-center cursor-pointer inline-flex justify-center text-center align-middle bg-main-color text-white font-bold rounded-[12px] text-[16px] h-[52px] w-full tracking-[-.16px]"
            >
              {" "}
              가입하기{" "}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
