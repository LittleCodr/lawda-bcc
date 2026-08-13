export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ').toUpperCase()} | Everlasting Shop` };
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Since we haven't scraped the HTML of pages yet (as we focused on JSON),
  // we will show a placeholder that can be updated later.
  
  return (
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="mx-auto max-w-[800px] px-6 md:px-12">
        <h1 className="font-serif text-3xl md:text-5xl text-stone-900 mb-12 text-center uppercase tracking-widest">
          {slug.replace(/-/g, ' ')}
        </h1>

        <div className="prose prose-stone prose-sm mx-auto text-stone-600">
          <p>
            Welcome to Everlasting Shop. This page content is currently being updated.
            Check back soon for more information about {slug.replace(/-/g, ' ')}.
          </p>
        </div>
      </div>
    </div>
  );
}
