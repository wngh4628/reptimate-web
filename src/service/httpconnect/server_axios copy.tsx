// import fetch from 'isomorphic-unfetch';
import axios from "axios";

// const host = "http://localhost:3000/";
const host = "https://api.reptimate.store/";
const token = `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4Ijo5NywiaWF0IjoxNjkwMTY3NDQ5LCJleHAiOjE2OTEzNzcwNDl9.uEdFGztR7TJk46-YUeuG4kAE5p5UrKsdFKdP5YmXHG4" as string}`;
// const params: any = {
//     page: 1,
//     size: 20,
//     order: "DESC",
//     boardIdx: 66,
//     sensor: "default",
//     date: "2023-05-07",
// };



// interface Props_data {
//     pageSize: number,
//     totalCount: number,
//     totalPage: number,
//     existsNextPage: boolean,
//     items: Props_data2,
// }
// type Props_data2 = {
//     idx: number,
//     currentTemp: number,
//     currentHumid: number
//     currentTemp2: number
//     currentHumid2: number
//     type: number
// }


// //callback으로 받아올 경우
// export const getServerSideProps = async (callback: (a: Props_data2) => void) => {
//     // try {
//     // 깃허브 api 중 유저의 정보를 받아오는 api를 사용
//     const res: any = await axios({
//         url: host + 'iotpersonal/naturelist',
//         method: 'get',
//         params,
//         headers: { // 요청 헤더
//             'Content-Type': 'application/json',
//             'Authorization': token
//         },
//     })
//         .then(async function (response) {

//             console.log(response.data);

//             // const result: JSON = await response.data;
//             const result: Props_data = await response.data.result;

//             // console.log("result");
//             // console.log(result.existsNextPage);
//             // console.log(result.pageSize);
//             // console.log(result.totalCount);
//             // console.log(result.items);

//             // const result: JSON = await response.data.result.items;

//             // callback({ props: result });
//             callback(result.items);
//         })
//         .catch(function (error) {
//             // callback(false, JSON.stringify(error));
//         });
// }



interface user {
    idx: number,
    nickname: string,
    profilePath: string,
}
interface boardAction {
    boardIdx: number,
    buyPrice: number,
    gender: number,
    liveEndTime: Date,
    liveStartTime: Date,
    liveState: number,
    pattern: string,
    unit: number,
    size: string,
    startPrice: string,
    state: number,
    streamKey: string,
}
interface images {
    images: JSON,
}
interface result_Props {
    title:string,
    userIdx:number,
    writeDate:Date,
    UserInfo: user,
    boardAction: boardAction,
    images: images,
}
const params: any = {
    userIdx: 65,
};
//
export const getActionInfo = async (callback: (a: result_Props) => void) => {
    // try {
    // 깃허브 api 중 유저의 정보를 받아오는 api를 사용
    const res: any = await axios({
        url: host + 'board/279',
        method: 'get',
        params,
        headers: { // 요청 헤더
            'Content-Type': 'application/json',
            'Authorization': token
        },
    })
        .then(async function (response) {

            console.log(response.data);

            // const result: JSON = await response.data;
            const result: result_Props = await response.data.result;

            // console.log("result");
            // console.log(result.existsNextPage);
            // console.log(result.pageSize);
            // console.log(result.totalCount);
            // console.log(result.items);

            // const result: JSON = await response.data.result.items;

            // callback({ props: result });
            callback(result);
        })
        .catch(function (error) {
            // callback(false, JSON.stringify(error));
        });
}