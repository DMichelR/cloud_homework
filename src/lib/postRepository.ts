import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Post, CreatePostData } from "../types/post";
import { uploadImage } from "./cloudinary";

async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    const response = await fetch("/api/upload", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la imagen");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

export class PostRepository {
  private collectionName = "posts";

  async createPost(
    authorUID: string,
    authorEmail: string,
    postData: CreatePostData
  ): Promise<Post> {
    const postsCollection = collection(db, this.collectionName);

    let imageData = undefined;

    if (postData.image) {
      try {
        imageData = await uploadImage(postData.image);
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Error al subir la imagen");
      }
    }

    const postToCreate = {
      title: postData.title,
      content: postData.content,
      image: imageData,
      authorUID,
      authorEmail,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(postsCollection, postToCreate);

    return {
      id: docRef.id,
      title: postData.title,
      content: postData.content,
      image: imageData,
      authorUID,
      authorEmail,
      createdAt: new Date(),
    };
  }

  async getUserPosts(authorUID: string): Promise<Post[]> {
    try {
      const postsCollection = collection(db, this.collectionName);
      const q = query(
        postsCollection,
        where("authorUID", "==", authorUID),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const posts: Post[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          image: data.image,
          authorUID: data.authorUID,
          authorEmail: data.authorEmail,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });

      return posts;
    } catch (error) {
      console.error("Error getting user posts:", error);
      return [];
    }
  }

  async deletePost(postId: string, imagePublicId?: string): Promise<void> {
    // Si el post tiene una imagen, eliminarla de Cloudinary
    if (imagePublicId) {
      try {
        await deleteImageFromCloudinary(imagePublicId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    const postDoc = doc(db, this.collectionName, postId);
    await deleteDoc(postDoc);
  }
}
