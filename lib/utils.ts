// ============================================================
// GHG Shield — Utilities
// ============================================================

export function toCamelCase(str: string): string {
    return str.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
}

export function keysToCamelCase<T>(obj: any): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => keysToCamelCase(item)) as any;
    }

    const camelObj: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const camelKey = toCamelCase(key);
            camelObj[camelKey] = keysToCamelCase(obj[key]);
        }
    }

    // Ensure common ID aliases for frontend component compatibility
    if (camelObj.id) {
        if (!camelObj.clientId && obj.hasOwnProperty('company_name')) camelObj.clientId = camelObj.id;
        if (!camelObj.facilityId && obj.hasOwnProperty('egrid_subregion')) camelObj.facilityId = camelObj.id;
        if (!camelObj.dataId && obj.hasOwnProperty('activity_data')) camelObj.dataId = camelObj.id;
        if (!camelObj.reportId && obj.hasOwnProperty('report_name')) camelObj.reportId = camelObj.id;
        if (!camelObj.docId && obj.hasOwnProperty('doc_type')) camelObj.docId = camelObj.id;
        if (!camelObj.actionId && obj.hasOwnProperty('due_date')) camelObj.actionId = camelObj.id;
        if (!camelObj.logId && obj.hasOwnProperty('timestamp')) camelObj.logId = camelObj.id;
    }

    return camelObj;
}
