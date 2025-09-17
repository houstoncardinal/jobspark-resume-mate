import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { setSeo, injectJsonLd } from "@/lib/seo";

const posts = [
  {
    slug: "ai-resume-trends",
    title: "AI Resume Trends: What Recruiters Look For in 2025",
    description: "From skills extraction to ATS parsing — how to stand out in modern hiring.",
    datePublished: "2025-01-15",
  },
  {
    slug: "optimize-ats",
    title: "How to Optimize Your Resume for ATS (Without Keyword Stuffing)",
    description: "A practical framework to improve parsing, relevance, and interview rates.",
    datePublished: "2025-02-02",
  },
];

const Blog = () => {
  useEffect(() => {
    setSeo({
      title: "Blog — Gigm8",
      description: "Insights on the job market, ATS, and AI-powered resume optimization from Gigm8.",
      canonical: "https://jobspark.app/blog",
    });

    const blogLd = {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Gigm8 Blog",
      url: "https://jobspark.app/blog",
    } as any;
    injectJsonLd('jsonld-blog', blogLd);

    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://jobspark.app/blog/${p.slug}`,
        name: p.title,
      })),
    } as any;
    injectJsonLd('jsonld-blog-list', itemList);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Gigm8 Blog</h1>
          <p className="text-muted-foreground">Research and insights on jobs, hiring, and AI resumes</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {posts.map((p) => (
            <Card key={p.slug}>
              <CardHeader>
                <CardTitle className="text-xl">{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Published {p.datePublished}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Blog; 