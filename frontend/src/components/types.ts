export interface AuthorInfo {
    _id: string;
    name: string;
    username: string;
    avatarUrl: string;
  }
  
  export interface File {
    name: string;
    contentType: string;
    data: ArrayBuffer;
  }
  
  export interface Comment {
    commentId: string;
    userId: string;
    content: string;
    upvotes: string[];
    downvotes: string[];
    userName: string;
    authorInfo?: AuthorInfo; // Enriched using userId
    createdAt: string;
  }
  
  export interface Thread {
    _id: string;
    title: string;
    content: string;
    tags?: string[];
    authorId: string;
    authorInfo?: AuthorInfo; // Enriched using authorId
    comments: Comment[];
    upvotes: string[];
    downvotes: string[];
    file?: File;
    createdAt: string;
  }
  