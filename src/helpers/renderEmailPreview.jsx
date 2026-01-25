export function renderEmailPreview({ subject, bodyHtml }, variables = {}) {
  let renderedSubject = subject || "";
  let renderedHtml = bodyHtml || "";

  Object.entries(variables).forEach(([key, value]) => {
    const token = `{{${key}}}`;
    renderedSubject = renderedSubject.split(token).join(value ?? "");
    renderedHtml = renderedHtml.split(token).join(value ?? "");
  });

  return {
    subject: renderedSubject,
    html: renderedHtml,
  };
}
