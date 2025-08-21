function MarkdownRenderer({ value }) {
  return <span dangerouslySetInnerHTML={{ __html: marked.parse(value || '') }} />;
}
