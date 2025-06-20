import { useState, useEffect } from "react";
import { PostRepository } from "../lib/postRepository";
import type { Post, CreatePostData } from "../types/post";
import type { User } from "firebase/auth";

const postRepository = new PostRepository();

export const usePosts = (user: User | null) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar posts del usuario
  const loadUserPosts = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);
      const userPosts = await postRepository.getUserPosts(user.uid);
      setPosts(userPosts);
    } catch (err) {
      setError("Error al cargar los posts");
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo post
  const createPost = async (postData: CreatePostData) => {
    if (!user?.uid || !user?.email) {
      setError("Usuario no autenticado");
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const newPost = await postRepository.createPost(
        user.uid,
        user.email,
        postData
      );
      setPosts((prev) => [newPost, ...prev]); // Agregar al inicio de la lista
      return true;
    } catch (err) {
      setError("Error al crear el post");
      console.error("Error creating post:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar post
  const deletePost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Buscar el post para obtener el publicId de la imagen
      const postToDelete = posts.find((post) => post.id === postId);
      const imagePublicId = postToDelete?.image?.publicId;

      await postRepository.deletePost(postId, imagePublicId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      return true;
    } catch (err) {
      setError("Error al eliminar el post");
      console.error("Error deleting post:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  // Cargar posts cuando cambie el usuario
  useEffect(() => {
    const loadPosts = async () => {
      if (!user?.uid) {
        setPosts([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userPosts = await postRepository.getUserPosts(user.uid);
        setPosts(userPosts);
      } catch (err) {
        setError("Error al cargar los posts");
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [user?.uid]);

  return {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    refreshPosts: loadUserPosts,
  };
};
