"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Upload, X, Image } from "lucide-react";
import type { CreatePostData } from "../types/post";

interface CreatePostFormProps {
  onSubmit: (data: CreatePostData) => Promise<boolean>;
  loading?: boolean;
}

export function CreatePostForm({
  onSubmit,
  loading = false,
}: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit({
      title: title.trim(),
      content: content.trim(),
      image: selectedImage || undefined,
    });

    if (success) {
      setTitle("");
      setContent("");
      setSelectedImage(null);
      setImagePreview(null);
    }

    setIsSubmitting(false);
  };

  const isDisabled =
    loading || isSubmitting || !title.trim() || !content.trim();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Crear Nuevo Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Escribe el título de tu post..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              placeholder="Escribe el contenido de tu post..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagen (opcional)</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="sr-only"
                />
                <Label
                  htmlFor="image"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  Seleccionar imagen
                </Label>
              </div>
              {selectedImage && (
                <span className="text-sm text-gray-600">
                  {selectedImage.name}
                </span>
              )}
            </div>

            {imagePreview && (
              <div className="relative mt-2">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="max-w-full h-48 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isDisabled} className="w-full">
            {isSubmitting ? "Creando..." : "Crear Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
