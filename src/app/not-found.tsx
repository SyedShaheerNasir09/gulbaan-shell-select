import Link from "next/link";
import { Sprig } from "@/components/FloralDecor";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-6 w-fit text-blush animate-float-slow">
          <Sprig className="h-24 w-24" />
        </div>
        <p className="eyebrow">Lost in the garden</p>
        <h1 className="display mt-3 text-5xl text-bark">Page not found</h1>
        <p className="mt-4 text-bark/70">
          This bloom seems to have wandered off. Let&apos;s head back to the catalogue.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/store" className="btn-primary">Browse catalogue</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    </main>
  );
}
