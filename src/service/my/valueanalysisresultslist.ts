export interface getValueAnalysisResultsList {
    status: number;
    message: string;
    result: valueAnalysisResult[];
  }

  interface valueAnalysisResult {
    idx:number;
    petName:string;
    totalScore:string;
    topImg:string;
  }

  