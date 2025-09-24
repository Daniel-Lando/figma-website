import { projectId, publicAnonKey } from './supabase/info';
import { createClient } from '@supabase/supabase-js';

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e951052c`;

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Auth functions
export async function signUp(email: string, password: string, name: string) {
  try {
    const response = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ email, password, name })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }
    
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data.session;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export async function getUserProfile(accessToken: string) {
  try {
    const response = await fetch(`${baseUrl}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch profile');
    }
    
    return data.profile;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
}

// Posts functions
export async function getPosts() {
  try {
    const response = await fetch(`${baseUrl}/posts`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch posts');
    }
    
    return data.posts;
  } catch (error) {
    console.error('Posts fetch error:', error);
    throw error;
  }
}

export async function getPost(postId: string) {
  try {
    const response = await fetch(`${baseUrl}/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch post');
    }
    
    return data.post;
  } catch (error) {
    console.error('Post fetch error:', error);
    throw error;
  }
}

export async function createPost(accessToken: string, postData: {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}) {
  try {
    const response = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(postData)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create post');
    }
    
    return data.post;
  } catch (error) {
    console.error('Post creation error:', error);
    throw error;
  }
}

export async function likePost(accessToken: string, postId: string) {
  try {
    const response = await fetch(`${baseUrl}/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update like');
    }
    
    return data;
  } catch (error) {
    console.error('Like error:', error);
    throw error;
  }
}

// Comments functions
export async function createComment(accessToken: string, postId: string, content: string) {
  try {
    const response = await fetch(`${baseUrl}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ content })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create comment');
    }
    
    return data.comment;
  } catch (error) {
    console.error('Comment creation error:', error);
    throw error;
  }
}

export async function likeComment(accessToken: string, commentId: string, postId: string) {
  try {
    const response = await fetch(`${baseUrl}/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ postId })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update comment like');
    }
    
    return data;
  } catch (error) {
    console.error('Comment like error:', error);
    throw error;
  }
}

// Categories and trending
export async function getCategories() {
  try {
    const response = await fetch(`${baseUrl}/categories`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch categories');
    }
    
    return data.categories;
  } catch (error) {
    console.error('Categories fetch error:', error);
    throw error;
  }
}

export async function getTrending() {
  try {
    const response = await fetch(`${baseUrl}/trending`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch trending');
    }
    
    return data.trending;
  } catch (error) {
    console.error('Trending fetch error:', error);
    throw error;
  }
}