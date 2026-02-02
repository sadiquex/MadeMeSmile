/*

create moment request is a FormData containing the following fields:
- media: File (or React Native format: { uri, type, name })
- description: string
- feeling: string
- collection: string

*/

/** React Native format for FormData file upload */
export interface MediaUpload {
  uri: string;
  type: string;
  name: string;
}

export interface CreateMomentRequest {
  media: File | MediaUpload;
  description: string;
  feeling: string;
  collection: string;
}

// {
//     "success": true,
//     "message": "Moment created with media successfully",
//     "data": {
//         "mediaUrl": "https://res.cloudinary.com/dqymfxlag/image/upload/v1770066524/users/5fbb7235-d76d-41a3-8fc3-109a86873f63/moments/w2ep8n3y4iriadq5rbgv.jpg",
//         "description": "Testing the moment with image upload",
//         "feeling": "happy",
//         "collection": "Learning",
//         "userId": "5fbb7235-d76d-41a3-8fc3-109a86873f63",
//         "id": "a9912f79-709d-4104-97c5-8a49b050245b",
//         "createdAt": "2026-02-02T21:08:45.380Z",
//         "updatedAt": "2026-02-02T21:08:45.380Z"
//     }
// }

export interface CreateMomentResponse {
  success: boolean;
  message: string;
  data: {
    mediaUrl: string;
    description: string;
    feeling: string;
    collection: string;
    userId: string;
    id: string;
    createdAt: string;
    updatedAt: string;
  };
}

// {
//     "success": true,
//     "message": "Moments retrieved successfully",
//     "data": [
//         {
//             "id": "f57c5074-78d6-485a-9c0b-1cc7b7858374",
//             "mediaUrl": "https://res.cloudinary.com/dqymfxlag/image/upload/v1770067598/users/5fbb7235-d76d-41a3-8fc3-109a86873f63/moments/zcjfzw2r1lna5zh2udv0.jpg",
//             "description": "Testing the moment with image upload",
//             "feeling": "happy",
//             "collection": "Learning",
//             "userId": "5fbb7235-d76d-41a3-8fc3-109a86873f63",
//             "createdAt": "2026-02-02T21:26:38.633Z",
//             "updatedAt": "2026-02-02T21:26:38.633Z"
//         }
//     ]
// }

export interface IMoment {
  id: string;
  mediaUrl: string;
  description: string;
  feeling: string;
  collection: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetMomentsResponse {
  success: boolean;
  message: string;
  data: IMoment[];
}

// {
//     "success": true,
//     "message": "Moment retrieved successfully",
//     "data": {
//         "id": "f57c5074-78d6-485a-9c0b-1cc7b7858374",
//         "mediaUrl": "https://res.cloudinary.com/dqymfxlag/image/upload/v1770067598/users/5fbb7235-d76d-41a3-8fc3-109a86873f63/moments/zcjfzw2r1lna5zh2udv0.jpg",
//         "description": "Testing the moment with image upload",
//         "feeling": "happy",
//         "collection": "Learning",
//         "userId": "5fbb7235-d76d-41a3-8fc3-109a86873f63",
//         "createdAt": "2026-02-02T21:26:38.633Z",
//         "updatedAt": "2026-02-02T21:26:38.633Z",
//         "user": {
//             "id": "5fbb7235-d76d-41a3-8fc3-109a86873f63",
//             "email": "abubakasaddik1@gmail.com",
//             "displayName": "saddik1",
//             "photoUrl": null,
//             "provider": "email",
//             "passwordHash": "$2b$12$SbAaLVI.9xsPoyLmD0B/x.GCllstpfTLO95qkdDUm7ycKDqN0QiOa",
//             "onboarded": false,
//             "lastLogin": "2026-02-02T21:35:34.867Z",
//             "createdAt": "2026-01-28T01:27:18.723Z",
//             "updatedAt": "2026-02-02T21:35:34.869Z"
//         }
//     }
// }

export interface IUser {
  id: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
  provider: string;
  onboarded: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetMomentByIdResponse {
  success: boolean;
  message: string;
  data: IMoment;
  user: IUser;
}
