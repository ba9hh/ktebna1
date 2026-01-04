// import React, { useState, useContext } from "react";
// import { Drawer, IconButton } from "@mui/material";
// import { AuthContext } from "../auth/AuthProvider";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { X } from "lucide-react";
// import { supabase } from "../supabaseClient";

// export default function ChatDrawer({
//   open,
//   onClose,
//   otherUserId,
//   otherUserName,
//   bookName,
// }) {
//   const { user } = useContext(AuthContext);
//   const [input, setInput] = useState("");
//   const [sending, setSending] = useState(false);
//   const checkConversationExists = async () => {
//     const { data, error } = await supabase
//       .from("conversations")
//       .select(
//         `
//       *,
//       first_user:users!conversations_first_user_id_fkey(id, name, email, profile_picture),
//       second_user:users!conversations_second_user_id_fkey(id, name, email, profile_picture)
//     `
//       )
//       .or(
//         `and(first_user_id.eq.${user?.id},second_user_id.eq.${otherUserId}),and(first_user_id.eq.${otherUserId},second_user_id.eq.${user?.id})`
//       )
//       .maybeSingle();

//     if (error) throw error;
//     return data;
//   };
//   const sendEmailNotification = async ({
//     recipientEmail,
//     recipientName,
//     senderName,
//     messageContent,
//     bookName,
//   }) => {
//     const res = await fetch("https://mailer-kkjf.onrender.com/send-email", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipientEmail,
//         recipientName,
//         senderName,
//         messageContent,
//         bookName,
//       }),
//     });

//     if (!res.ok) {
//       const error = await res.text();
//       throw new Error(error);
//     }

//     return res.json();
//   };
//   const sendMessage = async (messageContent) => {
//     let { data: existingConvo, error: convoError } = await supabase
//       .from("conversations")
//       .select("*")
//       .or(
//         `and(first_user_id.eq.${user?.id},second_user_id.eq.${otherUserId}),and(first_user_id.eq.${otherUserId},second_user_id.eq.${user?.id})`
//       )
//       .maybeSingle();

//     if (convoError) throw convoError;
//     let conversation = existingConvo;

//     if (!conversation) {
//       const { data: newConvo, error: createError } = await supabase
//         .from("conversations")
//         .insert([
//           {
//             first_user_id: user?.id,
//             second_user_id: otherUserId,
//             conversation_topic: bookName,
//           },
//         ])
//         .select()
//         .single();

//       if (createError) throw createError;
//       conversation = newConvo;
//     }

//     const { count } = await supabase
//       .from("messages")
//       .select("id", { count: "exact", head: true })
//       .eq("conversation_id", conversation.id)
//       .eq("user_id", user?.id);

//     if (count >= 2) {
//       throw new Error("Message limit (2) reached for this conversation.");
//     }

//     const { data: newMessage, error: msgError } = await supabase
//       .from("messages")
//       .insert([
//         {
//           conversation_id: conversation.id,
//           user_id: user?.id,
//           message_content: messageContent,
//         },
//       ])
//       .select()
//       .single();

//     if (msgError) throw msgError;

//     await supabase
//       .from("conversations")
//       .update({
//         last_message_content: messageContent,
//         last_message_sender: user?.id,
//         updated_at: new Date(),
//       })
//       .eq("id", conversation.id);
//     try {
//       const { data: recipientData } = await supabase
//         .from("users")
//         .select("email, name")
//         .eq("id", otherUserId)
//         .single();

//       if (recipientData?.email) {
//         await sendEmailNotification({
//           recipientEmail: recipientData.email,
//           recipientName: recipientData.name || otherUserName,
//           senderName: user?.name || "Someone",
//           messageContent,
//           bookName: bookName || conversation?.conversation_topic,
//         });
//       }
//     } catch (emailError) {
//       console.error("Failed to send email notification:", emailError);
//       // Don't block the message if email fails
//     }
//     return { conversation, message: newMessage };
//   };

//   const queryClient = useQueryClient();

//   const { data: conversation } = useQuery({
//     queryKey: ["conversation", user?.id, otherUserId],
//     queryFn: () => checkConversationExists(),
//   });
//   const getMessages = async () => {
//     const { data, error } = await supabase
//       .from("messages")
//       .select(
//         `
//       id,
//       message_content,
//       created_at,
//       user_id,
//       users (
//         name
//       )
//     `
//       )
//       .eq("conversation_id", conversation?.id)
//       .order("created_at", { ascending: true });

//     if (error) throw error;
//     return data;
//   };
//   const { data: messages = [] } = useQuery({
//     queryKey: ["messages", conversation?.id],
//     queryFn: () => getMessages(),
//     enabled: !!conversation?.id,
//   });

//   const sendMessageMutation = useMutation({
//     mutationFn: (messageContent) => sendMessage(messageContent),
//     onMutate: () => {
//       setSending(true);
//     },
//     onSuccess: (data) => {
//       if (!conversation) {
//         queryClient.invalidateQueries(["conversation", user?.id, otherUserId]);
//       }
//       queryClient.invalidateQueries(["messages", data.conversation.id]);
//       queryClient.setQueryData(
//         ["messages", data.conversation.id],
//         (old = []) => [...old, data.message]
//       );
//       setInput("");
//       setSending(false);
//     },
//     onError: (err) => {
//       alert(
//         err.message || err.response?.data?.error || "Failed to send message"
//       );
//       setSending(false);
//     },
//   });

//   const handleSend = () => {
//     if (input.trim() && !sending) {
//       sendMessageMutation.mutate(input);
//     }
//   };
//   return (
//     <Drawer anchor="right" open={open} onClose={onClose}>
//       <div className="w-[400px] h-screen flex flex-col bg-gray-100">
//         <div className="flex items-center justify-between p-4 border-b bg-white shadow">
//           <h1 className="text-lg font-bold truncate">
//             💬
//             {otherUserName || "Chat"} (
//             {bookName || conversation?.conversation_topic})
//           </h1>
//           <IconButton onClick={onClose}>
//             <X size={14} />
//           </IconButton>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4">
//           {messages.length === 0 && (
//             <p className="text-gray-400 text-center">No messages yet</p>
//           )}
//           {messages.map((m) => (
//             <div
//               key={m.id}
//               className={`p-2 my-1 rounded-lg max-w-[70%] ${
//                 m.user_id === user?.id
//                   ? "bg-blue-100 ml-auto text-right"
//                   : "bg-gray-200 mr-auto"
//               }`}
//             >
//               <p className="text-sm">{m.message_content}</p>
//               <span className="text-xs text-gray-500">
//                 {m.users?.name || "Unknown"}
//               </span>
//             </div>
//           ))}
//         </div>

//         <div className="flex gap-2 p-4 border-t bg-white">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 border rounded p-2"
//           />
//           <button
//             onClick={handleSend}
//             disabled={sending}
//             className={`px-4 py-2 rounded-lg text-white ${
//               sending ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
//             }`}
//           >
//             {sending ? "Sending..." : "Send"}
//           </button>
//         </div>
//       </div>
//     </Drawer>
//   );
// }
import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Send, BookOpen, AlertCircle } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function ChatDrawer({
  open,
  onClose,
  otherUserId,
  otherUserName,
  userName,
  bookName,
}) {
  const { user } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

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
    const res = await fetch("https://mailer-kkjf.onrender.com/send-email", {
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
    });

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
          senderName: userName || user?.name,
          messageContent,
          bookName: bookName || conversation?.conversation_topic,
        });
      }
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const userMessageCount = messages.filter(
    (m) => m.user_id === user?.id
  ).length;
  const messageLimit = 2;
  const canSendMore = userMessageCount < messageLimit;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-[100dvh] w-full sm:w-[420px] bg-gradient-to-b from-gray-50 to-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {otherUserName?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-gray-900 truncate">
                {otherUserName || "User"}
              </h2>
              {(bookName || conversation?.conversation_topic) && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <BookOpen size={12} />
                  <span className="truncate">
                    {bookName || conversation?.conversation_topic}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Message Limit Warning */}
        {!canSendMore && (
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
            <div className="flex items-start gap-2">
              <AlertCircle
                size={16}
                className="text-amber-600 mt-0.5 flex-shrink-0"
              />
              <p className="text-xs text-amber-800">
                You've reached the message limit (2 messages) for this
                conversation.
              </p>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Send size={28} className="text-blue-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                No messages yet
              </p>
              <p className="text-gray-400 text-xs">
                Start a conversation about {bookName || "this book"}
              </p>
            </div>
          ) : (
            <>
              {messages.map((m, idx) => {
                const isOwn = m.user_id === user?.id;
                const showName =
                  idx === 0 || messages[idx - 1].user_id !== m.user_id;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      isOwn ? "items-end" : "items-start"
                    }`}
                  >
                    {showName && !isOwn && (
                      <span className="text-xs font-medium text-gray-600 mb-1 px-1">
                        {m.users?.name || "Unknown"}
                      </span>
                    )}
                    <div
                      className={`group relative px-4 py-2.5 rounded-2xl max-w-[85%] shadow-sm transition-all ${
                        isOwn
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">
                        {m.message_content}
                      </p>
                      <span
                        className={`text-[10px] mt-1 block ${
                          isOwn ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {formatTime(m.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  canSendMore ? "Type a message..." : "Message limit reached"
                }
                disabled={!canSendMore || sending}
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 transition-all text-sm"
                style={{
                  minHeight: "44px",
                  maxHeight: "120px",
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {userMessageCount}/{messageLimit}
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending || !canSendMore}
              className={`p-3 rounded-full transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                sending
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              <Send
                size={20}
                className={`text-white ${sending ? "animate-pulse" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
