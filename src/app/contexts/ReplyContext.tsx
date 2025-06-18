"use client";

import React, { createContext, useContext, useState, FC, PropsWithChildren } from "react";
import type { DashboardMentionItem } from "../types/jira-models";

export interface ReplyContextState {
  // Selected mention for reply
  selectedMention: DashboardMentionItem | null;
  
  // Voice reply mode
  isVoiceReplyMode: boolean;
  
  // Reply status
  replyStatus: 'idle' | 'posting' | 'success' | 'error';
  replyError?: string;
  
  // Last posted comment details
  lastPostedComment?: {
    id: string;
    ticketKey: string;
    url: string;
    timestamp: string;
  };
}

type ReplyContextValue = {
  // State
  replyState: ReplyContextState;
  
  // Actions
  selectMentionForReply: (mention: DashboardMentionItem) => void;
  clearSelectedMention: () => void;
  setVoiceReplyMode: (enabled: boolean) => void;
  setReplyStatus: (status: ReplyContextState['replyStatus'], error?: string) => void;
  setLastPostedComment: (comment: ReplyContextState['lastPostedComment']) => void;
  
  // Helper methods
  isReadyForVoiceReply: () => boolean;
  getSelectedMentionSummary: () => string | null;
};

const ReplyContext = createContext<ReplyContextValue | undefined>(undefined);

export const ReplyProvider: FC<PropsWithChildren> = ({ children }) => {
  const [replyState, setReplyState] = useState<ReplyContextState>({
    selectedMention: null,
    isVoiceReplyMode: false,
    replyStatus: 'idle',
    replyError: undefined,
    lastPostedComment: undefined,
  });

  const selectMentionForReply = (mention: DashboardMentionItem) => {
    console.log('🎯 Selected mention for reply:', mention.ticketKey);
    setReplyState(prev => ({
      ...prev,
      selectedMention: mention,
      replyStatus: 'idle',
      replyError: undefined,
    }));
  };

  const clearSelectedMention = () => {
    console.log('🚫 Cleared selected mention');
    setReplyState(prev => ({
      ...prev,
      selectedMention: null,
      isVoiceReplyMode: false,
      replyStatus: 'idle',
      replyError: undefined,
    }));
  };

  const setVoiceReplyMode = (enabled: boolean) => {
    console.log('🎙️ Voice reply mode:', enabled ? 'enabled' : 'disabled');
    setReplyState(prev => ({
      ...prev,
      isVoiceReplyMode: enabled,
    }));
  };

  const setReplyStatus = (status: ReplyContextState['replyStatus'], error?: string) => {
    console.log('📋 Reply status changed:', status, error ? `(${error})` : '');
    setReplyState(prev => ({
      ...prev,
      replyStatus: status,
      replyError: error,
    }));
  };

  const setLastPostedComment = (comment: ReplyContextState['lastPostedComment']) => {
    console.log('✅ Last posted comment recorded:', comment?.ticketKey);
    setReplyState(prev => ({
      ...prev,
      lastPostedComment: comment,
      replyStatus: 'success',
    }));
  };

  const isReadyForVoiceReply = (): boolean => {
    return !!(replyState.selectedMention && replyState.isVoiceReplyMode);
  };

  const getSelectedMentionSummary = (): string | null => {
    if (!replyState.selectedMention) return null;
    
    const mention = replyState.selectedMention;
    return `${mention.ticketKey}: ${mention.ticketTitle} (${mention.urgency} priority)`;
  };

  const contextValue: ReplyContextValue = {
    replyState,
    selectMentionForReply,
    clearSelectedMention,
    setVoiceReplyMode,
    setReplyStatus,
    setLastPostedComment,
    isReadyForVoiceReply,
    getSelectedMentionSummary,
  };

  return (
    <ReplyContext.Provider value={contextValue}>
      {children}
    </ReplyContext.Provider>
  );
};

export const useReply = (): ReplyContextValue => {
  const context = useContext(ReplyContext);
  if (context === undefined) {
    throw new Error("useReply must be used within a ReplyProvider");
  }
  return context;
};

// Export types for external use
export type { ReplyContextValue };