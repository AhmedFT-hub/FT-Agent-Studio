export interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: "Planning" | "Tracking" | "Intelligence" | "Finance" | "Control Tower" | "Other";
  tags: string[];
  status: "Live" | "Beta" | "Experimental";
  vercelUrl: string;
  imageUrl: string;
  lastUpdated: string;
  primaryActionLabel?: string;
}


