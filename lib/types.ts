export interface Member {
  id: number;
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}


// export interface EditorialMember {
//   id: number; // unique identifier
//   name: string; // full name of the member
//   role: "Chief Editor" | "Associate Editor" | "Co-editor" | "Reviewer"; // explicit roles
//   image: string; // profile image URL (required for display)
//   affiliation?: string; // e.g., "Marwari College, Ranchi"
//   email?: string; // optional contact email
//   linkedin?: string; // optional LinkedIn profile URL
//   twitter?: string; // optional Twitter profile URL
//   website?: string; // optional personal or professional website
//   bio?: string; // short biography
// }
