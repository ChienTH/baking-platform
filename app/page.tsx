import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export default async function Home() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  return (
    <div className="min-h-full bg-white">
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Học làm bánh
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            Chọn loại bánh bạn muốn học
          </p>
        </header>

        {error ? (
          <p className="text-center text-red-600">
            Không thể tải danh mục. Vui lòng thử lại sau.
          </p>
        ) : !categories?.length ? (
          <p className="text-center text-stone-500">Chưa có danh mục nào.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category: Category) => (
              <li key={category.id}>
                <Link
                  href={"/category/" + category.slug}
                  className="block rounded-2xl border border-stone-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-amber-100 hover:bg-amber-50/60 hover:shadow-md"
                >
                  <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="mt-3 leading-relaxed text-stone-600">
                      {category.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
