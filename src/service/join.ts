export interface joinEmailResponse {
    status: number;
    message: string;
    result: {
        signupVerifyToken: string;
    };
  }