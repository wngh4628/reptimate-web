"use client";

import { useForm } from 'react-hook-form';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function JoinInput() {
  return (
    <div className='relative pt-[86px]'>
        <div className=" ml-auto mr-auto max-xl:pl-[40px] max-xl:pr-[40px] max-w-7xl">
            <div className="m-auto pt-[58px] pb-[160px] w-[400px] max-[374px]:w-full max-[374px]:pt-[23px] max-[374px]:pb-[40px]">

                <h2 className=" text-[32px] tracking-[-.48px] pb-[46px] text-center">회원가입</h2>

                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">이메일 주소*</h3>
                    <div className="relative m-0 p-0">
                        <input type="email" placeholder="예) repti@mate.co.kr" className="py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"/>
                        <button type="button" 
                        className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-center">인증 발송</button>
                    </div>
                    <p data-v-6c792b84 data-v-4e1fd2e6 className="input_error">  </p>
                </div>

                <div className="input_join input_box">
                    <h3 className="input_title ess">인증코드</h3>
                    <div data-v-4e1fd2e6="" className="input_item">
                        <input data-v-4e1fd2e6="" type="email" placeholder="" className="input_txt"/>
                    </div>
                    <button data-v-43813796="" data-v-6c792b84="" type="button" className="btn btn_size_select" data-v-4e1fd2e6="">인증</button>
                    <p data-v-6c792b84="" data-v-4e1fd2e6="" className="input_error">  </p>
                </div>

                <div data-v-4e1fd2e6="" data-v-6c792b84="" className="input_box input_join has_button">
                    <h3 data-v-6c792b84="" data-v-4e1fd2e6="" className="input_title ess">비밀번호</h3>
                    <div data-v-4e1fd2e6="" className="input_item">
                        <input data-v-4e1fd2e6="" type="password" placeholder="영문, 숫자, 특수문자 조합 8-16자" className="input_txt"/>
                    </div>
                    <p data-v-6c792b84="" data-v-4e1fd2e6="" className="input_error">영문, 숫자, 특수문자를 조합하여 입력해주세요.</p>
                </div>

                <div data-v-4e1fd2e6="" data-v-6c792b84="" className="input_box input_join has_button">
                    <h3 data-v-6c792b84="" data-v-4e1fd2e6="" className="input_title ess">비밀번호 확인</h3>
                    <div data-v-4e1fd2e6="" className="input_item">
                        <input data-v-4e1fd2e6="" type="passwordchk" placeholder="영문, 숫자, 특수문자 조합 8-16자" className="input_txt"/>
                    </div>
                    <p data-v-6c792b84="" data-v-4e1fd2e6="" className="input_error">영문, 숫자, 특수문자를 조합하여 입력해주세요.</p>
                </div>

                <div data-v-4e1fd2e6="" data-v-6c792b84="" className="input_join input_box">
                    <h3 data-v-6c792b84="" data-v-4e1fd2e6="" className="input_title ess">닉네임</h3>
                    <div data-v-4e1fd2e6="" className="input_item">
                        <input data-v-4e1fd2e6="" type="text" placeholder="" className="input_txt"/>
                    </div>
                    <button data-v-43813796="" data-v-6c792b84="" type="button" className="btn btn_size_select" data-v-4e1fd2e6="">중복 확인</button>
                    <p data-v-6c792b84="" data-v-4e1fd2e6="" className="input_error"></p>
                </div>

                <div data-v-6c792b84="" className="join_terms">
                    <div data-v-6c792b84="" className="terms_box">
                        <div data-v-6c792b84="" className="check_main">
                            <div data-v-4c714e9f="" data-v-6c792b84="" className="checkbox_item">
                                <input data-v-4c714e9f="" id="group_check_1" type="checkbox" name="" className="blind"/>
                                <label data-v-4c714e9f="" htmlFor="group_check_1" className="check_label">
                                    <span data-v-4c714e9f="" className="label_txt">[필수] 만 14세 이상이며 모두 동의합니다.</span>
                                </label>
                            </div>
                            <button data-v-43813796="" data-v-6c792b84="" type="button" className="btn"></button>
                        </div>

                        <div data-v-6c792b84="" className="check_sub">
                            <div data-v-4c714e9f="" data-v-6c792b84="" className="checkbox_item">
                                <input data-v-4c714e9f="" id="agreement" type="checkbox" name="" className="blind"/>
                                <label data-v-4c714e9f="" htmlFor="agreement" className="check_label">
                                    <span data-v-4c714e9f="" className="label_txt">이용약관 동의</span>
                                </label>
                                <a data-v-6c792b84="" data-v-4c714e9f="" href="#" className="btn_view"> 내용 보기 </a>
                            </div>

                            <div data-v-4c714e9f="" data-v-6c792b84="" className="checkbox_item">
                                <input data-v-4c714e9f="" id="privacy" type="checkbox" name="" className="blind"/>
                                <label data-v-4c714e9f="" htmlFor="privacy" className="check_label">
                                    <span data-v-4c714e9f="" className="label_txt">개인정보 수집 및 이용 동의</span>
                                </label>
                                <a data-v-6c792b84="" data-v-4c714e9f="" href="#" className="btn_view"> 내용 보기 </a>
                            </div>
                        </div>
                    </div>

                    <div data-v-6c792b84="" className="terms_box">
                        <div data-v-6c792b84="" className="check_main">
                            <div data-v-4c714e9f="" data-v-6c792b84="" className="checkbox_item">
                                <input data-v-4c714e9f="" id="group_check_2" type="checkbox" name="" className="blind"/>
                                <label data-v-4c714e9f="" htmlFor="group_check_2" className="check_label">
                                    <span data-v-4c714e9f="" className="label_txt">[선택] 광고성 정보 수신에 모두 동의합니다.</span>
                                </label>
                            </div>
                            <button data-v-43813796="" data-v-6c792b84="" type="button" className="btn"></button>
                        </div>
                    </div>
                </div>

            <a href="#" className="btn btn_join full solid disabled"> 가입하기 </a>
            </div>
        </div>
    </div>
    
        
    
  );
}