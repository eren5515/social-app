import ChatServer from "@/components/Chat/ChatServer";
import Search from "./search";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function SearchPage({ searchQuery }) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data:userProfile, error } = await supabase
  .from("user_profiles")
  .select().eq("id", user?.id);
  const { data:searchResults} = await supabase
    .from("user_profiles")
    .select()
    .or(`unique_name.ilike.%${searchQuery}%,user_name.ilike.%${searchQuery}%`);

    

  return <div>
    <Search searchResults={searchResults} user={userProfile[0]} searchQuery={searchQuery}></Search>
    <ChatServer authUser={user} chatType={"bottom-right"}></ChatServer>
  </div>;
}
