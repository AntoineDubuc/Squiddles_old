/**
 * Template Manager Component - Based on product-manager-templates-v2.html mockup
 */

"use client";

import React, { useState } from 'react';

interface TemplateManagerProps {
  onNavigateBack?: () => void;
}

interface Template {
  id: string;
  name: string;
  type: 'tickets' | 'requirements' | 'planning' | 'research' | 'communication' | 'review' | 'process';
  description: string;
  icon: string;
  sections: string[];
  usageCount: number;
  isDefault?: boolean;
}

export default function TemplateManager({ onNavigateBack }: TemplateManagerProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [typeMenuOpen, setTypeMenuOpen] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'user-story',
      name: 'User Story',
      type: 'requirements',
      description: 'Standard template for feature development with user-focused approach',
      icon: '📖',
      sections: [
        'User Story (As a... I want... So that...)',
        'Business Value',
        'Acceptance Criteria',
        'Technical Notes'
      ],
      usageCount: 45,
      isDefault: true
    },
    {
      id: 'bug-report',
      name: 'Bug Report',
      type: 'communication',
      description: 'Comprehensive bug reporting with reproduction steps and environment details',
      icon: '🐛',
      sections: [
        'Problem Description',
        'Steps to Reproduce',
        'Expected vs Actual Behavior',
        'Environment & Browser',
        'Screenshots/Videos'
      ],
      usageCount: 23
    },
    {
      id: 'technical-spike',
      name: 'Technical Spike',
      type: 'research',
      description: 'Research and exploration template with time-boxed investigation',
      icon: '🔬',
      sections: [
        'Research Goal',
        'Key Questions',
        'Time Box (Duration)',
        'Expected Deliverables',
        'Success Criteria'
      ],
      usageCount: 12
    },
    {
      id: 'development-task',
      name: 'Development Task',
      type: 'tickets',
      description: 'Simple task template for implementation work and technical debt',
      icon: '✓',
      sections: [
        'Task Description',
        'Implementation Details',
        'Definition of Done',
        'Testing Requirements'
      ],
      usageCount: 67
    },
    {
      id: 'feature-release',
      name: 'Feature Release',
      type: 'planning',
      description: 'Comprehensive template for planning feature releases with rollout strategy',
      icon: '🚀',
      sections: [
        'Feature Overview',
        'Target Users & Impact',
        'Rollout Strategy',
        'Success Metrics',
        'Communication Plan',
        'Rollback Plan'
      ],
      usageCount: 8
    },
    {
      id: 'ab-test-plan',
      name: 'A/B Test Plan',
      type: 'review',
      description: 'Experiment design template for testing hypotheses with data',
      icon: '⚡',
      sections: [
        'Hypothesis Statement',
        'Test Variants',
        'Success Metrics',
        'Sample Size & Duration',
        'Analysis Plan'
      ],
      usageCount: 15
    },
    {
      id: 'ticket-lineage-research',
      name: 'Ticket Lineage Research',
      type: 'research',
      description: 'Research template for tracing ticket dependencies and historical context',
      icon: '🔍',
      sections: [
        'Target Ticket Identification',
        'Parent/Child Relationships',
        'Historical Context & Timeline',
        'Stakeholder Impact Analysis',
        'Related Features & Components',
        'Risk Assessment'
      ],
      usageCount: 31
    },
    {
      id: 'acceptance-criteria-generation',
      name: 'Acceptance Criteria Generation',
      type: 'requirements',
      description: 'Template for generating comprehensive acceptance criteria for stories',
      icon: '✅',
      sections: [
        'Story Overview & Context',
        'User Journey Mapping',
        'Functional Requirements',
        'Non-Functional Requirements',
        'Edge Cases & Error Handling',
        'Testing Scenarios'
      ],
      usageCount: 52
    },
    {
      id: 'pm-acceptance-review',
      name: 'PM Acceptance Review',
      type: 'review',
      description: 'Product Manager review template for validating completed work',
      icon: '👨‍💼',
      sections: [
        'Original Requirements Review',
        'Acceptance Criteria Validation',
        'User Experience Assessment',
        'Business Value Confirmation',
        'Performance & Quality Check',
        'Sign-off Decision & Notes'
      ],
      usageCount: 28
    },
    {
      id: 'summarize-ticket-lineage',
      name: 'Summarize Ticket and Lineage',
      type: 'communication',
      description: 'Template for creating comprehensive summaries of tickets and their relationships',
      icon: '📋',
      sections: [
        'Ticket Summary Overview',
        'Key Dependencies & Blockers',
        'Implementation Timeline',
        'Stakeholder Communications',
        'Lessons Learned',
        'Next Steps & Follow-ups'
      ],
      usageCount: 19
    },
    {
      id: 'create-ticket-from-pdf',
      name: 'Create Ticket from PDF',
      type: 'communication',
      description: 'Template for extracting and structuring requirements from PDF documents',
      icon: '📄',
      sections: [
        'PDF Source & Context',
        'Key Requirements Extraction',
        'Stakeholder Identification',
        'Technical Specifications',
        'Implementation Approach',
        'Validation & Testing Plan'
      ],
      usageCount: 7
    },
    {
      id: 'cross-platform-research',
      name: 'Cross Platform Research',
      type: 'research',
      description: 'Research template for analyzing feature implementation across platforms',
      icon: '🌐',
      sections: [
        'Platform Scope Definition',
        'Technical Constraints Analysis',
        'User Experience Comparison',
        'Implementation Effort Estimation',
        'Platform-Specific Considerations',
        'Recommendation & Next Steps'
      ],
      usageCount: 14
    },
    {
      id: 'stakeholder-alignment',
      name: 'Stakeholder Alignment',
      type: 'communication',
      description: 'Template for aligning stakeholders on project goals and expectations',
      icon: '🤝',
      sections: [
        'Stakeholder Identification',
        'Current Understanding Assessment',
        'Alignment Goals & Objectives',
        'Communication Strategy',
        'Decision-Making Process',
        'Follow-up Actions'
      ],
      usageCount: 22
    },
    {
      id: 'sprint-retrospective',
      name: 'Sprint Retrospective',
      type: 'process',
      description: 'Template for conducting effective sprint retrospectives with action items',
      icon: '🔄',
      sections: [
        'Sprint Overview & Metrics',
        'What Went Well',
        'What Could Be Improved',
        'Action Items & Owners',
        'Process Improvements',
        'Next Sprint Focus'
      ],
      usageCount: 35
    },
    {
      id: 'product-strategy-review',
      name: 'Product Strategy Review',
      type: 'planning',
      description: 'Comprehensive template for quarterly product strategy assessment',
      icon: '🎯',
      sections: [
        'Market Analysis & Trends',
        'Competitive Landscape',
        'User Feedback Summary',
        'Strategic Objectives',
        'Resource Allocation',
        'Success Metrics & KPIs'
      ],
      usageCount: 18
    }
  ]);

  const filterTabs = [
    { id: 'all', label: 'All Templates' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'planning', label: 'Planning' },
    { id: 'research', label: 'Research' },
    { id: 'communication', label: 'Communication' },
    { id: 'review', label: 'Review' },
    { id: 'process', label: 'Process' }
  ];

  const typeOptions = [
    { id: 'tickets', label: 'Tickets', icon: '🎫' },
    { id: 'requirements', label: 'Requirements', icon: '📋' },
    { id: 'planning', label: 'Planning', icon: '🗓️' },
    { id: 'research', label: 'Research', icon: '🔍' },
    { id: 'communication', label: 'Communication', icon: '💬' },
    { id: 'review', label: 'Review', icon: '👁️' },
    { id: 'process', label: 'Process', icon: '🔄' }
  ];

  const filteredTemplates = templates.filter(template => 
    activeFilter === 'all' || template.type === activeFilter
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tickets': return { bg: 'rgba(139, 92, 246, 0.1)', border: '#8B5CF6', gradient: 'linear-gradient(90deg, #8B5CF6, #A78BFA)' };
      case 'requirements': return { bg: 'rgba(59, 130, 246, 0.1)', border: '#3B82F6', gradient: 'linear-gradient(90deg, #3B82F6, #60A5FA)' };
      case 'planning': return { bg: 'rgba(34, 197, 94, 0.1)', border: '#22C55E', gradient: 'linear-gradient(90deg, #22C55E, #4ADE80)' };
      case 'research': return { bg: 'rgba(251, 208, 36, 0.1)', border: '#FBD024', gradient: 'linear-gradient(90deg, #FBD024, #FDE047)' };
      case 'communication': return { bg: 'rgba(6, 182, 212, 0.1)', border: '#06B6D4', gradient: 'linear-gradient(90deg, #06B6D4, #22D3EE)' };
      case 'review': return { bg: 'rgba(16, 185, 129, 0.1)', border: '#10B981', gradient: 'linear-gradient(90deg, #10B981, #34D399)' };
      case 'process': return { bg: 'rgba(249, 115, 22, 0.1)', border: '#F97316', gradient: 'linear-gradient(90deg, #F97316, #FB923C)' };
      default: return { bg: 'rgba(107, 114, 128, 0.1)', border: '#6B7280', gradient: 'linear-gradient(90deg, #6B7280, #9CA3AF)' };
    }
  };

  const handleUseTemplate = (template: Template) => {
    console.log('Using template:', template.name);
    // This would integrate with the voice interface to start creating a ticket
    alert(`Starting new ${template.type} using "${template.name}" template`);
  };

  const handleEditTemplate = (template: Template) => {
    console.log('Editing template:', template.name);
    setSelectedTemplate(template);
  };

  const handleTypeChange = (templateId: string, newType: 'tickets' | 'requirements' | 'planning' | 'research' | 'communication' | 'review' | 'process') => {
    setTemplates(prevTemplates => 
      prevTemplates.map(template => 
        template.id === templateId 
          ? { ...template, type: newType }
          : template
      )
    );
    setTypeMenuOpen(null);
  };

  const handleTypeBadgeClick = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    setTypeMenuOpen(typeMenuOpen === templateId ? null : templateId);
  };

  // Close type menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setTypeMenuOpen(null);
    };
    
    if (typeMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [typeMenuOpen]);

  return (
    <>
      <div className="background-gradient"></div>
      <div className="container">
        <div className="app-layout">
          {/* Main Content */}
          <div className="template-main">
            {/* Header */}
            <div className="template-header">
              <div className="template-header-left">
                <button className="back-button" onClick={onNavigateBack}>
                  <span>←</span>
                  <span>Back to Dashboard</span>
                </button>
                <div>
                  <h1 className="template-title">Your Templates</h1>
                  <div className="voice-command-hint">
                    🎙️ "Show me bug templates" or "Create a new story template"
                  </div>
                </div>
              </div>
              <div className="template-header-right">
                <button className="new-template-button">
                  <span>+</span>
                  <span>New Template</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="template-filter-tabs">
              {filterTabs.map((tab) => (
                <div 
                  key={tab.id}
                  className={`template-filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab.id)}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            {/* Template Grid */}
            <div className="template-grid">
              {filteredTemplates.map((template) => {
                const colors = getTypeColor(template.type);
                return (
                  <div 
                    key={template.id}
                    className="template-card"
                    style={{
                      borderColor: colors.border + '40'
                    }}
                  >
                    {/* Top gradient bar */}
                    <div 
                      className="template-card-top-bar"
                      style={{ background: colors.gradient }}
                    />
                    
                    {template.isDefault && (
                      <div className="default-badge">Default</div>
                    )}
                    
                    <div className="template-card-header">
                      <div className="template-card-icon">{template.icon}</div>
                      <div className="template-type-badge-container" style={{ marginTop: template.isDefault ? '2rem' : '0' }}>
                        <div 
                          className="template-type-badge clickable"
                          style={{ 
                            backgroundColor: colors.bg,
                            color: colors.border,
                            borderColor: colors.border
                          }}
                          onClick={(e) => handleTypeBadgeClick(e, template.id)}
                        >
                          {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                          <span className="dropdown-arrow">▼</span>
                        </div>
                        
                        {typeMenuOpen === template.id && (
                          <div className="type-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                            {typeOptions.map((option) => (
                              <div
                                key={option.id}
                                className={`type-dropdown-item ${template.type === option.id ? 'active' : ''}`}
                                onClick={() => handleTypeChange(template.id, option.id as 'tickets' | 'requirements' | 'planning' | 'research' | 'communication' | 'review' | 'process')}
                              >
                                <span className="type-dropdown-icon">{option.icon}</span>
                                <span className="type-dropdown-label">{option.label}</span>
                                {template.type === option.id && <span className="type-dropdown-check">✓</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="template-card-name">{template.name}</h3>
                    <p className="template-card-description">{template.description}</p>
                    
                    <div className="template-sections">
                      <ul className="template-section-list">
                        {template.sections.map((section, index) => (
                          <li key={index} className="template-section-item">{section}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="template-card-footer">
                      <span className="template-usage">Used {template.usageCount} times</span>
                      <div className="template-actions">
                        <button 
                          className="template-action-button primary"
                          onClick={() => handleUseTemplate(template)}
                        >
                          Use
                        </button>
                        <button 
                          className="template-action-button"
                          onClick={() => handleEditTemplate(template)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State for Custom Templates */}
            {activeFilter === 'custom' && filteredTemplates.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <h3 className="empty-state-title">No Custom Templates Yet</h3>
                <p className="empty-state-description">
                  Create your first custom template to streamline your team's workflow
                </p>
                <button className="new-template-button">
                  <span>+</span>
                  <span>Create Custom Template</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Editor Modal */}
      {selectedTemplate && (
        <div className="template-modal-overlay" onClick={() => setSelectedTemplate(null)}>
          <div className="template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="template-modal-header">
              <h2 className="template-modal-title">Edit Template: {selectedTemplate.name}</h2>
              <button 
                className="template-modal-close"
                onClick={() => setSelectedTemplate(null)}
              >
                ✕
              </button>
            </div>
            <div className="template-modal-content">
              <div className="template-form">
                <div className="template-form-group">
                  <label className="template-form-label">Template Name</label>
                  <input 
                    type="text" 
                    className="template-form-input"
                    defaultValue={selectedTemplate.name}
                  />
                </div>
                <div className="template-form-group">
                  <label className="template-form-label">Description</label>
                  <textarea 
                    className="template-form-textarea"
                    defaultValue={selectedTemplate.description}
                    rows={3}
                  />
                </div>
                <div className="template-form-group">
                  <label className="template-form-label">Template Sections</label>
                  <div className="template-sections-editor">
                    {selectedTemplate.sections.map((section, index) => (
                      <div key={index} className="template-section-editor">
                        <input 
                          type="text" 
                          className="template-form-input"
                          defaultValue={section}
                        />
                        <button className="template-section-remove">-</button>
                      </div>
                    ))}
                    <button className="template-section-add">+ Add Section</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="template-modal-footer">
              <button 
                className="template-modal-button secondary"
                onClick={() => setSelectedTemplate(null)}
              >
                Cancel
              </button>
              <button className="template-modal-button primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}