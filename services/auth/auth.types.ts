// {
// 	"email":"abubakasaddik2@gmail.com",
// 	"password":"123456",
// 	"displayName":"jadensmith"
// }

export interface RegisterUserPayload {
  email: string;
  password: string;
  displayName: string;
}

// {
// 	"success": true,
// 	"message": "Registered successfully",
// 	"data": {
// 		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhYzVkYmJjZi0wNzg0LTQ3NWQtODkxOS03NGM1MzIwZDUxOWEiLCJpYXQiOjE3Njk3Nzg5NjAsImV4cCI6MTc3MDM4Mzc2MH0.QC2VzGXHPXrzRZkRI-aG-UrqNtsf7ATgeGIcH5RSw0w",
// 		"user": {
// 			"id": "ac5dbbcf-0784-475d-8919-74c5320d519a",
// 			"email": "abubakasaddik4@gmail.com",
// 			"displayName": "jadensmith",
// 			"photoUrl": null,
// 			"provider": "email",
// 			"onboarded": false,
// 			"lastLogin": null,
// 			"createdAt": "2026-01-30T13:15:59.979Z",
// 			"updatedAt": "2026-01-30T13:15:59.979Z"
// 		}
// 	}
// }

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      displayName: string;
      photoUrl: string | null;
      provider: string;
      onboarded: boolean;
      lastLogin: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
}

// {
// 	"email":"abubakasaddik1@gmail.com",
// 	"password":"123456"
// }

export interface LoginUserPayload {
  email: string;
  password: string;
}

// {
// 	"success": true,
// 	"message": "Logged in successfully",
// 	"data": {
// 		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmJiNzIzNS1kNzZkLTQxYTMtOGZjMy0xMDlhODY4NzNmNjMiLCJpYXQiOjE3Njk1OTk2MjMsImV4cCI6MTc3MDIwNDQyM30.gNDswqED1ln33IsYd4dXubsf8bRSTcLRYphpO48YAno",
// 		"user": {
// 			"id": "5fbb7235-d76d-41a3-8fc3-109a86873f63",
// 			"email": "abubakasaddik1@gmail.com",
// 			"displayName": "saddik1",
// 			"photoUrl": null,
// 			"provider": "email",
// 			"onboarded": false,
// 			"lastLogin": "2026-01-28T11:27:03.735Z",
// 			"createdAt": "2026-01-28T01:27:18.723Z",
// 			"updatedAt": "2026-01-28T11:27:03.738Z"
// 		}
// 	}
// }

export interface LoginUserResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      displayName: string;
      photoUrl: string | null;
      provider: string;
      onboarded: boolean;
      lastLogin: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
}
