import {
    Box, Database, Cloud, BookOpen, FileText, Layers,
    Globe, Shield, Activity, Users, Server, Mail, Folder,
    Smartphone, GitMerge, Lock, Zap, FileCode
} from "lucide-react";

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
        version: "1.2.0",
        details: {
            architecture: {
                source: { name: "Salesforce", type: "Source System", icon: Globe, color: "blue" },
                process: { name: "MuleSoft Core", type: "Transform & Route", icon: Box, color: "purple" },
                target: { name: "SAP HANA", type: "Target DB", icon: Database, color: "green" }
            },
            simulation: {
                logs: [
                    { level: "INFO", text: "Polling Salesforce Object 'Account'...", color: "blue" },
                    { level: "INFO", text: "Retrieved 10 records. Watermark updated.", color: "blue" },
                    { level: "PROCESS", text: "Payload transformation executing...", color: "purple" },
                    { level: "SUCCESS", text: "Batch step 1 completed (10/10)", color: "green" },
                    { level: "INFO", text: "Upserting to SAP S/4HANA...", color: "blue" },
                    { level: "SUCCESS", text: "Flow completed in 124ms.", color: "green" }
                ],
                metrics: [
                    { label: "Latency", value: "124", unit: "ms", color: "white" },
                    { label: "Success Rate", value: "100", unit: "%", color: "green" }
                ]
            },
            logicBreakdown: {
                text: "This template orchestrates a reliable Oneway Sync pattern. It uses an Idempotent Receiver to ensure no duplicates are processed, even if the source system fires multiple events.",
                cards: [
                    { title: "Watermarking", icon: Database, text: "Automatically tracks the `LastModifiedDate` to fetch only new/updated records.", color: "blue" },
                    { title: "Error Handling", icon: Shield, text: "Failed records are routed to a DLQ (Dead Letter Queue) for manual retry.", color: "green" }
                ]
            },
            connectors: [
                { name: "Salesforce", version: "10.13", icon: Cloud, color: "blue" },
                { name: "SAP S/4HANA", version: "5.5.0", icon: Database, color: "indigo" },
                { name: "Secure Props", version: "1.2.5", icon: Shield, color: "green" }
            ],
            dataWeave: {
                fileName: "transform_payload.dwl",
                code: `%dw 2.0
output application/json
---
payload map (item, index) -> {
    id: item.SAP_ID,
    fullName: (item.FirstName ++ " " ++ item.LastName),
    email: item.EmailAddress,
    status: if (item.Active == "X") "Active" else "Inactive",
    address: {
        street: item.Street,
        city: item.City,
        zip: item.PostalCode,
        country: item.CountryCode
    },
    meta: {
        source: "SAP_S4HANA",
        timestamp: now(),
        correlationId: correlationId
    }
}`
            },
            dependencies: [
                { name: "Mule HTTP Connector", group: "org.mule.connectors", version: "1.7.3", scope: "Compile" },
                { name: "Mule Sockets Connector", group: "org.mule.connectors", version: "1.2.2", scope: "Compile" },
                { name: "Mule Secure Configuration Property", group: "com.mulesoft.modules", version: "1.2.5", scope: "Compile" },
                { name: "Mule Validation Module", group: "org.mule.modules", version: "2.0.1", scope: "Test" }
            ],
            changelog: [
                { version: "1.2.0", date: "Oct 24, 2024", changes: ["Added Watermarking logic for incremental sync", "Updated Salesforce Connector to v10.15"] },
                { version: "1.1.0", date: "Sep 12, 2024", changes: ["Fixed bug in Batch Aggregator size", "Added centralized error logging"] },
                { version: "1.0.0", date: "Aug 01, 2024", changes: ["Initial Release", "Basic sync functionality"] }
            ]
        }
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
        version: "2.0.1",
        details: {
            architecture: {
                source: { name: "NetSuite", type: "ERP System", icon: Cloud, color: "blue" },
                process: { name: "Order API", type: "Process API", icon: Server, color: "purple" },
                target: { name: "PostgreSQL", type: "Inventory DB", icon: Database, color: "green" }
            },
            simulation: {
                logs: [
                    { level: "INFO", text: "New Order Event received from NetSuite...", color: "blue" },
                    { level: "PROCESS", text: "Validating inventory levels...", color: "purple" },
                    { level: "INFO", text: "Inventory Check: OK", color: "green" },
                    { level: "PROCESS", text: "Transforming to GL Format...", color: "purple" },
                    { level: "INFO", text: "Updating Ledger DB...", color: "blue" },
                    { level: "SUCCESS", text: "Order #45992 processed successfully.", color: "green" }
                ],
                metrics: [
                    { label: "Processing Time", value: "450", unit: "ms", color: "white" },
                    { label: "Orders/Min", value: "25", unit: "", color: "blue" }
                ]
            },
            logicBreakdown: {
                text: "This pattern handles complex SOAP transformations and ensures data consistency across financial systems.",
                cards: [
                    { title: "SOAP Transformation", icon: FileCode, text: "Pre-built XML to JSON mappings for complex NetSuite objects.", color: "blue" },
                    { title: "Transactional", icon: Lock, text: "Uses XA Transactions to ensure database and ERP stay in perfect sync.", color: "green" }
                ]
            },
            connectors: [
                { name: "NetSuite Connector", version: "11.2.0", icon: Cloud, color: "blue" },
                { name: "Database", version: "1.8.0", icon: Database, color: "indigo" },
                { name: "Email SMTP", version: "1.1.0", icon: Mail, color: "green" }
            ],
            dataWeave: {
                fileName: "map_order_to_ledger.dwl",
                code: `%dw 2.0
output application/json
ns ns0 urn:messages_2020_2.platform.webservices.netsuite.com
---
{
  orderId: payload.ns0#internalId,
  customer: {
    id: payload.ns0#entity.@internalId,
    name: payload.ns0#entity.name
  },
  items: payload.ns0#itemList.item map {
    sku: $.item.@internalId,
    qty: $.quantity,
    amount: $.amount
  },
  total: payload.ns0#total,
  currency: payload.ns0#currency.name
}`
            },
            dependencies: [
                { name: "Mule NetSuite Connector", group: "com.mulesoft.connectors", version: "11.2.0", scope: "Compile" },
                { name: "Mule Database Connector", group: "org.mule.connectors", version: "1.8.0", scope: "Compile" }
            ],
            changelog: [
                { version: "2.0.1", date: "Jan 15, 2025", changes: ["Updated NetSuite WSDL version", "Fixed localized currency parsing bug"] },
                { version: "2.0.0", date: "Dec 10, 2024", changes: ["Major refactor for Mule 4.4+", "Added Email notification step"] }
            ]
        }
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
        version: "1.0.0",
        details: {
            architecture: {
                source: { name: "Workday HCM", type: "Source System", icon: Users, color: "blue" },
                process: { name: "System API", type: "Mule Application", icon: Server, color: "purple" },
                target: { name: "Redis Cache", type: "Cache Store", icon: Layers, color: "red" }
            },
            simulation: {
                logs: [
                    { level: "INFO", text: "GET /employees/org-chart request received", color: "blue" },
                    { level: "PROCESS", text: "Checking ObjectStore cache key...", color: "purple" },
                    { level: "INFO", text: "Cache Miss. Calling Workday Web Services...", color: "yellow" },
                    { level: "INFO", text: "Retrieved 500 employee records.", color: "blue" },
                    { level: "PROCESS", text: "Writing to Cache (TTL: 1 hour)", color: "purple" },
                    { level: "SUCCESS", text: "Response sent in 850ms.", color: "green" }
                ],
                metrics: [
                    { label: "Cache Hit Rate", value: "85", unit: "%", color: "green" },
                    { label: "Avg Response", value: "120", unit: "ms", color: "white" }
                ]
            },
            logicBreakdown: {
                text: "Optimized for high-read scenarios, this API shields the Workday tenant from excessive traffic using aggressive caching.",
                cards: [
                    { title: "Object Store Caching", icon: Layers, text: "Implements Cache-Aside pattern to minimize calls to the Workday SOAP API.", color: "blue" },
                    { title: "Rate Limiting", icon: Activity, text: "Includes API Manager policies pre-configured for tier-based access.", color: "purple" }
                ]
            },
            connectors: [
                { name: "Workday Connector", version: "12.0.0", icon: Users, color: "blue" },
                { name: "Object Store", version: "1.2.0", icon: Database, color: "yellow" },
                { name: "HTTP", version: "1.7.0", icon: Globe, color: "green" }
            ],
            dataWeave: {
                fileName: "format_org_hierarchy.dwl",
                code: `%dw 2.0
output application/json
---
{
    manager: {
        id: payload.Worker_Data.Employment_Data.Worker_Job_Data.Manager_Level_ID,
        name: payload.Worker_Data.Personal_Data.Name_Data.Formatted_Name
    },
    direct_reports: payload.Worker_Data.Employment_Data.Worker_Job_Data.Supervisory_Organization_Data map {
        employee_id: $.Reference_ID,
        title: $.Job_Profile_Name,
        location: $.Location_Data.Location_Name
    }
}`
            },
            dependencies: [
                { name: "Mule Workday Connector", group: "com.mulesoft.connectors", version: "12.0.0", scope: "Compile" },
                { name: "Mule ObjectStore Connector", group: "org.mule.connectors", version: "1.2.0", scope: "Compile" }
            ],
            changelog: [
                { version: "1.0.0", date: "Feb 10, 2026", changes: ["Initial Release"] }
            ]
        }
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
        version: "3.5.0",
        details: {
            architecture: {
                source: { name: "Any Mule App", type: "Calling Flow", icon: Box, color: "blue" },
                process: { name: "On Error Propagate", type: "Error Scope", icon: Shield, color: "red" },
                target: { name: "Splunk / ELK", type: "Log Aggregator", icon: Activity, color: "green" }
            },
            simulation: {
                logs: [
                    { level: "ERROR", text: "HTTP:CONNECTIVITY Error caught.", color: "red" },
                    { level: "PROCESS", text: "Generating Correlation ID...", color: "purple" },
                    { level: "INFO", text: "Building Standard Error Response JSON...", color: "blue" },
                    { level: "INFO", text: "Async Log sent to Splunk HEC", color: "yellow" },
                    { level: "ERROR", text: "Returning 503 Service Unavailable to client.", color: "red" }
                ],
                metrics: [
                    { label: "Error Capture", value: "100", unit: "%", color: "green" },
                    { label: "Log Time", value: "12", unit: "ms", color: "white" }
                ]
            },
            logicBreakdown: {
                text: "A plug-and-play error handling module that ensures consistent HTTP status codes and log formats across your enterprise.",
                cards: [
                    { title: "Standardized Responses", icon: FileText, text: "Automatically maps Java exceptions to appropriate HTTP 4xx/5xx status codes.", color: "blue" },
                    { title: "Async Logging", icon: Zap, text: "Uses asynchronous scopes to ship logs to external aggregators without blocking the thread.", color: "yellow" }
                ]
            },
            connectors: [
                { name: "HTTP Connector", version: "1.7.3", icon: Globe, color: "blue" },
                { name: "Splunk HEC", version: "2.0.0", icon: Activity, color: "green" }
            ],
            dataWeave: {
                fileName: "create_error_response.dwl",
                code: `%dw 2.0
output application/json
---
{
    error: {
        code: error.errorType.identifier default "UNKNOWN",
        message: error.description,
        correlationId: correlationId,
        timestamp: now(),
        severity: if (attributes.statusCode == 500) "CRITICAL" else "MAJOR"
    }
}`
            },
            dependencies: [
                { name: "Mule Scripting Module", group: "org.mule.modules", version: "2.0.0", scope: "Compile" }
            ],
            changelog: [
                { version: "3.5.0", date: "Jan 05, 2026", changes: ["Added support for Mule 4.6 Error Types"] },
                { version: "3.4.0", date: "Nov 12, 2025", changes: ["Optimized Splunk payload size"] }
            ]
        }
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
        version: "1.1.2",
        details: {
            architecture: {
                source: { name: "SFTP Server", type: "File Source", icon: Folder, color: "blue" },
                process: { name: "Validation", type: "Mule Flow", icon: Shield, color: "purple" },
                target: { name: "Anypoint MQ", type: "DLQ / Target", icon: Mail, color: "red" }
            },
            simulation: {
                logs: [
                    { level: "INFO", text: "Polling SFTP directory /inbound...", color: "blue" },
                    { level: "INFO", text: "File found: 'sales_data_2026.csv'", color: "blue" },
                    { level: "PROCESS", text: "Streaming file contents...", color: "purple" },
                    { level: "ERROR", text: "Validation Failed: Row 45 missing required fields.", color: "red" },
                    { level: "INFO", text: "Publishing message to 'DLQ-Sales-Data'", color: "yellow" },
                    { level: "SUCCESS", text: "Process completed. File moved to /archive.", color: "green" }
                ],
                metrics: [
                    { label: "Throughput", value: "50", unit: "MB/s", color: "blue" },
                    { label: "Reliability", value: "100", unit: "%", color: "green" }
                ]
            },
            logicBreakdown: {
                text: "Implements the 'Reliability Pattern' to ensuring no messages are lost during system failures or data validation errors.",
                cards: [
                    { title: "Until Successful", icon: Activity, text: "Automatically retries transient network failures when connecting to SFTP.", color: "blue" },
                    { title: "Circuit Breaker", icon: Zap, text: "Pauses polling if the backend system is unresponsive to prevent message pile-up.", color: "red" }
                ]
            },
            connectors: [
                { name: "SFTP", version: "1.4.1", icon: Folder, color: "blue" },
                { name: "Anypoint MQ", version: "3.1.0", icon: Mail, color: "indigo" }
            ],
            dataWeave: {
                fileName: "csv_to_json.dwl",
                code: `%dw 2.0
output application/json
input payload application/csv header=true
---
payload map (row) -> {
    record_id: row.ID,
    amount: row.Amount as Number default 0,
    valid: if (isEmpty(row.ID)) false else true
}`
            },
            dependencies: [
                { name: "Anypoint MQ Connector", group: "com.mulesoft.connectors", version: "3.1.0", scope: "Compile" }
            ],
            changelog: [
                { version: "1.1.2", date: "Feb 01, 2026", changes: ["Added logic to handle 0-byte files"] }
            ]
        }
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
        version: "1.3.0",
        details: {
            architecture: {
                source: { name: "Client App", type: "REST Client", icon: Smartphone, color: "blue" },
                process: { name: "Scatter-Gather", type: "Parallel Router", icon: GitMerge, color: "purple" },
                target: { name: "Multi-System", type: "CRM, ERP, ITSM", icon: Server, color: "green" }
            },
            simulation: {
                logs: [
                    { level: "INFO", text: "Received Request for CustomerID: C-9912", color: "blue" },
                    { level: "PROCESS", text: "Dispatching parallel requests...", color: "purple" },
                    { level: "INFO", text: "Route 1: CRM API called", color: "blue" },
                    { level: "INFO", text: "Route 2: ERP API called", color: "blue" },
                    { level: "INFO", text: "Route 3: ServiceNow API called", color: "blue" },
                    { level: "PROCESS", text: "Aggregating results...", color: "purple" },
                    { level: "SUCCESS", text: "Response 200 OK returned in 320ms.", color: "green" }
                ],
                metrics: [
                    { label: "Latency Redux", value: "65", unit: "%", color: "green" },
                    { label: "Parallel Threads", value: "3", unit: "", color: "white" }
                ]
            },
            logicBreakdown: {
                text: "The Scatter-Gather router executes routes concurrently, waiting for all routes to complete before proceeding. This drastically reduces total response time compared to sequential processing.",
                cards: [
                    { title: "Parallel Execution", icon: GitMerge, text: "Calls to CRM, ERP, and ITSM happen at the same time.", color: "blue" },
                    { title: "Timeout Handling", icon: Activity, text: "Configured with a 5000ms timeout to prevent one slow system from blocking the response.", color: "red" }
                ]
            },
            connectors: [
                { name: "HTTP", version: "1.7.3", icon: Globe, color: "blue" },
                { name: "Validation", version: "2.0.0", icon: Shield, color: "green" }
            ],
            dataWeave: {
                fileName: "aggregate_response.dwl",
                code: `%dw 2.0
output application/json
---
{
    customer: payload["0"].payload,
    orders: payload["1"].payload,
    tickets: payload["2"].payload,
    meta: {
        aggregatedAt: now(),
        sourceSystems: ["Salesforce", "SAP", "ServiceNow"]
    }
}`
            },
            dependencies: [],
            changelog: [
                { version: "1.3.0", date: "Jan 20, 2026", changes: ["Added ServiceNow route"] }
            ]
        }
    }
];
