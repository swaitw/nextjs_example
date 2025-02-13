export interface ServiceResponse<T > {
    success: boolean;
    data?: T
    message:string;
    error:{
        message:string;
    }
}