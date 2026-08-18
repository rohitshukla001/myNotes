# Notes site — project instructions

## Voice in the PDF documents

Write the documents in first person plural. Use **we**, never **you**.

This applies to every PDF under `notes/` and `docs/`, on every revision, including
small edits to a single sentence. It is a rule about the finished document, not a
starting preference to be traded away.

Replace the whole family, not just the subject pronoun, or the result reads as a
half-finished find and replace:

| Second person | Use instead | Example |
| --- | --- | --- |
| you (subject) | we | "You describe what data you want" → "We describe what data we want" |
| you (object) | us | "That gives you rows 41 to 60" → "That gives us rows 41 to 60" |
| your | our | "your pagination breaks" → "our pagination breaks" |
| yourself | ourselves | "If you find yourself writing a loop" → "If we find ourselves writing a loop" |
| you're / you'd | we're / we'd | "You'd do ORDER BY ..." → "We'd do ORDER BY ..." |

Two things this rule does not touch:

- **Code.** Identifiers, string literals, and SQL or shell comments stay exactly as
  written, even when they contain "you".
- **Imperatives.** "Always name the columns", "Watch query plans" and similar have no
  pronoun to convert. Leave them alone rather than forcing a "we" in.

Some sentences break when converted literally and need rewriting instead. "Future you
will read this code more than you write it" became "We will read this code more often
than we write it".
