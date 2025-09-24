export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  username: string;
  createdAt: string;
  postsCount: number;
  commentsCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
  createdAt: string;
  likes: number;
  likedBy: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
  category: string;
  tags: string[];
  replies: number;
  likes: number;
  likedBy: string[];
  createdAt: string;
  isPinned: boolean;
  comments: Comment[];
}