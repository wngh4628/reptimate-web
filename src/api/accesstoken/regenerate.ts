import instance from "@/api/index";
import { useMutation } from "@tanstack/react-query";
import { useSetRecoilState } from "recoil";
import { userAtom, isLoggedInState } from "@/recoil/user";


    export const reGenerateToken = async ({
        refreshToken
      }: {
        refreshToken: string;
      }) => {
        const data = {
          'refreshToken' : refreshToken
        };
        // const config = {"Content-Type": 'application/json'};
        const result = await instance.post("/auth/token", data);
    
        return result.data.result.accessToken;
    };

    export function useReGenerateTokenMutation() {
      const setUser = useSetRecoilState(userAtom);
      return useMutation({
        mutationFn: reGenerateToken,
        onSuccess: (accessToken) => {

          setUser((prevUser) => {
            if (prevUser) {
              return { ...prevUser, accessToken };
            }
            return prevUser;
          });


          
        },
      });
    }


