import { getProducts } from '@/service/products'
import Link from 'next/link';
import React from 'react'
type Props = {}

export const metadata = {
    title: 'ACTION',
    description: 'ACTION app',
}

// const products = ['아잔틱', '릴리 화이트', '카푸치노', '프라푸치노', '릴잔틱'];



//SSG 생성
// export async function generateStaticParams() {
// const products2 = ['아잔틱2', '릴리 화이트2', '카푸치노2', '프라푸치노2', '릴잔틱2']; 
// return products2.map(prod)
// }


export default async function Action({ }: Props) {
    const products = await getProducts();

    return (
        <>
            <div className='py-8 font-bold text-2xl'>
                경매 페이지 입니다.
            </div>

            <ul className='ul_box'>
                {products.map(({ id, name }, index) => (
                    <li key={index}>
                        <Link
                            href={{
                                pathname: `/action/${id}`, // 라우팅 id
                            }}
                        >
                            {name}
                        </Link>
                    </li>

                ))}
            </ul>
        </>
    )
}

// export default Management

