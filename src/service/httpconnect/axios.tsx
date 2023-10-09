import axios from "axios";

// const response: any = axios({
//     url: 'http://localhost:3000/iotpersonal/creat_serialboard',
//     method: 'post',
//     headers: { // 요청 헤더
//         'Content-Type': 'application/json',
//         'Authorization': token
//     },
// })

const host = "http://localhost:3000/";
// const host = "https://www.reptimate.store/";
//https://www.reptimate.store/
const token = `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4Ijo1MiwiaWF0IjoxNjg0MjkwMDM5LCJleHAiOjE3MTU4MjYwMzksImlzcyI6InJlcHRpbWF0ZS5zdG9yZSIsInN1YiI6InVzZXJJbmZvIn0.f4tCFHUcGp_hSxr_D3Qlu1xTSJM_Ee5O7McZ1NJbl-c" as string}`;

export async function createAuthInfo_axios(callback: any) {

    //const response: any = 
    const response: any = await axios({
        url: host + 'iotpersonal/creat_serialboard',
        method: 'post',
        headers: { // 요청 헤더
            'Content-Type': 'application/json',
            'Authorization': token
        },
    })
        .then(function (response) {
            callback(true, response.data);
        })
        .catch(function (error) {
            callback(false, JSON.stringify(error));
        });
}



export async function getBoardList_axios(callback: any) {
    const params = {
        page: 1,
        size: 20,
        order: "DESC",
        boardIdx: 66,
        sensor: "default",
        date: "2023-05-07",
    };

    //const response: any = 
    await axios({
        url: host + 'iotpersonal/naturelist',
        method: 'get',
        params,
        headers: { // 요청 헤더
            'Content-Type': 'application/json',
            'Authorization': token
        },
    })
        .then(function (response) {
            callback(true, response.data);
        })
        .catch(function (error) {
            callback(false, JSON.stringify(error));
        });
}


// export default createAuthInfo_axios;