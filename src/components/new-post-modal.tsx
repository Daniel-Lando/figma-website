import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { createPost } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  accessToken: string;
}

const categories = [
  "General Discussion",
  "Gaming", 
  "Programming",
  "Design"
];

export function NewPostModal({ isOpen, onClose, onPostCreated, accessToken }: NewPostModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    category: "",
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postData.title || !postData.content || !postData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createPost(accessToken, postData);
      toast.success("Post created successfully!");
      onPostCreated();
      onClose();
      setPostData({ title: "", content: "", category: "", tags: [] });
      setTagInput("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !postData.tags.includes(tag) && postData.tags.length < 5) {
      setPostData({ ...postData, tags: [...postData.tags, tag] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPostData({
      ...postData,
      tags: postData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, questions, or insights with the community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="What's your post about?"
              value={postData.title}
              onChange={(e) => setPostData({ ...postData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={postData.category} 
              onValueChange={(value) => setPostData({ ...postData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts in detail..."
              value={postData.content}
              onChange={(e) => setPostData({ ...postData, content: e.target.value })}
              className="min-h-[120px]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                type="text"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                disabled={postData.tags.length >= 5}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addTag}
                disabled={!tagInput.trim() || postData.tags.length >= 5}
              >
                Add
              </Button>
            </div>
            {postData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {postData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Add up to 5 tags to help others find your post
            </p>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}