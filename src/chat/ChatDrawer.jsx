import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Send, BookOpen, AlertCircle } from "lucide-react";
import { supabase } from "../supabaseClient";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import { checkConversationExists } from "./conversationService";
import { getMessages } from "./chatService";
import { sendMessage } from "./messageService";
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

  const queryClient = useQueryClient();

  const { data: conversation } = useQuery({
    queryKey: ["conversation", user?.id, otherUserId],
    queryFn: () => checkConversationExists(user?.id, otherUserId),
    enabled: !!user?.id && !!otherUserId,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", conversation?.id],
    queryFn: () => getMessages(conversation?.id),
    enabled: !!conversation?.id,
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: (messageContent) =>
      sendMessage({
        user,
        otherUserId,
        bookName,
        messageContent,
        conversation,
        otherUserName,
        userName,
      }),
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
        <ChatHeader
          otherUserName={otherUserName}
          bookName={bookName}
          conversationTopic={conversation?.conversation_topic}
          onClose={onClose}
        />

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
          <MessageList
            messages={messages}
            userId={user?.id}
            bookName={bookName}
            formatTime={formatTime}
            messagesEndRef={messagesEndRef}
          />
        </div>

        {/* Input Area */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          onKeyPress={handleKeyPress}
          sending={sending}
          canSendMore={canSendMore}
          inputRef={inputRef}
          userMessageCount={userMessageCount}
          messageLimit={messageLimit}
        />
      </div>
    </>
  );
}
