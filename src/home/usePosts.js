import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

export const usePosts = ({
    dealType,
    location,
    category,
    search,
    userId,
    page = 1,
    pageSize = 12,
}) => {
    return useQuery({
        queryKey: [
            "shops",
            { dealType, location, category, search, userId, page, pageSize },
        ],
        queryFn: async ({ queryKey }) => {
            const [, params] = queryKey;

            const from = (params.page - 1) * params.pageSize;
            const to = from + params.pageSize - 1;

            let query = supabase
                .from("posts")
                .select(
                    `
                    *,
                    users ( name )
                `,
                    { count: "exact" }
                )
                .range(from, to);


            if (params.dealType !== "All")
                query = query.eq("book_deal_type", params.dealType);

            if (params.location !== "Toute la tunisie")
                query = query.eq("book_location", params.location);

            if (params.category !== "All")
                query = query.eq("book_category", params.category);

            if (params.search)
                query = query.ilike("book_name", `%${params.search}%`);

            if (params.userId)
                query = query.neq("user_id", params.userId);

            query = query.order("created_at", { ascending: false });

            const { data, error, count } = await query;
            if (error) throw error;

            return {
                data,
                total: count,
            };
        },
        keepPreviousData: true,
    });
};
