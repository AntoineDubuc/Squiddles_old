#!/usr/bin/env node

/**
 * ADF Builder - Utility for building Atlassian Document Format structures
 * 
 * This provides a fluent API for constructing ADF documents programmatically.
 */

class ADFBuilder {
  constructor() {
    this.doc = {
      type: "doc",
      version: 1,
      content: []
    };
  }

  /**
   * Add a paragraph
   */
  paragraph(callback) {
    const p = new ParagraphBuilder();
    if (callback) callback(p);
    this.doc.content.push(p.build());
    return this;
  }

  /**
   * Add a heading
   */
  heading(level, text) {
    this.doc.content.push({
      type: "heading",
      attrs: { level },
      content: [{
        type: "text",
        text: text
      }]
    });
    return this;
  }

  /**
   * Add a bullet list
   */
  bulletList(items) {
    const listItems = items.map(item => ({
      type: "listItem",
      content: [{
        type: "paragraph",
        content: [{
          type: "text",
          text: item
        }]
      }]
    }));

    this.doc.content.push({
      type: "bulletList",
      content: listItems
    });
    return this;
  }

  /**
   * Add an ordered list
   */
  orderedList(items) {
    const listItems = items.map(item => ({
      type: "listItem",
      content: [{
        type: "paragraph",
        content: [{
          type: "text",
          text: item
        }]
      }]
    }));

    this.doc.content.push({
      type: "orderedList",
      content: listItems
    });
    return this;
  }

  /**
   * Add a code block
   */
  codeBlock(code, language = "plain") {
    this.doc.content.push({
      type: "codeBlock",
      attrs: { language },
      content: [{
        type: "text",
        text: code
      }]
    });
    return this;
  }

  /**
   * Add a table
   */
  table(callback) {
    const t = new TableBuilder();
    if (callback) callback(t);
    this.doc.content.push(t.build());
    return this;
  }

  /**
   * Add a panel (info, note, warning, error, success)
   */
  panel(type, content) {
    this.doc.content.push({
      type: "panel",
      attrs: { panelType: type },
      content: [{
        type: "paragraph",
        content: [{
          type: "text",
          text: content
        }]
      }]
    });
    return this;
  }

  /**
   * Add a blockquote
   */
  blockquote(text) {
    this.doc.content.push({
      type: "blockquote",
      content: [{
        type: "paragraph",
        content: [{
          type: "text",
          text: text
        }]
      }]
    });
    return this;
  }

  /**
   * Add a horizontal rule
   */
  rule() {
    this.doc.content.push({
      type: "rule"
    });
    return this;
  }

  /**
   * Build the final document
   */
  build() {
    return { body: this.doc };
  }
}

/**
 * Paragraph builder for complex inline content
 */
class ParagraphBuilder {
  constructor() {
    this.content = [];
  }

  text(text, marks = []) {
    this.content.push({
      type: "text",
      text: text,
      ...(marks.length > 0 && { marks })
    });
    return this;
  }

  bold(text) {
    return this.text(text, [{ type: "strong" }]);
  }

  italic(text) {
    return this.text(text, [{ type: "em" }]);
  }

  underline(text) {
    return this.text(text, [{ type: "underline" }]);
  }

  strike(text) {
    return this.text(text, [{ type: "strike" }]);
  }

  code(text) {
    return this.text(text, [{ type: "code" }]);
  }

  link(text, href) {
    return this.text(text, [{ type: "link", attrs: { href } }]);
  }

  mention(accountId, displayName) {
    this.content.push({
      type: "mention",
      attrs: {
        id: accountId,
        text: `@${displayName}`,
        userType: "DEFAULT"
      }
    });
    return this;
  }

  hardBreak() {
    this.content.push({
      type: "hardBreak"
    });
    return this;
  }

  build() {
    return {
      type: "paragraph",
      content: this.content
    };
  }
}

/**
 * Table builder
 */
class TableBuilder {
  constructor() {
    this.rows = [];
    this.attrs = {
      isNumberColumnEnabled: false,
      layout: "default"
    };
  }

  headerRow(headers) {
    const cells = headers.map(header => ({
      type: "tableHeader",
      attrs: {},
      content: [{
        type: "paragraph",
        content: [{
          type: "text",
          text: header
        }]
      }]
    }));

    this.rows.push({
      type: "tableRow",
      content: cells
    });
    return this;
  }

  row(cells) {
    const tableCells = cells.map(cell => ({
      type: "tableCell",
      attrs: {},
      content: [{
        type: "paragraph",
        content: [{
          type: "text",
          text: String(cell)
        }]
      }]
    }));

    this.rows.push({
      type: "tableRow",
      content: tableCells
    });
    return this;
  }

  build() {
    return {
      type: "table",
      attrs: this.attrs,
      content: this.rows
    };
  }
}

/**
 * Example usage
 */
function exampleUsage() {
  const comment = new ADFBuilder()
    .heading(2, "Status Update")
    .paragraph(p => p
      .text("The feature is ")
      .bold("90% complete")
      .text(" and on track for delivery.")
    )
    .panel("info", "Deployment scheduled for Friday at 2 PM EST")
    .heading(3, "Completed Tasks")
    .bulletList([
      "Implemented API endpoints",
      "Added unit tests (coverage: 95%)",
      "Updated documentation"
    ])
    .heading(3, "Test Results")
    .table(t => t
      .headerRow(["Component", "Tests", "Coverage", "Status"])
      .row(["API", "45", "98%", "✅ Pass"])
      .row(["Frontend", "120", "92%", "✅ Pass"])
      .row(["Integration", "15", "85%", "⚠️ 1 Flaky"])
    )
    .codeBlock("npm test -- --coverage", "bash")
    .paragraph(p => p
      .text("CC: ")
      .mention("123456", "John Doe")
      .text(" ")
      .mention("789012", "Jane Smith")
    )
    .build();

  return comment;
}

// Export for use in other scripts
module.exports = {
  ADFBuilder,
  ParagraphBuilder,
  TableBuilder
};

// If run directly, show example
if (require.main === module) {
  const example = exampleUsage();
  console.log("Example ADF Document:");
  console.log(JSON.stringify(example, null, 2));
}