import { supabase } from "../supabaseClient";
import { updateConversation } from "./conversationService";
import { sendEmailNotification } from "./emailService";

export const getMessages = async (conversationId) => {
    if (!conversationId) return [];

    const { data, error } = await supabase
        .from("messages")
        .select(`
      id,
      message_content,
      created_at,
      user_id,
      users (name)
    `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
};

export const checkMessageLimit = async (conversationId, userId) => {
    const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("conversation_id", conversationId)
        .eq("user_id", userId);

    return count;
};

export const createMessage = async (conversationId, userId, messageContent) => {
    const { data, error } = await supabase
        .from("messages")
        .insert([{
            conversation_id: conversationId,
            user_id: userId,
            message_content: messageContent,
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const sendMessage = async ({
    user,
    otherUserId,
    bookName,
    messageContent,
    conversation,
    otherUserName,
    userName,
}) => {
    // Get or create conversation
    let existingConvo = conversation;

    if (!existingConvo) {
        const { data, error } = await supabase
            .from("conversations")
            .select("*")
            .or(
                `and(first_user_id.eq.${user?.id},second_user_id.eq.${otherUserId}),and(first_user_id.eq.${otherUserId},second_user_id.eq.${user?.id})`
            )
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            const { data: newConvo, error: createError } = await supabase
                .from("conversations")
                .insert([{
                    first_user_id: user?.id,
                    second_user_id: otherUserId,
                    conversation_topic: bookName,
                }])
                .select()
                .single();

            if (createError) throw createError;
            existingConvo = newConvo;
        } else {
            existingConvo = data;
        }
    }

    // Check message limit
    const messageCount = await checkMessageLimit(existingConvo.id, user?.id);
    if (messageCount >= 2) {
        throw new Error("Message limit (2) reached for this conversation.");
    }

    // Create message
    const newMessage = await createMessage(existingConvo.id, user?.id, messageContent);

    // Update conversation
    await updateConversation(existingConvo.id, messageContent, user?.id);

    // Send email notification
    try {
        const { data: recipientData } = await supabase
            .from("users")
            .select("email, name")
            .eq("id", otherUserId)
            .single();

        if (recipientData?.email) {
            await sendEmailNotification({
                recipientEmail: recipientData.email,
                recipientName: recipientData.name || otherUserName,
                senderName: userName || user?.name,
                messageContent,
                bookName: bookName || existingConvo?.conversation_topic,
            });
        }
    } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
    }

    return { conversation: existingConvo, message: newMessage };
};