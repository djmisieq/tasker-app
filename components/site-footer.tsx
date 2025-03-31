import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Tasker. Wszelkie prawa zastrzeżone.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:underline">
            Polityka prywatności
          </Link>
          <Link href="/terms" className="hover:underline">
            Warunki użytkowania
          </Link>
          <Link href="/contact" className="hover:underline">
            Kontakt
          </Link>
        </div>
      </div>
    </footer>
  )
}