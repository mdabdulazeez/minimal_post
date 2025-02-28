import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Moon, Sun, Pencil, X, Check } from "lucide-react";
import { useTheme } from "next-themes";

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const { theme, setTheme } = useTheme();

  interface Post {
    id: string;
    title: string;
    content: string;
    createdAt?: string;
  }

  // Fetch posts from backend server
  useEffect(() => {
    const fetchPosts = async () => {
      setIsFetching(true);
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error("Failed to load posts");
        // Fall back to mock data if server is unavailable
        const mockPosts = [
          {
            id: '1',
            title: 'The Essence of Design',
            content: 'Good design is as little design as possible. Less, but better – because it concentrates on the essential aspects, and the products are not burdened with non-essentials.',
            createdAt: '2023-05-15'
          },
          {
            id: '2',
            title: 'Simplicity',
            content: 'Simplicity is the ultimate sophistication. It takes a lot of hard work to make something simple, to truly understand the underlying challenges and come up with elegant solutions.',
            createdAt: '2023-06-22'
          }
        ];
        setPosts(mockPosts);
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      
      const updatedPost = await response.json();
      setPosts(posts.map(post => 
        post.id === id ? updatedPost : post
      ));
      
      toast.success("Post updated successfully");
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error("Failed to update post");
    } finally {
      setIsLoading(false);
      setEditingId(null);
      setEditTitle('');
      setEditContent('');
    }
  };

  // Create a new blog post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      setTitle('');
      setContent('');
      toast.success("Post created successfully");
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="max-w-3xl mx-auto py-16 px-6 sm:px-12">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center relative"
        >
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="absolute right-0 top-0 p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3 inline-block">Thoughts & Ideas</span>
          <h1 className="text-4xl font-light mb-3">minimalpost</h1>
          <p className="text-muted-foreground max-w-md mx-auto">A simple space for your thoughts, ideas, and stories.</p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-xl font-light mb-6">New Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border-b bg-transparent border-border focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 min-h-[120px] border-b bg-transparent border-border focus:outline-none focus:border-primary transition-colors resize-none"
                required
              />
            </div>
            <div className="text-right">
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-full hover:opacity-90 focus:outline-none transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Publish'}
              </button>
            </div>
          </form>
        </motion.div>

        <Separator className="my-12 bg-border" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          <h2 className="text-xl font-light mb-8">Journal</h2>
          
          {isFetching ? (
            <motion.p variants={itemVariants} className="text-center text-muted-foreground py-12">
              Loading posts...
            </motion.p>
          ) : posts.length === 0 ? (
            <motion.p variants={itemVariants} className="text-center text-muted-foreground py-12">
              No entries yet. Share your first thought above.
            </motion.p>
          ) : (
            posts.map(post => (
              <motion.article 
                key={post.id} 
                variants={itemVariants}
                className="group relative"
              >
                {editingId === post.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-3 border-b bg-transparent border-border focus:outline-none focus:border-primary transition-colors text-2xl font-light"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-3 min-h-[120px] border-b bg-transparent border-border focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleCancelEdit()}
                        className="p-2 hover:text-destructive transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleSaveEdit(post.id)}
                        className="p-2 hover:text-primary transition-colors"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                      <button
                        onClick={() => handleEdit(post)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="text-2xl font-light mb-3 group-hover:text-muted-foreground transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                  </>
                )}
              </motion.article>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;