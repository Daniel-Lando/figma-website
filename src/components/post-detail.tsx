import { useState } from "react";
import { MessageCircle, ThumbsUp, ThumbsDown, Share, Flag, Clock, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { createComment, likePost, likeComment } from "../utils/api";
import { toast } from "sonner";
import { Post, Comment } from '../types';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  accessToken?: string;
  onCommentAdded?: () => void;
}

export function PostDetail({ post, onBack, accessToken, onCommentAdded }: PostDetailProps) {
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(post.likes);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLikingPost, setIsLikingPost] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    if (!accessToken) {
      toast.error("Please sign in to comment");
      return;
    }

    setIsSubmittingComment(true);
    
    try {
      await createComment(accessToken, post.id, newComment);
      setNewComment("");
      toast.success("Comment added successfully!");
      onCommentAdded?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLikePost = async () => {
    if (!accessToken) {
      toast.error("Please sign in to like posts");
      return;
    }

    setIsLikingPost(true);
    
    try {
      const result = await likePost(accessToken, post.id);
      setIsLiked(result.liked);
      setPostLikes(result.likes);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update like");
    } finally {
      setIsLikingPost(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!accessToken) {
      toast.error("Please sign in to like comments");
      return;
    }

    try {
      await likeComment(accessToken, commentId, post.id);
      onCommentAdded?.(); // Refresh the post to get updated comment likes
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update comment like");
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to forum
      </Button>

      {/* Main post */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Post header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{post.author.name}</h3>
                    <span className="text-muted-foreground">@{post.author.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(post.createdAt)}
                    <span>•</span>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Flag className="h-4 w-4" />
              </Button>
            </div>

            {/* Post content */}
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold">{post.title}</h1>
              <p className="text-muted-foreground leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Post actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <Button
                  variant={isLiked ? "default" : "ghost"}
                  size="sm"
                  onClick={handleLikePost}
                  disabled={isLikingPost}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {isLikingPost ? "..." : postLikes}
                </Button>
                <Button variant="ghost" size="sm">
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  0
                </Button>
                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {post.comments.length} replies
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add comment */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <h3 className="font-semibold">Add a reply</h3>
            <Textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment} 
                disabled={!newComment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? "Posting..." : "Post Reply"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      <div className="space-y-4">
        <h3 className="font-semibold">{post.comments.length} Replies</h3>
        {post.comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback>
                        {comment.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.author.name}</span>
                        <span className="text-muted-foreground text-sm">@{comment.author.username}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{comment.content}</p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {comment.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}