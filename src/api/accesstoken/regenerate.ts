import instance from "@/api/index";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";






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
    
        return result;
    };
    
    export const reGenerateTokenMutation = useMutation({
        mutationFn: reGenerateToken,
        onSuccess: (data) => {
          var a = JSON.stringify(data.data);
          var result = JSON.parse(a);
          var b = JSON.stringify(result.result);
          var result = JSON.parse(b);
          //setUser(result);
        },
    });


