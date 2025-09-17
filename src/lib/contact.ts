export interface ExtractedContacts {
  emails: string[];
  phones: string[];
  links: string[];
}

const dedupe = (arr: string[]) => Array.from(new Set(arr));

export const extractContacts = (htmlOrText: string): ExtractedContacts => {
  const text = (htmlOrText || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3}[\s-]?\d{2,4}[\s-]?\d{2,4}/g;
  const urlRegex = /https?:\/\/[\w.-]+(?:\/[\w./#?&=%+-]*)?/g;

  const emails = dedupe(text.match(emailRegex) || []);
  const phones = dedupe((text.match(phoneRegex) || []).map(p => p.trim()).filter(p => p.replace(/\D/g, "").length >= 7));
  const links = dedupe(text.match(urlRegex) || []);

  return { emails, phones, links };
}; 