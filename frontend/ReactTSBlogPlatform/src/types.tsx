
export interface CommentType {
    id: number;
    text: string;
    createdAt: Date;
    userName: string;
    blogPostId?: number;
  }
  
 export interface BlogPost {
    id: string;
    title: string;
    content: string;
    publishedDate: string;
    category: string;
    imageUrl: string;
    authorImageUrl: string;
    authorEmail: string;
    authorRole: string;
  }