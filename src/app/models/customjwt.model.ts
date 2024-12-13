import { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
  Roles: string[]; // Add roles or any other properties your JWT includes
  name: string; // Map the claim's value to this property
  emailaddress : string
}
