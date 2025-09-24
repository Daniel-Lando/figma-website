import 'dotenv/config';
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createClient } from '@supabase/supabase-js'
import * as kv from './kv_store.js'
import { Post, Comment, UserProfile } from '../types.js'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))

app.use('*', logger(console.log))

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Utility function to generate unique IDs
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// User Authentication Routes
app.post('/make-server-e951052c/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Store user profile
    const userProfile = {
      id: data.user.id,
      email: data.user.email,
      name,
      avatar: `https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=150&h=150&fit=crop&crop=face`,
      username: email.split('@')[0],
      createdAt: new Date().toISOString(),
      postsCount: 0,
      commentsCount: 0
    }
    
    await kv.set(`user:${data.user.id}`, userProfile)
    
    return c.json({ user: data.user, profile: userProfile })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

app.get('/make-server-e951052c/auth/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    return c.json({ profile })
  } catch (error) {
    console.log('Profile fetch error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Posts Routes
app.get('/make-server-e951052c/posts', async (c) => {
  try {
    const posts = await kv.getByPrefix('post:')
    const sortedPosts = posts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    
    return c.json({ posts: sortedPosts })
  } catch (error) {
    console.log('Posts fetch error:', error)
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

app.get('/make-server-e951052c/posts/:id', async (c) => {
  try {
    const postId = c.req.param('id')
    const post = await kv.get(`post:${postId}`)
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    // Get comments for this post
    const comments = await kv.getByPrefix(`comment:${postId}:`)
    const sortedComments = comments.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    return c.json({ post: { ...post, comments: sortedComments } })
  } catch (error) {
    console.log('Post fetch error:', error)
    return c.json({ error: 'Failed to fetch post' }, 500)
  }
})

app.post('/make-server-e951052c/posts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { title, content, category, tags } = await c.req.json()
    
    if (!title || !content || !category) {
      return c.json({ error: 'Title, content, and category are required' }, 400)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404)
    }

    const postId = generateId()
    const post = {
      id: postId,
      title,
      content,
      author: {
        id: user.id,
        name: userProfile.name,
        avatar: userProfile.avatar,
        username: userProfile.username
      },
      category,
      tags: tags || [],
      replies: 0,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      isPinned: false
    }

    await kv.set(`post:${postId}`, post)
    
    // Update user's post count
    userProfile.postsCount += 1
    await kv.set(`user:${user.id}`, userProfile)

    return c.json({ post })
  } catch (error) {
    console.log('Post creation error:', error)
    return c.json({ error: 'Failed to create post' }, 500)
  }
})

app.post('/make-server-e951052c/posts/:id/like', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('id')
    const post = await kv.get(`post:${postId}`)
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    const likedBy = post.likedBy || []
    const hasLiked = likedBy.includes(user.id)

    if (hasLiked) {
      // Unlike
      post.likedBy = likedBy.filter((userId: string) => userId !== user.id)
      post.likes = Math.max(0, post.likes - 1)
    } else {
      // Like
      post.likedBy = [...likedBy, user.id]
      post.likes += 1
    }

    await kv.set(`post:${postId}`, post)
    
    return c.json({ liked: !hasLiked, likes: post.likes })
  } catch (error) {
    console.log('Like error:', error)
    return c.json({ error: 'Failed to update like' }, 500)
  }
})

// Comments Routes
app.post('/make-server-e951052c/posts/:id/comments', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('id')
    const { content } = await c.req.json()
    
    if (!content) {
      return c.json({ error: 'Content is required' }, 400)
    }

    const post = await kv.get(`post:${postId}`)
    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404)
    }

    const commentId = generateId()
    const comment = {
      id: commentId,
      postId,
      content,
      author: {
        id: user.id,
        name: userProfile.name,
        avatar: userProfile.avatar,
        username: userProfile.username
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    }

    await kv.set(`comment:${postId}:${commentId}`, comment)
    
    // Update post reply count
    post.replies += 1
    await kv.set(`post:${postId}`, post)
    
    // Update user's comment count
    userProfile.commentsCount += 1
    await kv.set(`user:${user.id}`, userProfile)

    return c.json({ comment })
  } catch (error) {
    console.log('Comment creation error:', error)
    return c.json({ error: 'Failed to create comment' }, 500)
  }
})

app.post('/make-server-e951052c/comments/:commentId/like', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const commentId = c.req.param('commentId')
    const { postId } = await c.req.json()
    
    const comment = await kv.get(`comment:${postId}:${commentId}`)
    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404)
    }

    const likedBy = comment.likedBy || []
    const hasLiked = likedBy.includes(user.id)

    if (hasLiked) {
      // Unlike
      comment.likedBy = likedBy.filter((userId: string) => userId !== user.id)
      comment.likes = Math.max(0, comment.likes - 1)
    } else {
      // Like
      comment.likedBy = [...likedBy, user.id]
      comment.likes += 1
    }

    await kv.set(`comment:${postId}:${commentId}`, comment)
    
    return c.json({ liked: !hasLiked, likes: comment.likes })
  } catch (error) {
    console.log('Comment like error:', error)
    return c.json({ error: 'Failed to update comment like' }, 500)
  }
})

// Categories and stats
app.get('/make-server-e951052c/categories', async (c) => {
  try {
    const posts = await kv.getByPrefix('post:')
    
    const categories: Record <string, number> = {
      'General Discussion': 0,
      'Gaming': 0,
      'Programming': 0,
      'Design': 0
    }
    
    posts.forEach((post: Post) => {
      if (categories.hasOwnProperty(post.category)) {
        categories[post.category]++
      }
    })
    
    return c.json({ categories })
  } catch (error) {
    console.log('Categories fetch error:', error)
    return c.json({ error: 'Failed to fetch categories' }, 500)
  }
})

app.get('/make-server-e951052c/trending', async (c) => {
  try {
    const posts = await kv.getByPrefix('post:')
    
    // Extract tags and count their usage
    const tagCounts: Record<string, any>= {}
    posts.forEach(post => {
      post.tags?.forEach((tag : string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    
    // Sort by usage and get top 5
    const trending = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag)
    
    return c.json({ trending })
  } catch (error) {
    console.log('Trending fetch error:', error)
    return c.json({ error: 'Failed to fetch trending topics' }, 500)
  }
})


serve(app)