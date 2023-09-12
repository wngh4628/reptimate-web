import { getProduct, getProducts } from '@/service/products'
import React from 'react'
import { notFound } from 'next/navigation';
import Link from 'next/link';


type Props = {
    params: {
        slug: string;
    };
}

// export const revalidate =hgm 3;


export default async function ActionPage({ params: { slug } }: Props) {

    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    return (
        <>
            <div className='py-8 font-bold text-2xl'>
                {product.name} 의 경매입니다.
            </div>

            <div className='middle_box'>
                경매 정보 페이지 입니다.
            </div>

            <div className='absolute bottom-9 right-9'>
                <Link
                    href={{
                        pathname: `/action/${slug}/live`, // 라우팅 id
                    }}
                >
                    <div className='rounded-full bg-purple w-20 h-20'></div>
                </Link>
            </div>
        </>
    )
}

//SSG 생성
export async function generateStaticParams() {

    const products = await getProducts();
    return products.map((product) => ({
        slug: product.id
    }));
}