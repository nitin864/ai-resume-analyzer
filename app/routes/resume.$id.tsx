// app/routes/resume.$id.tsx
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";

// adjust import path to where your kv wrapper is accessible on the server
import { getPuterStoreServerSide } from "~/lib/puter.server"; 
// If your "kv" is available directly via some global or server util, use that.
// The helper above is just an example — replace with the real way you access kv in loaders.

/**
 * Loader: fetch the resume data saved under "resume:<id>"
 */
export async function loader({ params, request }: LoaderArgs) {
  const id = params.id;
  if (!id) return json({ error: "Missing id" }, { status: 400 });

  // get server-side access to kv (replace with your actual server API)
  const { kv } = getPuterStoreServerSide(); // <-- implement or replace accordingly

  const raw = await kv.get(`resume:${id}`);
  if (!raw) {
    return json({ error: "Not found" }, { status: 404 });
  }

  // ensure stored JSON is parsed
  let data;
  try {
    data = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    data = raw;
  }

  return json({ data });
}

/**
 * UI component to display the resume analysis
 */
export default function ResumePage() {
  const { data } = useLoaderData<typeof loader>();

  if (!data) {
    return (
      <main className="p-8">
        <h1 className="text-3xl">Resume not found</h1>
        <p>The requested resume could not be found.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl mb-4">{data.companyName ?? "Resume Analysis"}</h1>

      <section className="mb-6">
        <h2 className="text-xl">Job</h2>
        <p><strong>Title:</strong> {data.jobTitle}</p>
        <p><strong>Company:</strong> {data.companyName}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl">Feedback / ATS Score</h2>
        {/* feedback may be string or object — display accordingly */}
        {typeof data.feedback === "string" ? (
          <pre>{data.feedback}</pre>
        ) : (
          <pre>{JSON.stringify(data.feedback, null, 2)}</pre>
        )}
      </section>

      <section>
        <h2 className="text-xl">Stored paths</h2>
        <p><strong>Resume path:</strong> {data.resumePath}</p>
        <p><strong>Image path:</strong> {data.imagePath}</p>
      </section>
    </main>
  );
}
