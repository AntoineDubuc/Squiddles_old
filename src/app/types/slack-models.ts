/**
 * Slack TypeScript Models
 * Following the pattern of jira-models.ts
 */

// Core Slack Message interface
export interface SlackMessage {
  ts: string;
  channel: string;
  user: string;
  text: string;
  blocks?: SlackBlock[];
  thread_ts?: string;
  permalink?: string;
  reactions?: SlackReaction[];
  replies?: SlackReply[];
  bot_id?: string;
  subtype?: string;
  edited?: {
    user: string;
    ts: string;
  };
}

// Slack Channel interface
export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  is_member: boolean;
  is_archived?: boolean;
  purpose?: {
    value: string;
    creator: string;
    last_set: string;
  };
  topic?: {
    value: string;
    creator: string;
    last_set: string;
  };
  created: number;
  creator?: string;
  num_members?: number;
  members?: string[];
}

// Slack User interface
export interface SlackUser {
  id: string;
  name: string;
  real_name?: string;
  display_name?: string;
  email?: string;
  is_bot?: boolean;
  is_admin?: boolean;
  is_owner?: boolean;
  profile?: {
    avatar_hash?: string;
    status_text?: string;
    status_emoji?: string;
    real_name?: string;
    display_name?: string;
    real_name_normalized?: string;
    display_name_normalized?: string;
    email?: string;
    image_24?: string;
    image_32?: string;
    image_48?: string;
    image_72?: string;
    image_192?: string;
    image_512?: string;
    team?: string;
  };
}

// Slack Block Kit elements
export interface SlackBlock {
  type: string;
  block_id?: string;
  text?: SlackText;
  fields?: SlackText[];
  accessory?: SlackElement;
  elements?: SlackElement[];
}

export interface SlackText {
  type: 'plain_text' | 'mrkdwn';
  text: string;
  emoji?: boolean;
  verbatim?: boolean;
}

export interface SlackElement {
  type: string;
  action_id?: string;
  text?: SlackText;
  value?: string;
  url?: string;
  style?: 'primary' | 'danger';
}

// Slack Reaction interface
export interface SlackReaction {
  name: string;
  count: number;
  users: string[];
}

// Slack Reply interface (for threaded messages)
export interface SlackReply {
  user: string;
  ts: string;
}

// Search result interface
export interface SlackSearchResult {
  messages: SlackMessage[];
  total: number;
  query: string;
  paging?: {
    count: number;
    total: number;
    page: number;
    pages: number;
  };
}

// Scheduled message interface
export interface SlackScheduledMessage {
  id: string;
  channel_id: string;
  post_at: number;
  date_created: number;
  text: string;
  blocks?: SlackBlock[];
}

// API Response interfaces
export interface SlackApiResponse {
  ok: boolean;
  error?: string;
  warning?: string;
  response_metadata?: {
    next_cursor?: string;
    scopes?: string[];
    acceptedScopes?: string[];
  };
}

export interface SlackMessageResponse extends SlackApiResponse {
  channel?: string;
  ts?: string;
  message?: SlackMessage;
}

export interface SlackChannelResponse extends SlackApiResponse {
  channel?: SlackChannel;
}

export interface SlackChannelsResponse extends SlackApiResponse {
  channels?: SlackChannel[];
}

export interface SlackSearchResponse extends SlackApiResponse {
  query?: string;
  messages?: {
    total: number;
    pagination?: {
      total_count: number;
      page: number;
      per_page: number;
      page_count: number;
      first: number;
      last: number;
    };
    paging?: {
      count: number;
      total: number;
      page: number;
      pages: number;
    };
    matches?: SlackMessage[];
  };
}

export interface SlackScheduleResponse extends SlackApiResponse {
  scheduled_message_id?: string;
}

// Input interfaces for API calls
export interface SendSlackMessageInput {
  channel: string;
  text: string;
  blocks?: SlackBlock[];
  thread_ts?: string;
  urgent?: boolean;
  as_user?: boolean;
  icon_emoji?: string;
  icon_url?: string;
  link_names?: boolean;
  parse?: 'full' | 'none';
  reply_broadcast?: boolean;
  unfurl_links?: boolean;
  unfurl_media?: boolean;
  username?: string;
}

export interface CreateSlackChannelInput {
  name: string;
  purpose?: string;
  topic?: string;
  is_private?: boolean;
  team_id?: string;
}

export interface SearchSlackInput {
  query: string;
  count?: number;
  highlight?: boolean;
  page?: number;
  sort?: 'score' | 'timestamp';
  sort_dir?: 'asc' | 'desc';
}

export interface ScheduleSlackMessageInput {
  channel: string;
  text: string;
  post_at: number;
  blocks?: SlackBlock[];
  as_user?: boolean;
  link_names?: boolean;
  parse?: 'full' | 'none';
  reply_broadcast?: boolean;
  thread_ts?: string;
  unfurl_links?: boolean;
  unfurl_media?: boolean;
}

// Webhook payload interface for Slack events
export interface SlackEventPayload {
  token: string;
  team_id: string;
  api_app_id: string;
  event: {
    type: string;
    channel: string;
    user: string;
    text: string;
    ts: string;
    event_ts: string;
    channel_type: string;
  };
  type: string;
  event_id: string;
  event_time: number;
  authed_users: string[];
}

// Bot info interface
export interface SlackBotInfo {
  ok: boolean;
  url?: string;
  team?: string;
  user?: string;
  team_id?: string;
  user_id?: string;
  bot_id?: string;
}

// Export utility type unions
export type SlackChannelType = 'public_channel' | 'private_channel' | 'mpim' | 'im';
export type SlackMessageType = 'message' | 'bot_message' | 'channel_join' | 'channel_leave';
export type SlackBlockType = 'section' | 'divider' | 'image' | 'actions' | 'context' | 'header' | 'input';
export type SlackElementType = 'button' | 'checkboxes' | 'datepicker' | 'image' | 'multi_static_select' | 'overflow' | 'plain_text_input' | 'radio_buttons' | 'static_select' | 'timepicker';