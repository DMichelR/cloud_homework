export interface PostImage {
  url: string;
  publicId: string;
}

export interface Post {
  id?: string;
  title: string;
  content: string;
  image?: PostImage;
  authorUID: string;
  authorEmail?: string;
  createdAt: Date;
}

export interface CreatePostData {
  title: string;
  content: string;
  image?: File;
}
