import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { setSeo, injectJsonLd } from "@/lib/seo";

const faqs = [
  {
    q: "What sources do you pull jobs from?",
    a: "We aggregate roles from multiple sources (Remotive, Arbeitnow, RemoteOK, ZipRecruiter, Jooble, USAJobs) with de-duplication, region and remote filtering.",
  },
  {
    q: "How does the match analysis work?",
    a: "We extract keywords and signals from the job, compare against your resume text, and compute Overall, ATS, and Keyword Match scores with specific improvement suggestions.",
  },
  {
    q: "Can I optimize my resume for a specific job?",
    a: "Yes. Select a job, upload or paste your resume, then use the Resume Builder to see color-coded issues and apply AI fixes or generate a tailored version.",
  },
  {
    q: "Do you support PDF and DOCX?",
    a: "Yes. We parse TXT, PDF (pdf.js), and DOCX (mammoth) in the browser to extract text for analysis.",
  },
  {
    q: "How do region and geolocation filters work?",
    a: "Choose a region (e.g., North America) or toggle geolocation to detect your city and boost nearby results where available.",
  },
  {
    q: "Is my data secure?",
    a: "Your resume text stays in your browser during parsing and analysis. When using AI features, only the necessary text is sent to the AI provider.",
  },
];

const FAQ = () => {
  useEffect(() => {
    setSeo({
      title: "FAQ — GigmateAI",
      description: "Frequently asked questions about job sources, match analysis, and the AI resume builder.",
      canonical: "https://jobspark.app/faq",
    });
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    } as any;
    injectJsonLd('jsonld-faq', jsonLd);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Everything you need to know about GigmateAI</p>
        </div>
        <div className="grid gap-4">
          {faqs.map((f, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base">{f.q}</CardTitle>
                <CardDescription>
                  <span className="text-foreground">{f.a}</span>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FAQ; 