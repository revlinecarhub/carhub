import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { listCommentsForCar } from "@/lib/comments/repo";
import { isAdmin } from "@/lib/profiles/repo";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

export async function CommentsSection({ carId, slug }: { carId: string; slug: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const comments = await listCommentsForCar(carId);
  const admin = await isAdmin(user?.id);

  return (
    <section className="mt-12">
      <h2 className="mb-6 font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
        Commentaires ({comments.length})
      </h2>

      {user ? (
        <div className="mb-8">
          <CommentForm carId={carId} slug={slug} />
        </div>
      ) : (
        <p className="mb-8 text-sm text-[var(--color-muted)]">
          <Link href={`/login?next=/cars/${slug}`} className="text-[var(--color-accent)] hover:underline">
            Connecte-toi
          </Link>{" "}
          pour commenter.
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">Aucun commentaire pour l&apos;instant.</p>
      ) : (
        <div>
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              slug={slug}
              canDelete={!!user && (c.user_id === user.id || admin)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
