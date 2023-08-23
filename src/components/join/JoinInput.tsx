"use client";

import { useForm } from 'react-hook-form';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function JoinInput() {




    
  return (
    <div className=''>
        <div className=" ml-auto mr-auto max-xl:pl-[40px] max-xl:pr-[40px] max-w-7xl">
            <div className="m-auto pt-[48px] pb-[160px] w-[400px] max-[374px]:w-full max-[374px]:pt-[23px] max-[374px]:pb-[40px]">

                <h2 className="text-[32px] tracking-[-.48px] pb-[46px] text-center">회원가입</h2>

                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">이메일 주소*</h3>
                    <div className="relative m-0 p-0">
                        <input type="email" placeholder="예) repti@mate.co.kr" className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"/>
                        <button type="button" 
                        className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-center">인증 발송</button>
                    </div>
                    <p className="hidden">  </p>
                    <p className="block absolute leading-[16px] text-[11px] text-[#f15746]"> 에러메시지 </p>
                </div>

                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">인증코드</h3>
                    <div className="relative m-0 p-0">
                        <input type="email_code" placeholder="" className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"/>
                        <button type="button" 
                        className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-center">인증</button>
                    </div>
                    <p className="input_error">  </p>
                </div>

                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">비밀번호</h3>
                    <div className="relative m-0 p-0">
                        <input type="password" placeholder="영문, 숫자, 특수문자 조합 8-16자" className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"/>
                    </div>
                    <p className="hidden">영문, 숫자, 특수문자를 조합하여 입력해주세요.</p>
                </div>

                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">비밀번호 확인</h3>
                    <div className="relative m-0 p-0">
                        <input type="passwordchk" placeholder="영문, 숫자, 특수문자 조합 8-16자" className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"/>
                    </div>
                    <p className="hidden">영문, 숫자, 특수문자를 조합하여 입력해주세요.</p>
                </div>

                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">닉네임</h3>
                    <div className="relative m-0 p-0">
                        <input type="nickname" placeholder="" className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"/>
                        <button type="button" 
                        className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-center">중복 확인</button>
                    </div>
                    <p className="input_error">  </p>
                </div>

                <div className="pb-[40px]">
                    <div className="mt-[16px] block">

                        <div className="relative">
                            <div className="relative text-[0px]">
                                <input id="agreement" type="checkbox" name="" className="overflow-hidden w-[1px] h-[1px] absolute border-0 p-0 bg-clip-border"/>
                                <label htmlFor="agreement" className="relative cursor-pointer inline-flex">
                                    <img className="h-[24px] w-[24px]" src="/join/unchecked.png" alt="" />
                                    <span className="pl-[8px] tracking-[-.07px] text-[14px] align-text-top ml-3">이용약관 동의</span>
                                </label>
                                <a href="#" className="absolute top-[2px] right-0 text-[12px] leading-[20px] tracking-[-.18px] text-[rgba(34,34,34,.5)]"> 내용 보기 </a>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative text-[0px]">
                                <input id="privacy" type="checkbox" name="" className="overflow-hidden w-[1px] h-[1px] absolute border-0 p-0 bg-clip-border"/>
                                <label htmlFor="privacy" className="relative cursor-pointer inline-flex">
                                    <img className="h-[24px] w-[24px]" src="/join/unchecked.png" alt="" />
                                    <span className="pl-[8px] tracking-[-.07px] text-[14px] align-text-top ml-3">개인정보 수집 및 이용 동의</span>
                                </label>
                                <a href="#" className="absolute top-[2px] right-0 text-[12px] leading-[20px] tracking-[-.18px] text-[rgba(34,34,34,.5)]"> 내용 보기 </a>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative text-[0px]">
                                <input id="advertise" type="checkbox" name="" className="overflow-hidden w-[1px] h-[1px] absolute border-0 p-0 bg-clip-border"/>
                                <label htmlFor="advertise" className="relative cursor-pointer inline-flex">
                                    <img className="h-[24px] w-[24px]" src="/join/unchecked.png" alt="" />
                                    <span className="pl-[8px] tracking-[-.07px] text-[14px] align-text-top ml-3">[선택] 광고성 정보 수신에 모두 동의합니다.</span>
                                </label>
                                <a href="#" className="absolute top-[2px] right-0 text-[12px] leading-[20px] tracking-[-.18px] text-[rgba(34,34,34,.5)]"> 내용 보기 </a>
                            </div>
                        </div>

                    </div>

                </div>

            <a href="#" className=" items-center cursor-pointer inline-flex justify-center text-center align-middle bg-main-color text-white font-bold rounded-[12px] text-[16px] h-[52px] w-full tracking-[-.16px]"> 가입하기 </a>
            </div>
        </div>
    </div>
    
        
    
  );
}