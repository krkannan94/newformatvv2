import Dexie from 'dexie';

// Define the type for the metrics document
interface Metrics {
    id: string; 
    reportsGenerated: number;
    reportsShared: number;
    updatedAt?: string;
}

// Define the database structure
class ReportDB extends Dexie {
    drafts: Dexie.Table<any, string>; // Use 'any' or your Draft type
    metrics: Dexie.Table<Metrics, string>; // <-- CRITICAL: Metrics table must be declared here

    constructor() {
        super('ReportGeneratorDB');
        
        // Define your schema versions and tables
        this.version(1).stores({
            drafts: '++id, createdAt, updatedAt',
            // *** ADD THIS NEW TABLE ***
            metrics: '&id', 
        });

        this.drafts = this.table("drafts");
        this.metrics = this.table("metrics"); // Assign the table property
    }
}

export const db = new ReportDB();
// NOTE: If you are already exporting a constructed 'db' instance, ensure it includes the metrics table.
