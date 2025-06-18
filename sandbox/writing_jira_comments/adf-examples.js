#!/usr/bin/env node

/**
 * ADF (Atlassian Document Format) Examples
 * 
 * This file contains various examples of ADF structures for creating
 * rich Jira comments with different content types.
 */

/**
 * Example 1: Comment with all text formatting options
 */
const formattingExample = {
  body: {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This comment demonstrates ",
          },
          {
            type: "text",
            text: "bold",
            marks: [{ type: "strong" }]
          },
          {
            type: "text",
            text: ", ",
          },
          {
            type: "text",
            text: "italic",
            marks: [{ type: "em" }]
          },
          {
            type: "text",
            text: ", ",
          },
          {
            type: "text",
            text: "underlined",
            marks: [{ type: "underline" }]
          },
          {
            type: "text",
            text: ", ",
          },
          {
            type: "text",
            text: "strikethrough",
            marks: [{ type: "strike" }]
          },
          {
            type: "text",
            text: ", and ",
          },
          {
            type: "text",
            text: "inline code",
            marks: [{ type: "code" }]
          },
          {
            type: "text",
            text: " formatting.",
          }
        ]
      }
    ]
  }
};

/**
 * Example 2: Comment with multiple headings and sections
 */
const structuredExample = {
  body: {
    type: "doc",
    version: 1,
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Sprint Review Summary"
          }
        ]
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "Completed Items"
          }
        ]
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Implemented user authentication"
                  }
                ]
              }
            ]
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Fixed critical bug in payment processing"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          {
            type: "text",
            text: "Blockers"
          }
        ]
      },
      {
        type: "panel",
        attrs: {
          panelType: "warning"
        },
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Database migration scheduled for next week may impact development."
              }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * Example 3: Comment with table showing test results
 */
const tableExample = {
  body: {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Test execution results for build #1234:"
          }
        ]
      },
      {
        type: "table",
        attrs: {
          isNumberColumnEnabled: false,
          layout: "default"
        },
        content: [
          {
            type: "tableRow",
            content: [
              {
                type: "tableHeader",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Test Suite"
                      }
                    ]
                  }
                ]
              },
              {
                type: "tableHeader",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Passed"
                      }
                    ]
                  }
                ]
              },
              {
                type: "tableHeader",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Failed"
                      }
                    ]
                  }
                ]
              },
              {
                type: "tableHeader",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Coverage"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "tableRow",
            content: [
              {
                type: "tableCell",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Unit Tests"
                      }
                    ]
                  }
                ]
              },
              {
                type: "tableCell",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "245",
                        marks: [{ type: "strong" }]
                      }
                    ]
                  }
                ]
              },
              {
                type: "tableCell",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "3",
                        marks: [{ type: "strong" }]
                      }
                    ]
                  }
                ]
              },
              {
                type: "tableCell",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "87%"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "tableRow",
            content: [
              {
                type: "tableCell",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "Integration Tests"
                      }
                    ]
                  }
                ]
              },
              {
                type: "tableCell",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "42",
                        marks: [{ type: "strong" }]
                      }
                    ]
                  }
                ]
              },
              {
                type: "tableCell",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "1",
                        marks: [{ type: "strong" }]
                      }
                    ]
                  }
                ]
              },
              {
                type: "tableCell",
                attrs: {},
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "72%"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * Example 4: Comment with code examples in multiple languages
 */
const codeExample = {
  body: {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Here's how to implement the new API endpoint:"
          }
        ]
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [
          {
            type: "text",
            text: "JavaScript/Node.js"
          }
        ]
      },
      {
        type: "codeBlock",
        attrs: {
          language: "javascript"
        },
        content: [
          {
            type: "text",
            text: "app.post('/api/comments', async (req, res) => {\n  const { ticketId, body } = req.body;\n  const comment = await jiraClient.addComment(ticketId, body);\n  res.json(comment);\n});"
          }
        ]
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [
          {
            type: "text",
            text: "Python/Flask"
          }
        ]
      },
      {
        type: "codeBlock",
        attrs: {
          language: "python"
        },
        content: [
          {
            type: "text",
            text: "@app.route('/api/comments', methods=['POST'])\ndef add_comment():\n    data = request.get_json()\n    comment = jira_client.add_comment(\n        ticket_id=data['ticketId'],\n        body=data['body']\n    )\n    return jsonify(comment)"
          }
        ]
      }
    ]
  }
};

/**
 * Example 5: Comment with mentions and links
 */
const socialExample = {
  body: {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Hey "
          },
          {
            type: "mention",
            attrs: {
              id: "5b10a2844c20165700ede21g",
              text: "@John Doe",
              userType: "DEFAULT"
            }
          },
          {
            type: "text",
            text: " and "
          },
          {
            type: "mention",
            attrs: {
              id: "5b10a2844c20165700ede21h",
              text: "@Jane Smith",
              userType: "DEFAULT"
            }
          },
          {
            type: "text",
            text: ", please review the "
          },
          {
            type: "text",
            text: "API documentation",
            marks: [
              {
                type: "link",
                attrs: {
                  href: "https://docs.example.com/api"
                }
              }
            ]
          },
          {
            type: "text",
            text: " before our meeting tomorrow."
          }
        ]
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Key points to discuss:"
          }
        ]
      },
      {
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Authentication flow"
                  }
                ]
              }
            ]
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Rate limiting strategy"
                  }
                ]
              }
            ]
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Error handling patterns"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * Example 6: Comment with info panels and quotes
 */
const panelExample = {
  body: {
    type: "doc",
    version: 1,
    content: [
      {
        type: "panel",
        attrs: {
          panelType: "info"
        },
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "ℹ️ This ticket has been moved to the next sprint due to dependencies."
              }
            ]
          }
        ]
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "As discussed in the planning meeting:"
          }
        ]
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "We need to wait for the infrastructure team to complete the database migration before we can proceed with this feature."
              }
            ]
          }
        ]
      },
      {
        type: "panel",
        attrs: {
          panelType: "note"
        },
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "📝 Remember to update the documentation once this is implemented."
              }
            ]
          }
        ]
      }
    ]
  }
};

// Export all examples
module.exports = {
  formattingExample,
  structuredExample,
  tableExample,
  codeExample,
  socialExample,
  panelExample
};

// If run directly, show the examples
if (require.main === module) {
  console.log('ADF Examples:\n');
  console.log('1. Formatting Example:', JSON.stringify(formattingExample, null, 2));
  console.log('\n2. Structured Example:', JSON.stringify(structuredExample, null, 2));
  console.log('\n3. Table Example:', JSON.stringify(tableExample, null, 2));
  console.log('\n4. Code Example:', JSON.stringify(codeExample, null, 2));
  console.log('\n5. Social Example:', JSON.stringify(socialExample, null, 2));
  console.log('\n6. Panel Example:', JSON.stringify(panelExample, null, 2));
}