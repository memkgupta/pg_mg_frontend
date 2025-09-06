export interface APIResponse<T> 
{
    success:boolean,
    data?:T,
    message?:string,
    error?:string,
    nextCursor?:string|number
}
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface FormStyle{
  gapBetweenFields:number,
  formMargin?:number,
  cols?:{md:number,sm?:number,lg?:number},
  buttonSubmitColor?:string,
  formPadding?:number,
  containerClassName?:string,
  fieldClassName?:string
  
}
export interface Page<T>{
    data:T[],
    next:number|null,
    prev:number|null,
    totalResults:number
}
export interface IPgImage{
    id:string;
    url:string;
    position:number;
    caption?:string
}
export interface IPg {
  id?: string;

  name: string;

  description?: string;

  ownerName: string;

  contactNumber: string;

  email: string;

  address: string;

  city: string;

  state: string;

  pincode: string;

  isActive?: boolean;

  isVerified?: boolean;

  amenities?: string[];

  totalRooms?: number;

  images:IPgImage[]
  roomCategories?: IRoomCategory[];

  ownerId: number;
}
export interface IRoomCategory{
  id: string
  name: string
  description: string
  isAc: boolean
  noOfBeds: number
  baseRent: number
  createdAt: string
  updatedAt: string
}
export interface IRoom{
  id: string;
  noOfFreeBeds: number;
  pgId: string;
  categoryId: string;
  category?:IRoomCategory;
  roomNumber:number;
  floorNumber:number;
  pg:IPg
}
export interface IRent{
    id: string;
  tenantId: string;
  pgId: string;
  rentStatus: string;
  monthDateScheduled: number;
  lastDatePaid?: Date;
  monthsDue: number;
  amount: number;
}
export interface IReview {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  comment?: string;
  createdAt: string;
}
export interface IBooking{
        id: string;
        startDate:Date,
  userId: number;
  pgId: string;
  pg?:IPg;
  room?:IRoom;
  roomId: string;
  bookingStatus: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IDashboard{
 pg:{name:string,rent?:number,room_no:string,address:string};
    rent:{
        status:string,
        date:Date,
        
        dueMonths:number,
    };
    notices:any[];
    complaints:any[];
    activities:any[]
}
export enum ComplaintStatus{
    RESOLVED = "resolved",
    ACTIVE = "active",
    PENDING = "pending"
}
export interface ITenant{
  // tenant.dto.ts

  id: string;
  fromPlatform: boolean;
  userId?: number;
  discount: number;

  // Replace relations with IDs
  roomId: string;
  rentId?: string;

  adhaar?: string;
  photo: string;
  verification?: string;
  name: string;
  phoneNumber?: string;
  email: string;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;


}
export interface IComplaint{
      id:string;
    createdAt:Date;
    title:string;
    updatedAt:Date;
    status:ComplaintStatus;
    description:string;
    tenant:Partial<ITenant> | ITenant | string
    pg:Partial<IPg>|IPg | string
}