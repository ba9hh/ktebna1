import { supabase } from "../supabaseClient";

export const getConversation = async (userId, otherUserId) => {
    const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(
            `and(first_user_id.eq.${userId},second_user_id.eq.${otherUserId}),
       and(first_user_id.eq.${otherUserId},second_user_id.eq.${userId})`
        )
        .maybeSingle();

    if (error) throw error;
    return data;
};

export const createConversation = async (userId, otherUserId, topic) => {
    const { data, error } = await supabase
        .from("conversations")
        .insert([
            {
                first_user_id: userId,
                second_user_id: otherUserId,
                conversation_topic: topic,
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getMessages = async (conversationId) => {
    const { data, error } = await supabase
        .from("messages")
        .select(
            `
      id,
      message_content,
      created_at,
      user_id,
      users ( name )
    `
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
};

export const sendMessageToDB = async (conversationId, userId, content) => {
    const { data, error } = await supabase
        .from("messages")
        .insert([
            { conversation_id: conversationId, user_id: userId, message_content: content },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
};
