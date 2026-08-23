import { Button } from   "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl font-bold text-brand-navy sm:text-5xl">
          Master GATE DA with AI-Powered Test Series
        </h1>
        <p className="mt-4 max-w-xl text-slate-600">
          Realistic CBT mocks, adaptive AI tests, previous-year papers, detailed
          analytics, and personalized practice for Data Science &amp; Artificial
          Intelligence.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="bg-brand-blue hover:bg-brand-navy">
            Start Free Test
          </Button>
          <Button size="lg" variant="outline">
            Explore Previous Papers
          </Button>
        </div>
      </main>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-6 pb-24 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-navy">AI Test Generator</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Configure subjects, difficulty, and question types to generate a
            fresh, unique test every time.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-navy">GATE-Style CBT</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Realistic exam interface with timer, question palette, and
            on-screen scientific calculator.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-brand-navy">Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Track weak topics, review mistakes, and generate targeted
            revision tests automatically.
          </CardContent>
        </Card>
      </section>
    </>
  );
}