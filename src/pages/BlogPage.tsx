import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import blogHeroImage from "@/assets/blog-hero.jpg";
import { SEO } from "@/components/SEO";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  category_id: string | null;
  categories: {
    name: string;
    slug: string;
  } | null;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          published_at,
          created_at,
          category_id,
          categories (
            name,
            slug
          )
        `)
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Blog"
        description="Priče, savjeti i inspiracija iz svijeta planinarenja. Čitajte najnovije članke AktivNatura planinskog društva."
        canonical="/blog"
      />
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Image Section */}
        <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] w-full overflow-hidden">
          <img 
            src={blogHeroImage} 
            alt="Blog hero - hiking landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background/90"></div>
        </div>

        <div className="container mx-auto px-4 pt-12 md:pt-16">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              Blog
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Priče, savjeti i inspiracija iz svijeta planinarenja
            </p>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                Još nema objavljenih članaka.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {posts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => handlePostClick(post.slug)}
                  className="group cursor-pointer"
                >
                  {/* Cover Image */}
                  <div className="aspect-[16/10] mb-4 overflow-hidden rounded-lg bg-muted">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <span className="text-muted-foreground text-sm">
                          Nema slike
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Category Badge */}
                  {post.categories && (
                    <Badge 
                      variant="secondary" 
                      className="mb-3 text-xs font-medium"
                    >
                      {post.categories.name}
                    </Badge>
                  )}

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-muted-foreground line-clamp-3 text-sm md:text-base">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Date */}
                  <time className="text-xs text-muted-foreground mt-3 block">
                    {new Date(post.published_at || post.created_at).toLocaleDateString('hr-HR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
