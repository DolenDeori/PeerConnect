export interface User {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email: string;
  phoneNumber?: string;
  userProfile?: string;
  createdAt: string;
  earnings?: number;
  pushTokens?: string[];
}
