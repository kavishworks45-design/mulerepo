import { Box, Database, Cloud, BookOpen, FileText, Layers } from "lucide-react";

export const POCS = [
    {
        id: 1,
        title: "SAP to Salesforce Sync",
        description: "Bi-directional customer synchronization pattern using Watermarking and Batch processing.",
        fullDescription: "This pattern implements a robust bi-directional synchronization mechanism between SAP S/4HANA and Salesforce. It utilizes watermarking to ensure only new or modified records are processed, and batch processing for handling large volumes of data (up to 1 million records) efficiently. The solution handles conflict resolution, error logging, and retry mechanisms automatically.",
        tags: ["SAP", "Salesforce", "Batch", "Watermark", "Anypoint Platform", "CloudHub 2.0"],
        stars: 124,
        forks: 45,
        author: "MuleSoft Engineering",
        updated: "2 days ago",
        icon: Box,
        difficulty: "Intermediate",
        version: "1.2.0"
    },
    {
        id: 2,
        title: "Netsuite Order to Cash",
        description: "Complete Order to Cash flow implementation connecting Netsuite, Database and Email notification system.",
        fullDescription: "Streamline your Order-to-Cash process with this comprehensive integration template. It captures orders from NetSuite, validates inventory in a local database, processes the payment, and triggers email notifications via SMTP. Includes pre-built DataWeave transformations for NetSuite's complex SOAP objects.",
        tags: ["Netsuite", "Database", "SMTP", "Exchange", "API Manager"],
        stars: 89,
        forks: 23,
        author: "Integration Pro",
        updated: "1 week ago",
        icon: Database,
        difficulty: "Advanced",
        version: "2.0.1"
    },
    {
        id: 3,
        title: "Workday Org Chart API",
        description: "System API to expose Workday organization hierarchy with caching implementation.",
        fullDescription: "A high-performance System API that sits on top of Workday. It exposes a simplified RESTful interface for retrieving organization charts and employee hierarchy. features an implementation of Object Store v2 for caching responses to reduce load on the Workday tenant and improve response times.",
        tags: ["Workday", "Redis", "System API", "API Manager", "Monitoring"],
        stars: 56,
        forks: 12,
        author: "Cloud Team",
        updated: "3 days ago",
        icon: Cloud,
        difficulty: "Beginner",
        version: "1.0.0"
    },
    {
        id: 4,
        title: "Generic Error Handler",
        description: "Reusable error handling framework compliant with MuleSoft C4E standards.",
        fullDescription: "Standardize your error handling across the entire application network. This library provides a common error handling strategy that propagates errors correctly, formats error responses in a standard JSON structure, and logs incidents to Splunk/ELK. Fully compliant with MuleSoft Catalyst standards.",
        tags: ["Error Handling", "Common", "Framework", "Anypoint Platform", "Mule runtime"],
        stars: 210,
        forks: 89,
        author: "Architects Guild",
        updated: "1 month ago",
        icon: BookOpen,
        difficulty: "Intermediate",
        version: "3.5.0"
    },
    {
        id: 5,
        title: "File Processing with DLQ",
        description: "Reliable file processing using FTP connector and Dead Letter Queue pattern for failures.",
        fullDescription: "Ensure zero data loss with this reliable file processing pattern. Files are polled from an SFTP server, processed, and moved to an archive folder. Any failed records are sent to a Dead Letter Queue (Anypoint MQ) for manual inspection and reprocessing.",
        tags: ["FTP", "JMS", "Reliability", "Anypoint MQ"],
        stars: 76,
        forks: 34,
        author: "DevOps Team",
        updated: "5 days ago",
        icon: FileText,
        difficulty: "Advanced",
        version: "1.1.2"
    },
    {
        id: 6,
        title: "Async Data Aggregation",
        description: "Scatter-Gather implementation to aggregate data from 3 different system APIs.",
        fullDescription: "Reduce latency by calling multiple downstream systems in parallel. This pattern uses the Scatter-Gather router to fetch customer data from CRM, Orders from ERP, and Support tickets from ServiceNow simultaneously, aggregating the result into a single 'Customer 360' view.",
        tags: ["Scatter-Gather", "Aggregation", "Async", "Runtime Fabric", "MuleSoft Composer"],
        stars: 92,
        forks: 28,
        author: "Integration Ninja",
        updated: "2 weeks ago",
        icon: Layers,
        difficulty: "Intermediate",
        version: "1.3.0"
    }
];
