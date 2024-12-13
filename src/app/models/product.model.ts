export interface product {
    id: string,
    code: string,
    name: string;
    description: string,
    price: number,   
    isActive: boolean

}

export interface createproduct {  
    id?:string,
    code: string,
    name: string,
    description: string,
    price: number 
}

export interface productstatus {  
    id?:string,
    status: RecordStatusEnum,  
}

//enums
export enum RecordStatusEnum {
    Active = 1,
    InActive = 2,
  }


