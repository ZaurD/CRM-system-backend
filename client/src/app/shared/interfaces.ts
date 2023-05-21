export interface User {
  _id?: string;
  password: string;
  email: string;
}

export interface Category {
  _id?: string;
  imageSrc?: string;
  name: string;
  user?: string;
}

export interface Message {
  message: string;
}
