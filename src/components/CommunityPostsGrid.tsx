import { Adpotion } from "@/service/my/adoption";
import PostCard from "./adoption/AdoptionPostCard";

type Props = { posts: Adpotion[] };
export default function CommunityHomePostsGird({ posts }: Props) {
  return (
    <ul className="pl-10 pr-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {posts.map((post) => (
        <li key={post.userIdx}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
