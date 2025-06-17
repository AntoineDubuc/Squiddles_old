/**
 * Validation Schemas for Ticket Data
 * Implements TICKET-002: Enhanced Ticket Data Models
 */

// Simple validation utilities (we can upgrade to Zod later if needed)
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule {
  field: string;
  message: string;
  validator: (value: any) => boolean;
}

/**
 * Validate ticket creation data
 */
export function validateTicketCreation(data: any): ValidationResult {
  const rules: ValidationRule[] = [
    {
      field: 'title',
      message: 'Title is required and must be between 5 and 200 characters',
      validator: (value) => typeof value === 'string' && value.length >= 5 && value.length <= 200
    },
    {
      field: 'description',
      message: 'Description is required and must be at least 10 characters',
      validator: (value) => typeof value === 'string' && value.length >= 10
    },
    {
      field: 'type',
      message: 'Type must be one of: story, task, bug, spike, epic',
      validator: (value) => ['story', 'task', 'bug', 'spike', 'epic'].includes(value)
    },
    {
      field: 'priority',
      message: 'Priority must be one of: low, medium, high, critical',
      validator: (value) => ['low', 'medium', 'high', 'critical'].includes(value)
    },
    {
      field: 'projectId',
      message: 'Project ID is required',
      validator: (value) => typeof value === 'string' && value.length > 0
    },
    {
      field: 'reporterId',
      message: 'Reporter ID is required',
      validator: (value) => typeof value === 'string' && value.length > 0
    }
  ];

  const errors: string[] = [];

  for (const rule of rules) {
    const fieldValue = data[rule.field];
    if (!rule.validator(fieldValue)) {
      errors.push(rule.message);
    }
  }

  // Validate optional fields if present
  if (data.storyPoints !== undefined) {
    if (typeof data.storyPoints !== 'number' || data.storyPoints < 1 || data.storyPoints > 100) {
      errors.push('Story points must be a number between 1 and 100');
    }
  }

  if (data.assigneeId !== undefined) {
    if (typeof data.assigneeId !== 'string' || data.assigneeId.length === 0) {
      errors.push('Assignee ID must be a valid string if provided');
    }
  }

  if (data.acceptanceCriteria !== undefined) {
    if (!Array.isArray(data.acceptanceCriteria)) {
      errors.push('Acceptance criteria must be an array');
    } else {
      const invalidCriteria = data.acceptanceCriteria.some((criterion: any) => 
        typeof criterion !== 'string' || criterion.length < 5
      );
      if (invalidCriteria) {
        errors.push('Each acceptance criterion must be at least 5 characters long');
      }
    }
  }

  if (data.sections !== undefined) {
    if (!Array.isArray(data.sections)) {
      errors.push('Sections must be an array');
    } else {
      const invalidSections = data.sections.some((section: any) => 
        !section.name || typeof section.name !== 'string' || section.name.length < 2 ||
        !section.content || typeof section.content !== 'string' || section.content.length < 5
      );
      if (invalidSections) {
        errors.push('Each section must have a name (2+ chars) and content (5+ chars)');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate ticket update data
 */
export function validateTicketUpdate(data: any): ValidationResult {
  const errors: string[] = [];

  // All fields are optional for updates, but if present must be valid
  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.length < 5 || data.title.length > 200) {
      errors.push('Title must be between 5 and 200 characters');
    }
  }

  if (data.description !== undefined) {
    if (typeof data.description !== 'string' || data.description.length < 10) {
      errors.push('Description must be at least 10 characters');
    }
  }

  if (data.status !== undefined) {
    if (!['todo', 'in_progress', 'in_review', 'done'].includes(data.status)) {
      errors.push('Status must be one of: todo, in_progress, in_review, done');
    }
  }

  if (data.priority !== undefined) {
    if (!['low', 'medium', 'high', 'critical'].includes(data.priority)) {
      errors.push('Priority must be one of: low, medium, high, critical');
    }
  }

  if (data.type !== undefined) {
    if (!['story', 'task', 'bug', 'spike', 'epic'].includes(data.type)) {
      errors.push('Type must be one of: story, task, bug, spike, epic');
    }
  }

  if (data.storyPoints !== undefined) {
    if (typeof data.storyPoints !== 'number' || data.storyPoints < 1 || data.storyPoints > 100) {
      errors.push('Story points must be a number between 1 and 100');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate comment creation data
 */
export function validateCommentCreation(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.content || typeof data.content !== 'string' || data.content.length < 1) {
    errors.push('Comment content is required');
  }

  if (data.content && data.content.length > 10000) {
    errors.push('Comment content cannot exceed 10,000 characters');
  }

  if (!data.authorId || typeof data.authorId !== 'string') {
    errors.push('Author ID is required');
  }

  if (!data.ticketId || typeof data.ticketId !== 'string') {
    errors.push('Ticket ID is required');
  }

  if (data.mentions !== undefined) {
    if (!Array.isArray(data.mentions)) {
      errors.push('Mentions must be an array');
    } else {
      const invalidMentions = data.mentions.some((mention: any) => 
        typeof mention !== 'string' || mention.length === 0
      );
      if (invalidMentions) {
        errors.push('All mentions must be valid user IDs');
      }
    }
  }

  if (data.parentCommentId !== undefined) {
    if (typeof data.parentCommentId !== 'string' || data.parentCommentId.length === 0) {
      errors.push('Parent comment ID must be a valid string if provided');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate ticket section data
 */
export function validateTicketSection(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.length < 2) {
    errors.push('Section name is required and must be at least 2 characters');
  }

  if (!data.content || typeof data.content !== 'string' || data.content.length < 5) {
    errors.push('Section content is required and must be at least 5 characters');
  }

  if (!data.type || !['text', 'list', 'checklist'].includes(data.type)) {
    errors.push('Section type must be one of: text, list, checklist');
  }

  if (data.order !== undefined) {
    if (typeof data.order !== 'number' || data.order < 0) {
      errors.push('Section order must be a non-negative number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate search query parameters
 */
export function validateSearchQuery(data: any): ValidationResult {
  const errors: string[] = [];

  if (data.query !== undefined) {
    if (typeof data.query !== 'string') {
      errors.push('Search query must be a string');
    } else if (data.query.length > 500) {
      errors.push('Search query cannot exceed 500 characters');
    }
  }

  if (data.types !== undefined) {
    if (!Array.isArray(data.types)) {
      errors.push('Types filter must be an array');
    } else {
      const validTypes = ['tickets', 'comments', 'templates', 'users'];
      const invalidTypes = data.types.some((type: any) => !validTypes.includes(type));
      if (invalidTypes) {
        errors.push('Types must be one of: tickets, comments, templates, users');
      }
    }
  }

  if (data.limit !== undefined) {
    if (typeof data.limit !== 'number' || data.limit < 1 || data.limit > 100) {
      errors.push('Limit must be a number between 1 and 100');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate pagination parameters
 */
export function validatePagination(data: any): ValidationResult {
  const errors: string[] = [];

  if (data.page !== undefined) {
    if (typeof data.page !== 'number' || data.page < 1) {
      errors.push('Page must be a positive number');
    }
  }

  if (data.limit !== undefined) {
    if (typeof data.limit !== 'number' || data.limit < 1 || data.limit > 100) {
      errors.push('Limit must be a number between 1 and 100');
    }
  }

  if (data.sortBy !== undefined) {
    const validSortFields = ['createdAt', 'updatedAt', 'priority', 'title', 'status'];
    if (!validSortFields.includes(data.sortBy)) {
      errors.push('SortBy must be one of: createdAt, updatedAt, priority, title, status');
    }
  }

  if (data.sortOrder !== undefined) {
    if (!['asc', 'desc'].includes(data.sortOrder)) {
      errors.push('SortOrder must be either asc or desc');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate voice session data
 */
export function validateVoiceSession(data: any): ValidationResult {
  const errors: string[] = [];

  if (data.transcript !== undefined) {
    if (typeof data.transcript !== 'string') {
      errors.push('Transcript must be a string');
    } else if (data.transcript.length > 5000) {
      errors.push('Transcript cannot exceed 5,000 characters');
    }
  }

  if (data.confidence !== undefined) {
    if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 1) {
      errors.push('Confidence must be a number between 0 and 1');
    }
  }

  if (data.intent !== undefined) {
    if (typeof data.intent !== 'string' || data.intent.length === 0) {
      errors.push('Intent must be a non-empty string');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize ticket data before processing
 */
export function sanitizeTicketData(data: any): any {
  const sanitized = { ...data };

  if (sanitized.title) {
    sanitized.title = sanitizeInput(sanitized.title);
  }

  if (sanitized.description) {
    sanitized.description = sanitizeInput(sanitized.description);
  }

  if (sanitized.sections && Array.isArray(sanitized.sections)) {
    sanitized.sections = sanitized.sections.map((section: any) => ({
      ...section,
      name: sanitizeInput(section.name),
      content: sanitizeInput(section.content),
    }));
  }

  if (sanitized.acceptanceCriteria && Array.isArray(sanitized.acceptanceCriteria)) {
    sanitized.acceptanceCriteria = sanitized.acceptanceCriteria.map((criterion: string) =>
      sanitizeInput(criterion)
    );
  }

  return sanitized;
}