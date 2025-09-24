import { useState, useEffect } from "react";
import { ForumHeader } from "./components/forum-header";
import { ForumSidebar } from "./components/forum-sidebar";
import { PostCard } from "./components/post-card";
import { PostDetail } from "./components/post-detail";
import { AuthModal } from "./components/auth-modal";
import { NewPostModal } from "./components/new-post-modal";
import { getPosts, getPost, getCurrentSession, getUserProfile } from "./utils/api";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner"; // Fixed import

// Define types for posts, session, and userProfile
import { Post } from './types';

type Session = {
  access_token?: string;
  // ...other session fields
};

type UserProfile = {
  // ...user profile fields
};

export default function App() {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [selectedPostData, setSelectedPostData] = useState<Post | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  useEffect(() => {
    loadSession();
    loadPosts();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      loadPost(selectedPost);
    }
  }, [selectedPost]);

  const loadSession = async () => {
    try {
      const currentSession = await getCurrentSession();
      setSession(currentSession);
      
      if (currentSession?.access_token) {
        const profile = await getUserProfile(currentSession.access_token);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Session load error:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts || []);
    } catch (error) {
      console.error('Posts load error:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPost = async (postId: string) => {
    try {
      const post = await getPost(postId);
      setSelectedPostData(post);
    } catch (error) {
      console.error('Post load error:', error);
      toast.error('Failed to load post');
    }
  };

  const handleAuthSuccess = () => {
    loadSession();
  };

  const handlePostCreated = () => {
    loadPosts();
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "popular") {
      return (b.likes ?? 0) - (a.likes ?? 0);
    }
    // Default to newest (pinned posts first)
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
  });

  if (selectedPostData) {
    return (
      <div className="min-h-screen bg-background">
        <ForumHeader 
          user={userProfile}
          onAuthClick={() => setShowAuthModal(true)}
          onNewPostClick={() => session ? setShowNewPostModal(true) : setShowAuthModal(true)}
          onSignOut={() => {
            setSession(null);
            setUserProfile(null);
            loadSession();
          }}
        />
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <PostDetail 
              post={selectedPostData} 
              onBack={() => {
                setSelectedPost(null);
                setSelectedPostData(null);
              }}
              accessToken={session?.access_token}
              onCommentAdded={() => selectedPost && loadPost(selectedPost)}
            />
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ForumHeader 
        user={userProfile}
        onAuthClick={() => setShowAuthModal(true)}
        onNewPostClick={() => session ? setShowNewPostModal(true) : setShowAuthModal(true)}
        onSignOut={() => {
          setSession(null);
          setUserProfile(null);
          loadSession();
        }}
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <ForumSidebar />
          </div>
          
          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Sort controls */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Latest Discussions</h2>
                <p className="text-muted-foreground">
                  {isLoading ? "Loading..." : `Join the conversation with ${posts.length} active posts`}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("newest")}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    sortBy === "newest"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy("popular")}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    sortBy === "popular"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Popular
                </button>
              </div>
            </div>
            
            {/* Posts list */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading posts...</p>
                </div>
              ) : sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => setSelectedPost(post.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No posts yet. Be the first to start a discussion!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <NewPostModal
        isOpen={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        onPostCreated={handlePostCreated}
        accessToken={session?.access_token || ""}
      />

      <Toaster />
    </div>
  );
}