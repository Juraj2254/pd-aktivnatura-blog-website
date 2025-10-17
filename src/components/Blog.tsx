import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Savjeti za početne planinare",
    excerpt: "Osnovna oprema i priprema za vaš prvi planinarski izlet",
    date: "10. Svibanj 2025",
  },
  {
    id: 2,
    title: "Najljepše planinske staze u Hrvatskoj",
    excerpt: "Otkrijte skrivene dragulje naših planina",
    date: "5. Svibanj 2025",
  },
  {
    id: 3,
    title: "Sigurnost u planinama",
    excerpt: "Važna pravila ponašanja i opreme za siguran izlet",
    date: "1. Svibanj 2025",
  },
];

export const Blog = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            Blog
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Najnoviji članci i savjeti iz svijeta planinarenja
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg active:shadow-xl active:scale-[0.98] transition-all touch-manipulation">
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="text-sm">{post.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full group">
                  Pročitaj više
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
