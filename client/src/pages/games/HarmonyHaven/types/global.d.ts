interface CharacterInformation {
  id: string;
  name: string;
  role: string;
  birthdate: string;
}

interface DocumentInformation {
  id: string;
  type: "application" | "permit" | "letter" | "other";
  content: string;
  date: string;
}
