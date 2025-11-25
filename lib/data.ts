import { Agent } from "./types";

export const agents: Agent[] = [
  {
    id: "1",
    name: "Dispatch Compliance Validator",
    slug: "dispatch-compliance-validator",
    description: "Automated validation system that ensures all dispatch operations comply with regulatory requirements and company policies. Flags non-compliant dispatches before they occur.",
    category: "Other",
    tags: [],
    status: "Live",
    vercelUrl: "https://freight-intelligence-hub.vercel.app",
    imageUrl: "/agents/rate-intelligence.svg",
    lastUpdated: "Nov 2025",
    primaryActionLabel: "See it in action"
  },
  {
    id: "2",
    name: "Red Zone Alert Agent",
    slug: "red-zone-alert",
    description: "Real-time monitoring system that identifies high-risk delivery zones and sends proactive alerts. Helps prevent delays and security issues in critical areas.",
    category: "Tracking",
    tags: [],
    status: "Live",
    vercelUrl: "https://red-zone-demo.vercel.app",
    imageUrl: "/agents/exception-sentinel.svg",
    lastUpdated: "Nov 2025",
    primaryActionLabel: "See it in action"
  },
  {
    id: "3",
    name: "Delay Forecasting",
    slug: "delay-forecasting",
    description: "Predictive AI that forecasts potential delays before they happen. Analyzes weather, traffic, and historical patterns to provide early warnings and alternative solutions.",
    category: "Intelligence",
    tags: [],
    status: "Live",
    vercelUrl: "https://delay-forecasting-demo.vercel.app",
    imageUrl: "/agents/capacity-predictor.svg",
    lastUpdated: "Nov 2025",
    primaryActionLabel: "See it in action"
  },
  {
    id: "4",
    name: "Load Assignment",
    slug: "load-assignment",
    description: "Smart load assignment system that optimally matches loads with available vehicles and drivers. Considers capacity, location, driver schedules, and cost efficiency.",
    category: "Planning",
    tags: [],
    status: "Live",
    vercelUrl: "https://load-assignment-demo.vercel.app",
    imageUrl: "/agents/fleetedge.svg",
    lastUpdated: "Nov 2025",
    primaryActionLabel: "See it in action"
  },
  {
    id: "5",
    name: "Load Planning",
    slug: "load-planning",
    description: "Advanced load planning tool that optimizes cargo consolidation and vehicle utilization. Maximizes space efficiency while minimizing transportation costs.",
    category: "Planning",
    tags: [],
    status: "Live",
    vercelUrl: "https://load-planning-demo.vercel.app",
    imageUrl: "/agents/route-oracle.svg",
    lastUpdated: "Nov 2025",
    primaryActionLabel: "See it in action"
  },
  {
    id: "6",
    name: "Ops Genie",
    slug: "ops-genie",
    description: "Unified operations control center that provides real-time visibility across all logistics operations. Centralizes alerts, KPIs, and operational metrics in one dashboard.",
    category: "Control Tower",
    tags: [],
    status: "Live",
    vercelUrl: "https://ops-genie-demo.vercel.app",
    imageUrl: "/agents/command-center.svg",
    lastUpdated: "Nov 2025",
    primaryActionLabel: "See it in action"
  },
  {
    id: "7",
    name: "Indent Placement",
    slug: "indent-placement",
    description: "Automated indent placement system that intelligently routes freight requests to the best available transporters. Optimizes for cost, reliability, and delivery time.",
    category: "Planning",
    tags: [],
    status: "Beta",
    vercelUrl: "https://indent-placement-demo.vercel.app",
    imageUrl: "/agents/cargovision.svg",
    lastUpdated: "Nov 2025",
    primaryActionLabel: "See it in action"
  },
  {
    id: "8",
    name: "Price Negotiator",
    slug: "price-negotiator",
    description: "AI-powered negotiation assistant that helps secure the best freight rates. Analyzes market data, historical prices, and transporter performance to recommend optimal pricing strategies.",
    category: "Finance",
    tags: [],
    status: "Experimental",
    vercelUrl: "https://price-negotiator-demo.vercel.app",
    imageUrl: "/agents/customs-copilot.svg",
    lastUpdated: "Nov 2025",
    primaryActionLabel: "See it in action"
  },
  {
    id: "9",
    name: "Freight Benchmarking",
    slug: "freight-benchmarking",
    description: "Comprehensive benchmarking platform that compares your freight rates and performance against market standards. Identifies cost-saving opportunities and optimization areas.",
    category: "Intelligence",
    tags: [],
    status: "Live",
    vercelUrl: "https://freight-intelligence-hub.vercel.app/",
    imageUrl: "/agents/rate-intelligence.svg",
    lastUpdated: "Nov 2025",
    primaryActionLabel: "See it in action"
  }
];

export const categories = [
  "Planning",
  "Tracking",
  "Intelligence",
  "Finance",
  "Control Tower",
  "Other"
] as const;

export const statuses = ["Live", "Beta", "Experimental"] as const;
