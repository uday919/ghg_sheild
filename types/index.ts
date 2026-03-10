// ============================================================
// GHG Shield — TypeScript Types
// ============================================================

// --------------- Supabase Base ---------------
export interface SupabaseRecord {
    id: string;
    created_at: string;
    updated_at?: string;
}

// --------------- Clients ---------------
export type ComplianceStatus = 'on_track' | 'at_risk' | 'submitted' | 'overdue';

export interface Client extends SupabaseRecord {
    clientId: string;
    companyName: string;
    contactName: string;
    contactEmail: string;
    industry: string;
    annualRevenue?: string;
    facilityCount?: number;
    fiscalYearStart?: string;
    fiscalYearEnd?: string;
    contractStart?: string;
    setupFee?: number;
    monthlyFee?: number;
    dodCustomerId?: string;
    dodSubscriptionId?: string;
    complianceStatus: ComplianceStatus;
    isActive: boolean;
    notes?: string;
}

export interface ClientFormValues {
    companyName: string;
    contactName: string;
    contactEmail: string;
    industry: string;
    annualRevenue?: string;
    facilityCount?: number;
    fiscalYearStart?: string;
    fiscalYearEnd?: string;
    setupFee?: number;
    monthlyFee?: number;
    notes?: string;
}

// --------------- Facilities ---------------
export type FacilityType = 'Office' | 'Plant' | 'Warehouse' | 'Retail' | 'Data Center' | 'Distribution' | 'Other';

export type EGridSubregion =
    | 'CAMX' | 'ERCT' | 'NWPP' | 'RMPA' | 'SERC'
    | 'RFCW' | 'NYUP' | 'ISNE' | 'MROW' | 'SRSO';

export interface Facility extends SupabaseRecord {
    facilityId: string;
    clientId: string;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    egridSubregion: EGridSubregion;
    inBoundary: boolean;
    facilityType: FacilityType;
}

export interface FacilityFormValues {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    egridSubregion?: EGridSubregion;
    inBoundary: boolean;
    facilityType?: FacilityType;
}

// --------------- Emission Data ---------------
export type Scope = '1' | '2' | '3';
export type DataQuality = 'High' | 'Medium' | 'Low';

export type EmissionCategory =
    | 'Stationary Combustion'
    | 'Mobile Combustion'
    | 'Fugitive'
    | 'Purchased Electricity';

export type FuelType =
    | 'Natural Gas' | 'Diesel' | 'Gasoline' | 'Electricity' | 'Propane' | 'R-410A';

export interface EmissionData extends SupabaseRecord {
    dataId: string;
    clientId: string;
    facilityId: string;
    reportingYear: number;
    month?: number;
    scope: Scope;
    category?: EmissionCategory;
    fuelType?: string;
    activityData?: number;
    activityUnit?: string;
    emissionFactor?: number;
    emissionFactorOverride?: number;
    efSource?: string;
    efUnit?: string;
    kgCO2e?: number;
    tCO2e?: number;
    dataSource?: string;
    dataQuality?: DataQuality;
    verified: boolean;
    calculationMethod?: string;
    factorYear?: number;
    factorVersion?: string;
    calculatedAt?: string;
    notes?: string;
    supplierName?: string;
    spendAmount?: number;
    deletedAt?: string;
}

export interface EmissionDataFormValues {
    facilityId: string;
    reportingYear: number;
    month?: number;
    scope: Scope;
    category?: EmissionCategory;
    fuelType: string;
    activityData: number;
    activityUnit: string;
    emissionFactorOverride?: number;
    dataSource?: string;
    dataQuality?: DataQuality;
    notes?: string;
    supplierName?: string;
    spendAmount?: number;
}

// --------------- Reports ---------------
export type ReportStatus = 'draft' | 'in_review' | 'approved' | 'final' | 'submitted';
export type VerificationStatus = 'not_started' | 'in_progress' | 'complete';

export interface Report extends SupabaseRecord {
    reportId: string;
    clientId: string;
    reportingYear?: number;
    reportName?: string;
    status: ReportStatus;
    totalScope1?: number;
    totalScope2Location?: number;
    totalScope2Market?: number;
    totalScope3?: number;
    aiExecutiveSummary?: string;
    aiMethodologyText?: string;
    aiBoundaryStatement?: string;
    aiDataQualityStatement?: string;
    finalPdfUrl?: string;
    verificationStatus: VerificationStatus;
    submissionDate?: string;
    createdAt: string;
}

// --------------- Documents ---------------
export type DocType = 'Report' | 'Invoice' | 'Verification' | 'Methodology' | 'Data Summary' | 'Data' | 'Other';

export interface GHGDocument extends SupabaseRecord {
    docId: string;
    clientId: string;
    name: string;
    docType?: DocType;
    fileUrl?: string;
    fileId?: string;
    uploadDate?: string;
    visibleToClient: boolean;
    uploadedBy?: string;
}

// --------------- Action Items ---------------
export type ActionStatus = 'open' | 'complete' | 'overdue';
export type Priority = 'high' | 'medium' | 'low';

export interface ActionItem extends SupabaseRecord {
    actionId: string;
    clientId: string;
    text: string;
    dueDate?: string;
    status: ActionStatus;
    priority: Priority;
    visibleToClient: boolean;
    createdAt: string;
}

export interface ActionItemFormValues {
    text: string;
    dueDate?: string;
    priority: Priority;
    visibleToClient: boolean;
}

// --------------- Emission Factors (Lookup) ---------------
export interface EmissionFactor extends SupabaseRecord {
    fuelType: string;
    unit: string;
    kgCO2ePerUnit: number;
    source: string;
    year: number;
    scope: Scope;
    egridSubregion?: string;
}

// --------------- AI Report Response ---------------
export interface AIReportResponse {
    executiveSummary: string;
    boundaryStatement: string;
    methodologyText: string;
    dataQualityStatement: string;
}

// --------------- Auth ---------------
export type UserRole = 'admin' | 'client';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    clientId?: string;
}

// --------------- Dashboard ---------------
export interface EmissionsSummary {
    totalScope1: number;
    totalScope2: number;
    totalScope3: number;
    totalEmissions: number;
    byCategory: { category: string; tCO2e: number }[];
    byFacility: { facility: string; tCO2e: number }[];
    yearOverYear: { year: number; tCO2e: number }[];
}

// --------------- Calculation Results ---------------
export interface CalculationResult {
    kgCO2e: number;
    tCO2e: number;
    emissionFactor: number;
    efSource: string;
    efUnit: string;
    calculationMethod: string;
    factorYear: number;
    factorVersion: string;
    calculatedAt: string;
}

// --------------- Payment ---------------
export interface PaymentWebhookPayload {
    event: string;
    data: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        metadata: Record<string, string>;
        customer?: {
            email: string;
            name: string;
        };
    };
}

// --------------- Activity Log ---------------
export type ActivityAction =
    | 'data_entry_saved'
    | 'data_entry_updated'
    | 'data_entry_deleted'
    | 'document_uploaded'
    | 'document_visibility_changed'
    | 'document_deleted'
    | 'report_status_changed'
    | 'action_item_created'
    | 'action_item_updated'
    | 'action_item_deleted'
    | 'facility_created'
    | 'client_onboarded';

export interface ActivityLog extends SupabaseRecord {
    logId: string;
    clientId: string;
    action: ActivityAction;
    details: string;
    timestamp: string;
}
