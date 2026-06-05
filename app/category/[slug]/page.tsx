import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Recipe = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  difficulty: string | null;
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .maybeSingle();

  if (!category) {
    return (
      <div className="min-h-full bg-white">
        <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-stone-600 transition-colors hover:text-stone-900"
          >
            ← Quay lại
          </Link>
          <p className="mt-12 text-center text-lg text-stone-600">
            Không tìm thấy
          </p>
        </main>
      </div>
    );
  }

  const { data: recipes, error: recipesError } = await supabase
    .from("recipes")
    .select("id, name, description, duration_minutes, difficulty")
    .eq("category_id", category.id)
    .order("name");

  return (
    <div className="min-h-full bg-white">
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-stone-600 transition-colors hover:text-stone-900"
        >
          ← Quay lại
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-2xl text-lg text-stone-600">
              {category.description}
            </p>
          )}
        </header>

        {recipesError ? (
          <p className="mt-12 text-center text-red-600">
            Không thể tải công thức. Vui lòng thử lại sau.
          </p>
        ) : !recipes?.length ? (
          <p className="mt-12 text-center text-stone-500">
            Chưa có công thức nào trong danh mục này.
          </p>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe: Recipe) => (
              <li
                key={recipe.id}
                className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-amber-100 hover:bg-amber-50/60 hover:shadow-md"
              >
                <h2 className="text-xl font-bold text-stone-900">
                  {recipe.name}
                </h2>
                {recipe.description && (
                  <p className="mt-3 leading-relaxed text-stone-600">
                    {recipe.description}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  {recipe.duration_minutes != null && (
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
                      {recipe.duration_minutes} phút
                    </span>
                  )}
                  {recipe.difficulty && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900">
                      {recipe.difficulty}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
