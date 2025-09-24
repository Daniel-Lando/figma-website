export const mockPosts = [
  {
    id: 1,
    title: "What's the best approach to learning React in 2025?",
    content: "I'm a complete beginner to React and want to know the most effective way to start learning. Should I focus on functional components first, or learn class components too? Any recommendations for tutorials or courses?",
    author: {
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnMlMjBwZW9wbGV8ZW58MXx8fHwxNzU3NDk0NDYzfDA&ixlib=rb-4.1.0&q=80&w=150",
      username: "alexc"
    },
    category: "Programming",
    replies: 23,
    likes: 45,
    createdAt: "2 hours ago",
    isPinned: true,
    tags: ["react", "beginner", "learning"],
    comments: [
      {
        id: 1,
        content: "I'd recommend starting with functional components and hooks. That's the modern way to write React. Skip class components for now unless you're working with legacy code.",
        author: {
          name: "Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnMlMjBwZW9wbGV8ZW58MXx8fHwxNzU3NDk0NDYzfDA&ixlib=rb-4.1.0&q=80&w=150",
          username: "sarahj"
        },
        createdAt: "1 hour ago",
        likes: 12
      },
      {
        id: 2,
        content: "The React documentation is actually really good now. I'd start there, then move to building small projects. Practice is key!",
        author: {
          name: "Mike Davis",
          avatar: "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnMlMjBwZW9wbGV8ZW58MXx8fHwxNzU3NDk0NDYzfDA&ixlib=rb-4.1.0&q=80&w=150",
          username: "miked"
        },
        createdAt: "45 minutes ago",
        likes: 8
      }
    ]
  },
  {
    id: 2,
    title: "New gaming setup complete! RTX 4080 + 4K monitor",
    content: "Finally upgraded my gaming rig after saving for months. The difference in performance is incredible! Running Cyberpunk 2077 at 4K with ray tracing enabled. What games should I test next?",
    author: {
      name: "Gaming Pro",
      avatar: "https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8Z2FtaW5nJTIwc2V0dXB8ZW58MXx8fHwxNzU3NDQyNzA3fDA&ixlib=rb-4.1.0&q=80&w=150",
      username: "gamingpro"
    },
    category: "Gaming",
    replies: 15,
    likes: 67,
    createdAt: "4 hours ago",
    tags: ["gaming", "rtx4080", "4k", "cyberpunk"],
    comments: [
      {
        id: 1,
        content: "Congrats on the upgrade! You should definitely try the new Spider-Man game - it looks amazing with ray tracing.",
        author: {
          name: "SpiderFan",
          avatar: "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnMlMjBwZW9wbGV8ZW58MXx8fHwxNzU3NDk0NDYzfDA&ixlib=rb-4.1.0&q=80&w=150",
          username: "spiderfan"
        },
        createdAt: "3 hours ago",
        likes: 5
      }
    ]
  },
  {
    id: 3,
    title: "TypeScript vs JavaScript: Is the migration worth it?",
    content: "Our team is considering migrating our large JavaScript codebase to TypeScript. We've heard about the benefits but are concerned about the migration effort. Has anyone done this transition? How long did it take and was it worth it?",
    author: {
      name: "Tech Lead",
      avatar: "https://images.unsplash.com/photo-1658314756187-1be18b77c4ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZGlzY3Vzc2lvbnxlbnwxfHx8fDE3NTc0MDkzOTF8MA&ixlib=rb-4.1.0&q=80&w=150",
      username: "techlead"
    },
    category: "Programming",
    replies: 31,
    likes: 89,
    createdAt: "6 hours ago",
    tags: ["typescript", "javascript", "migration"],
    comments: [
      {
        id: 1,
        content: "We migrated last year and it was absolutely worth it. Better IDE support, fewer runtime errors, and easier refactoring. Start with gradual adoption.",
        author: {
          name: "Senior Dev",
          avatar: "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnMlMjBwZW9wbGV8ZW58MXx8fHwxNzU3NDk0NDYzfDA&ixlib=rb-4.1.0&q=80&w=150",
          username: "seniordev"
        },
        createdAt: "5 hours ago",
        likes: 15
      }
    ]
  },
  {
    id: 4,
    title: "UI/UX Design Trends for 2025",
    content: "What design trends are you seeing emerge for 2025? I'm noticing more minimalistic interfaces, better accessibility features, and interesting uses of gradients. What's catching your eye?",
    author: {
      name: "Design Guru",
      avatar: "https://images.unsplash.com/photo-1510832758362-af875829efcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTc0ODg3NDF8MA&ixlib=rb-4.1.0&q=80&w=150",
      username: "designguru"
    },
    category: "Design",
    replies: 18,
    likes: 42,
    createdAt: "8 hours ago",
    tags: ["design", "trends", "2025", "ui", "ux"],
    comments: [
      {
        id: 1,
        content: "I'm seeing a lot more focus on dark mode and better color contrast ratios. Accessibility is becoming a priority.",
        author: {
          name: "Accessibility Expert",
          avatar: "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnMlMjBwZW9wbGV8ZW58MXx8fHwxNzU3NDk0NDYzfDA&ixlib=rb-4.1.0&q=80&w=150",
          username: "a11yexpert"
        },
        createdAt: "7 hours ago",
        likes: 9
      }
    ]
  },
  {
    id: 5,
    title: "Welcome to TechForum! Introduce yourself",
    content: "Hey everyone! This is the place to introduce yourself to the community. Tell us about your background, what you're working on, or what you hope to learn here. Looking forward to meeting you all!",
    author: {
      name: "Forum Admin",
      avatar: "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnMlMjBwZW9wbGV8ZW58MXx8fHwxNzU3NDk0NDYzfDA&ixlib=rb-4.1.0&q=80&w=150",
      username: "admin"
    },
    category: "General Discussion",
    replies: 156,
    likes: 234,
    createdAt: "1 day ago",
    isPinned: true,
    tags: ["welcome", "introductions", "community"],
    comments: [
      {
        id: 1,
        content: "Hi everyone! I'm a frontend developer from San Francisco. Excited to learn from this community!",
        author: {
          name: "New Member",
          avatar: "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnMlMjBwZW9wbGV8ZW58MXx8fHwxNzU3NDk0NDYzfDA&ixlib=rb-4.1.0&q=80&w=150",
          username: "newmember"
        },
        createdAt: "20 hours ago",
        likes: 6
      }
    ]
  }
];