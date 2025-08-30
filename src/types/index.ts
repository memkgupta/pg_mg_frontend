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

  // roomCategories?: CreateRoomCategoryDto[];

  ownerId: number;
}