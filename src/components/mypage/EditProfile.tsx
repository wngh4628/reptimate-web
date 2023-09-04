"use client"
import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSetRecoilState } from "recoil";

import { getAccountInfo } from "@/api/my/info";
import { userAtom, isLoggedInState } from "@/recoil/user";

import  { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate"

interface FileItem {
    file: File;
    id: number;
}
  
export default function EditProfileInput() {
    const setUser = useSetRecoilState(userAtom);
    const setIsLoggedIn = useSetRecoilState(isLoggedInState);
    const reGenerateTokenMutation = useReGenerateTokenMutation();

    const router = useRouter();

    const imgRef = useRef<HTMLImageElement | null>(null);
    const fileInput = useRef<HTMLInputElement | null>(null);

    const [accessToken, setAccessToken] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickName] = useState("");
    const [warningMsg, setWarningMsg] = useState(false);
    const [image, setImage] = useState(
        "/img/reptimate_logo.png"
    );

    const formData = new FormData();

    const pathName = usePathname() || "";

    useEffect(() => {
        const storedData = localStorage.getItem('recoil-persist');
        if (storedData) {
            const userData = JSON.parse(storedData);
            if (userData.USER_DATA.accessToken != null) {
                const extractedAccessToken = userData.USER_DATA.accessToken;
                setAccessToken(extractedAccessToken);
                console.log(accessToken)    
                getUserInfo(extractedAccessToken);
                //mutation.mutate({ accessToken: extractedAccessToken });
            } else {
                router.replace("/");
                alert("로그인이 필요한 기능입니다.");
            }
        }
    }, [pathName])

    const handleLogin = () => {

    };

  // useQuery를 이용하여 데이터를 가져옵니다.
  const getUserInfo = async (accessToken: string) => {
    fetch(`https://api.reptimate.store/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        //if (!res.ok) throw new Error('http 에러');
        return res.json();
      })
      .then((data) => {
        console.log(data.result);
        setEmail(data.result.email);
        setNickName(data.result.nickname);
        setImage(data.result.profilePath);

      })
      .catch((e) => alert(e.message));
    };


    const handleImageClick = () => {
        if (fileInput.current) {
          fileInput.current.click();
        }
    };
    
    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target || !e.target.files || !e.target.files[0]) return;
    
        const file = e.target.files[0];
        const reader = new FileReader();
    
        // 파일 읽기 완료 후의 동작을 정의합니다.
        reader.onload = (event) => {
          if (event && event.target && event.target.result) {
            // 파일을 미리보기하기 위해 이미지 URL을 상태로 설정합니다.
            setImage(event.target.result as string);
          }
        };
    
        // 파일 읽기 작업을 수행합니다.
        reader.readAsDataURL(file);
        // formData에 이미지 파일을 추가합니다.
        formData.append("image", file);
    };

    const onEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target as any;
        setEmail(value);
    };
    const onNickNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target as any;
        setNickName(value);
    };


  return (
    <form className='w-full'>
    <div >
        <div className=" ml-auto mr-auto max-xl:pl-[40px] max-xl:pr-[40px] max-w-7xl">
            <div className="m-auto pb-[160px] w-[400px] max-[374px]:w-full max-[374px]:pt-[23px] max-[374px]:pb-[40px]">

                <h2 className="text-[32px] tracking-[-.48px] pb-[46px] text-center">내 정보 수정</h2>

                <a 
                className="flex justify-center align-middle items-center" onClick={handleImageClick} >
                    <img className="h-[250px] w-[250px] rounded-[50%] border-2 mb-[50px]"
                     src={image} alt="" ref={imgRef}/>
                    <input type="file" name="image_URL" id="input-file" accept='image/*'
		            className="hidden" onChange={handleImageChange}
                    // 클릭할 때 마다 file input의 value를 초기화 하지 않으면 버그가 발생할 수 있다
                    // 사진 등록을 두개 띄우고 첫번째에 사진을 올리고 지우고 두번째에 같은 사진을 올리면 그 값이 남아있음!
                    ref={fileInput} />
                </a>
                

                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">이메일 주소*</h3>
                    <div className="relative m-0 p-0">
                        <input type="email" placeholder="예) repti@mate.co.kr" onChange={onEmailHandler} value={email}
                        className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"/>
                        <button type="button" 
                        className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-cente hover:text-main-color">인증 발송</button>
                    </div>
                    
                    {/* <p className=" text-[11px] text-[#f15746]"> 에러메시지 </p> */}
                </div>

                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">인증코드</h3>
                    <div className="relative m-0 p-0">
                        <input type="text" placeholder="" 
                        className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"/>
                        <button type="button" 
                        className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-center hover:text-main-color">인증</button>
                    </div>
                </div>

                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">비밀번호</h3>
                    <div className="relative m-0 p-0">
                        <input type="password" placeholder="영문, 숫자, 특수문자 조합 8-16자"
                        className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"/>
                    </div>
                    
                </div>

                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">비밀번호 확인</h3>
                    <div className="relative m-0 p-0">
                        <input type="password"
                        className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"/>
                    </div>
                </div>

                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">닉네임</h3>
                    <div className="relative m-0 p-0">
                        <input type="nickname" placeholder="2-8자 이내" onChange={onNickNameHandler} value={nickname}
                        className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"/>
                    </div>
                </div>

                <div className="pb-[40px]">
                    <div className="mt-[16px] block">

                        <div className="relative">
                            <div className="relative text-[0px]">
                                <input id="agreement" type="checkbox" name="" className="overflow-hidden w-[1px] h-[1px] absolute border-0 p-0 bg-clip-border"/>
                                <label htmlFor="agreement"
                                className="relative cursor-pointer inline-flex">
                                    
                                    <span className="pl-[8px] tracking-[-.07px] text-[14px] align-text-top ml-3">이용약관 동의</span>
                                </label>
                                <a href="#" className="absolute top-[2px] right-0 text-[12px] leading-[20px] tracking-[-.18px] text-[rgba(34,34,34,.5)]"> 내용 보기 </a>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative text-[0px]">
                                <input id="privacy" type="checkbox" name="" className="overflow-hidden w-[1px] h-[1px] absolute border-0 p-0 bg-clip-border"/>
                                <label htmlFor="privacy" 
                                className="relative cursor-pointer inline-flex">
                                    
                                    <span className="pl-[8px] tracking-[-.07px] text-[14px] align-text-top ml-3">개인정보 수집 및 이용 동의</span>
                                </label>
                                <a href="#" className="absolute top-[2px] right-0 text-[12px] leading-[20px] tracking-[-.18px] text-[rgba(34,34,34,.5)]"> 내용 보기 </a>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative text-[0px]">
                                <input id="advertise" type="checkbox" name="" className="overflow-hidden w-[1px] h-[1px] absolute border-0 p-0 bg-clip-border"/>
                                <label htmlFor="advertise" 
                                className="relative cursor-pointer inline-flex">
                                    <span className="pl-[8px] tracking-[-.07px] text-[14px] align-text-top ml-3">[선택] 광고성 정보 수신에 모두 동의합니다.</span>
                                </label>
                                <a href="#" className="absolute top-[2px] right-0 text-[12px] leading-[20px] tracking-[-.18px] text-[rgba(34,34,34,.5)]"> 내용 보기 </a>
                            </div>
                        </div>

                    </div>

                </div>

            <button type='submit' 
            className=" items-center cursor-pointer inline-flex justify-center text-center align-middle bg-main-color text-white font-bold rounded-[12px] text-[16px] h-[52px] w-full tracking-[-.16px]">
                수정하기 </button>
            </div>
        </div>
    </div>
    </form>
        
    
  );
}