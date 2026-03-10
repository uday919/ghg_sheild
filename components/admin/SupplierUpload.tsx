'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Trash2, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';
import { EmissionData } from '@/types';
import { Button } from '../ui';

interface SupplierUploadProps {
    clientId: string;
    onImport: (records: Partial<EmissionData>[]) => Promise<void>;
}

interface ParsedRow {
    supplierName: string;
    category: string;
    spendAmount: number;
    tCO2e: number;
    calculationMethod: string;
    status: 'ready' | 'error';
    errorMsg?: string;
}

export function SupplierUpload({ clientId, onImport }: SupplierUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (file: File) => {
        if (!file.name.endsWith('.csv')) {
            alert('Please upload a CSV file.');
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rows: ParsedRow[] = [];

                results.data.forEach((row: any, index) => {
                    const supplierName = row['Supplier Name']?.trim();
                    const category = row['Category']?.trim() || 'Purchased Goods and Services';
                    const spendRaw = row['Spend ($)']?.trim().replace(/[^0-9.]/g, '');
                    const emissionsRaw = row['Emissions (tCO2e)']?.trim().replace(/[^0-9.]/g, '');

                    let spendAmount = parseFloat(spendRaw);
                    if (isNaN(spendAmount)) spendAmount = 0;

                    let tCO2e = parseFloat(emissionsRaw);
                    let calculationMethod = 'Supplier Reported';

                    if (isNaN(tCO2e) || tCO2e <= 0) {
                        if (spendAmount > 0) {
                            // Spend-based estimation (Average: 0.35 kgCO2e per $1 spend)
                            tCO2e = (spendAmount * 0.35) / 1000;
                            calculationMethod = 'Spend-based Method (0.35 kg/$1)';
                        } else {
                            rows.push({
                                supplierName: supplierName || `Row ${index + 1}`,
                                category,
                                spendAmount: 0,
                                tCO2e: 0,
                                calculationMethod: 'Error',
                                status: 'error',
                                errorMsg: 'Missing Spend and Emissions'
                            });
                            return;
                        }
                    }

                    if (!supplierName) {
                        rows.push({
                            supplierName: 'Unknown',
                            category,
                            spendAmount,
                            tCO2e,
                            calculationMethod: 'Error',
                            status: 'error',
                            errorMsg: 'Missing Supplier Name'
                        });
                        return;
                    }

                    rows.push({
                        supplierName,
                        category,
                        spendAmount,
                        tCO2e,
                        calculationMethod,
                        status: 'ready'
                    });
                });

                setParsedRows(rows);
            },
            error: (error) => {
                console.error('CSV Parsing Error:', error);
                alert('Failed to parse CSV file. Please check the format.');
            }
        });
    };

    const handleImport = async () => {
        const validRows = parsedRows.filter(r => r.status === 'ready');
        if (validRows.length === 0) return;

        setIsImporting(true);
        try {
            const recordsToImport: Partial<EmissionData>[] = validRows.map(row => ({
                clientId,
                reportingYear: 2025, // Assuming current reporting year
                scope: '3',
                category: row.category as any,
                supplierName: row.supplierName,
                spendAmount: row.spendAmount,
                tCO2e: row.tCO2e,
                calculationMethod: row.calculationMethod,
                verified: false,
                dataSource: 'Supplier Bulk Upload',
                dataQuality: row.calculationMethod.includes('Spend') ? 'Low' : 'High',
                calculatedAt: new Date().toISOString()
            }));

            await onImport(recordsToImport);
            setParsedRows([]);
        } catch (error) {
            console.error('Import failed:', error);
            alert('Failed to import records.');
        } finally {
            setIsImporting(false);
        }
    };

    const clearData = () => {
        setParsedRows([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="bg-[#0a0f0a] border border-[#1a5c3844] rounded-xl p-6">
            <h3 className="text-xl font-bold text-white font-[family-name:var(--font-syne)] mb-2">
                Supplier Scope 3 Bulk Upload
            </h3>
            <p className="text-sm text-gray-400 mb-6">
                Upload your supplier spend data via CSV to instantly estimate Scope 3 Category 1 emissions.
                Required columns: <code className="text-[#4CAF80] bg-[#4CAF80]/10 px-1 rounded">Supplier Name</code>, <code className="text-[#4CAF80] bg-[#4CAF80]/10 px-1 rounded">Spend ($)</code>.
                Optional: <code className="text-gray-300 bg-gray-800 px-1 rounded">Category</code>, <code className="text-gray-300 bg-gray-800 px-1 rounded">Emissions (tCO2e)</code>.
            </p>

            {parsedRows.length === 0 ? (
                <div
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${isDragging ? 'border-[#4CAF80] bg-[#4CAF80]/5' : 'border-[#1a5c3844] hover:border-gray-500'
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) handleFileUpload(file);
                    }}
                >
                    <FileSpreadsheet className="w-10 h-10 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-300 font-medium mb-2">Drag & drop your CSV file here</p>
                    <p className="text-gray-500 text-xs mb-4">Maximum file size: 5MB</p>
                    <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                        }}
                    />
                    <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                        Browse Files
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-[#111] border border-[#222] rounded-lg overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 bg-[#1a1a1a] uppercase">
                                <tr>
                                    <th className="px-4 py-3">Supplier Name</th>
                                    <th className="px-4 py-3">Spend ($)</th>
                                    <th className="px-4 py-3">Emissions (tCO₂e)</th>
                                    <th className="px-4 py-3">Calc Method</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#222]">
                                {parsedRows.map((row, i) => (
                                    <tr key={i} className="hover:bg-[#1a1a1a]/50">
                                        <td className="px-4 py-3 font-medium text-white">{row.supplierName}</td>
                                        <td className="px-4 py-3 text-gray-300">${row.spendAmount.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-[#4CAF80] font-mono">{row.tCO2e.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-xs text-gray-400">{row.calculationMethod}</td>
                                        <td className="px-4 py-3">
                                            {row.status === 'ready' ? (
                                                <span className="flex items-center gap-1 text-xs text-[#4CAF80]">
                                                    <CheckCircle className="w-3 h-3" /> Ready
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs text-red-400" title={row.errorMsg}>
                                                    <AlertCircle className="w-3 h-3" /> Error
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-gray-400">
                            Found <strong className="text-white">{parsedRows.filter(r => r.status === 'ready').length}</strong> valid records to import.
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={clearData} disabled={isImporting}>
                                <Trash2 className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                            <Button variant="primary" onClick={handleImport} disabled={isImporting || parsedRows.filter(r => r.status === 'ready').length === 0}>
                                {isImporting ? 'Importing...' : 'Confirm & Import'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
