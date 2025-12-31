import React, { useState, useContext } from "react";
import { Drawer, IconButton } from "@mui/material";
import { AuthContext } from "../auth/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function ChatDrawer({
  open,
  onClose,
  otherUserId,
  otherUserName,
  bookName,
}) {
  const { user } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const checkConversationExists = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
      *,
      first_user:users!conversations_first_user_id_fkey(id, name, email, profile_picture),
      second_user:users!conversations_second_user_id_fkey(id, name, email, profile_picture)
    `
      )
      .or(
        `and(first_user_id.eq.${user?.id},second_user_id.eq.${otherUserId}),and(first_user_id.eq.${otherUserId},second_user_id.eq.${user?.id})`
      )
      .maybeSingle();

    if (error) throw error;
    return data;
  };
  const sendEmailNotification = async ({
    recipientEmail,
    recipientName,
    senderName,
    messageContent,
    bookName,
  }) => {
    const res = await fetch(
      "https://obhlpgxxiotevfhcvdaw.supabase.co/functions/v1/send-message-notification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail,
          recipientName,
          senderName,
          messageContent,
          bookName,
        }),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    return res.json();
  };
  const sendMessage = async (messageContent) => {
    let { data: existingConvo, error: convoError } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `and(first_user_id.eq.${user?.id},second_user_id.eq.${otherUserId}),and(first_user_id.eq.${otherUserId},second_user_id.eq.${user?.id})`
      )
      .maybeSingle();

    if (convoError) throw convoError;
    let conversation = existingConvo;

    if (!conversation) {
      const { data: newConvo, error: createError } = await supabase
        .from("conversations")
        .insert([
          {
            first_user_id: user?.id,
            second_user_id: otherUserId,
            conversation_topic: bookName,
          },
        ])
        .select()
        .single();

      if (createError) throw createError;
      conversation = newConvo;
    }

    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("conversation_id", conversation.id)
      .eq("user_id", user?.id);

    if (count >= 2) {
      throw new Error("Message limit (2) reached for this conversation.");
    }

    const { data: newMessage, error: msgError } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: conversation.id,
          user_id: user?.id,
          message_content: messageContent,
        },
      ])
      .select()
      .single();

    if (msgError) throw msgError;

    await supabase
      .from("conversations")
      .update({
        last_message_content: messageContent,
        last_message_sender: user?.id,
        updated_at: new Date(),
      })
      .eq("id", conversation.id);
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
          senderName: user?.name || "Someone",
          messageContent,
          bookName: bookName || conversation?.conversation_topic,
        });
      }
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't block the message if email fails
    }
    return { conversation, message: newMessage };
  };

  const queryClient = useQueryClient();

  const { data: conversation } = useQuery({
    queryKey: ["conversation", user?.id, otherUserId],
    queryFn: () => checkConversationExists(),
  });
  const getMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
      id,
      message_content,
      created_at,
      user_id,
      users (
        name
      )
    `
      )
      .eq("conversation_id", conversation?.id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  };
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", conversation?.id],
    queryFn: () => getMessages(),
    enabled: !!conversation?.id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (messageContent) => sendMessage(messageContent),
    onMutate: () => {
      setSending(true);
    },
    onSuccess: (data) => {
      if (!conversation) {
        queryClient.invalidateQueries(["conversation", user?.id, otherUserId]);
      }
      queryClient.invalidateQueries(["messages", data.conversation.id]);
      queryClient.setQueryData(
        ["messages", data.conversation.id],
        (old = []) => [...old, data.message]
      );
      setInput("");
      setSending(false);
    },
    onError: (err) => {
      alert(
        err.message || err.response?.data?.error || "Failed to send message"
      );
      setSending(false);
    },
  });

  const handleSend = () => {
    if (input.trim() && !sending) {
      sendMessageMutation.mutate(input);
    }
  };
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="w-[400px] h-screen flex flex-col bg-gray-100">
        <div className="flex items-center justify-between p-4 border-b bg-white shadow">
          <h1 className="text-lg font-bold truncate">
            💬
            {otherUserName || "Chat"} (
            {bookName || conversation?.conversation_topic})
          </h1>
          <IconButton onClick={onClose}>
            <X size={14} />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center">No messages yet</p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-2 my-1 rounded-lg max-w-[70%] ${
                m.user_id === user?.id
                  ? "bg-blue-100 ml-auto text-right"
                  : "bg-gray-200 mr-auto"
              }`}
            >
              <p className="text-sm">{m.message_content}</p>
              <span className="text-xs text-gray-500">
                {m.users?.name || "Unknown"}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 p-4 border-t bg-white">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={handleSend}
            disabled={sending}
            className={`px-4 py-2 rounded-lg text-white ${
              sending ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </Drawer>
  );
}
