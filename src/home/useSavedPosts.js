import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

export const useSavedPosts = (user) => {
    return useQuery({
        queryKey: ["savedPosts", user?.id],
        enabled: !!user,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("saved_posts")
                .select("post_id")
                .eq("user_id", user.id);

            if (error) throw error;
            return data.map((row) => row.post_id);
        },
    });
};
