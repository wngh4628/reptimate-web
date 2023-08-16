import { getAllPosts, getFeaturedPosts } from "@/service/posts";
import CommunityHomePostsGird from "./CommunityHomePostsGrid";

export default async function CommunityHomePosts() {
  // 1. 모든 포스트 데이터를 읽어와야 함
  const posts = await getFeaturedPosts();
  // 2. 모든 포스트 데이터를 보여줌
  return (
    <section>
      <h2 className="text-2xl font-bold p-10">분양글</h2>
      <CommunityHomePostsGird posts={posts} />
    </section>
  );
}
