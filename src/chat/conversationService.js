import { supabase } from "../supabaseClient";

export const checkConversationExists = async (userId, otherUserId) => {
    const { data, error } = await supabase
        .from("conversations")
        .select(`
      *,
      first_user:users!conversations_first_user_id_fkey(id, name, email, profile_picture),
      second_user:users!conversations_second_user_id_fkey(id, name, email, profile_picture)
    `)
        .or(
            `and(first_user_id.eq.${userId},second_user_id.eq.${otherUserId}),and(first_user_id.eq.${otherUserId},second_user_id.eq.${userId})`
        )
        .maybeSingle();

    if (error) throw error;
    return data;
};

export const createConversation = async (userId, otherUserId, bookName) => {
    const { data, error } = await supabase
        .from("conversations")
        .insert([{
            first_user_id: userId,
            second_user_id: otherUserId,
            conversation_topic: bookName,
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateConversation = async (conversationId, messageContent, userId) => {
    const { error } = await supabase
        .from("conversations")
        .update({
            last_message_content: messageContent,
            last_message_sender: userId,
            updated_at: new Date(),
        })
        .eq("id", conversationId);

    if (error) throw error;
};