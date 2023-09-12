import path from 'path';
import { promises as fs } from 'fs';

// export function getProducts() {
//     // const dir = path.join(process.cwd(), 'data');

//     return ['a상품', 'b상품', 'c상품', 'd상품', 'e상품', 'f상품'];
// }
export type Product = {
    id: string;
    name: string;
    price: number;
};

export async function getProducts(): Promise<Product[]> {
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}


export async function getProduct(id: string): Promise<Product | undefined> {
    const products = await getProducts();
    return products.find((item) => item.id === id);
}
