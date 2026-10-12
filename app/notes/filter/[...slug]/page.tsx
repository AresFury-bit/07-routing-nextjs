import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import NotesClient from "../[...slug]/Notes.client";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page: string;
    search: string;
    slug: string[];
  }>;
}

const Notes = async ({ searchParams, params }: Props) => {
  debugger;
  const { slug } = await params;
  console.log(slug);
  const tag = slug[0] === "all" ? undefined : slug[0];
  const page = Number((await searchParams).page) || 1;
  const search = (await searchParams).search || "";
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () => fetchNotes(page, search, tag),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient
          initialPage={page}
          initialSearch={search}
          initialTag={tag}
        />
      </HydrationBoundary>
    </>
  );
};
export default Notes;
