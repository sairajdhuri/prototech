"use client";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <section className="container page-intro"><h1>Something went wrong</h1><p>Please try loading this page again. You can also contact sales@protomlb.in.</p><button className="button" onClick={reset}>Try again</button></section>; }
