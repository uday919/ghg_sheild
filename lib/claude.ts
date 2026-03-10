// ============================================================
// GHG Shield — Claude AI Integration
// ============================================================
import type { AIReportResponse } from '@/types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

interface ReportContext {
    companyName: string;
    fiscalYear: string;
    industry: string;
    facilityCount: number;
    states: string[];
    scope1Total: number;
    scope1Breakdown: { source: string; tCO2e: number }[];
    scope2Total: number;
    scope2Breakdown: { facility: string; tCO2e: number; method: string }[];
    scope3Total: number;
    dataSources: string[];
}

export async function generateReportWithClaude(context: ReportContext): Promise<AIReportResponse> {
    const prompt = buildReportPrompt(context);

    const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY || '',
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error: ${response.status} — ${error}`);
    }

    const data = await response.json();
    const text = data.content[0]?.text;

    if (!text) {
        throw new Error('No response text from Claude');
    }

    // Parse JSON from Claude's response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Could not parse JSON from Claude response');
    }

    return JSON.parse(jsonMatch[0]) as AIReportResponse;
}

function buildReportPrompt(ctx: ReportContext): string {
    const scope1Lines = ctx.scope1Breakdown
        .map((s) => `  - ${s.source}: ${s.tCO2e.toFixed(2)} tCO2e`)
        .join('\n');

    const scope2Lines = ctx.scope2Breakdown
        .map((s) => `  - ${s.facility} (${s.method}): ${s.tCO2e.toFixed(2)} tCO2e`)
        .join('\n');

    return `You are a professional GHG reporting consultant with ISO 14064 certification. Generate a comprehensive greenhouse gas inventory report narrative for the following organization.

COMPANY DETAILS:
- Company Name: ${ctx.companyName}
- Fiscal Year: ${ctx.fiscalYear}
- Industry: ${ctx.industry}
- Number of Facilities: ${ctx.facilityCount}
- Operating States: ${ctx.states.join(', ')}
- Boundary Methodology: Operational Control

EMISSIONS DATA:
Scope 1 (Direct) — Total: ${ctx.scope1Total.toFixed(2)} tCO2e
${scope1Lines}

Scope 2 (Indirect — Electricity) — Total: ${ctx.scope2Total.toFixed(2)} tCO2e
Location-based method using eGRID 2024 emission factors
${scope2Lines}

Scope 3 (Other Indirect) — Total: ${ctx.scope3Total.toFixed(2)} tCO2e

Data Sources Used: ${ctx.dataSources.join(', ')}

INSTRUCTIONS:
Return a JSON object with these exact keys:
{
  "executiveSummary": "Two paragraphs using professional GHG Protocol language. Summarize the organization's total emissions, breakdown by scope, key findings, and compliance status under California SB 253.",
  "boundaryStatement": "Define the organizational boundary (operational control approach per ISO 14064-1:2018), list included facilities/operations, and note any exclusions with justification.",
  "methodologyText": "Describe the emission factor selection methodology. Reference EPA 40 CFR 98 Tables C-1/C-2 for Scope 1 and eGRID 2024 for Scope 2. Explain calculation approaches for each scope.",
  "dataQualityStatement": "Assess data quality and uncertainty. Categorize data sources by quality tier (high/medium/low). Note any estimation approaches used and their impact on overall uncertainty."
}

Return ONLY the JSON object, no additional text or markdown formatting.`;
}

export async function parseUtilityBill(base64Data: string, mediaType: string) {
    const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY || '',
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: mediaType,
                                data: base64Data,
                            },
                        },
                        {
                            type: 'text',
                            text: `Analyze this utility bill/invoice and extract the emissions activity data.
Return a strict JSON object with EXACTLY the following keys and appropriate types:
{
  "fuelType": "string (e.g., 'Electricity', 'Natural Gas', 'Diesel')",
  "activityData": "number (the total consumption amount, ignoring dollar amounts)",
  "activityUnit": "string (e.g., 'kWh', 'therms', 'gallons')",
  "dataSource": "string (always return 'Utility Bill')",
  "dataQuality": "string (always return 'High')",
  "notes": "string (Brief specific note, e.g., 'Extracted from PG&E bill for billing period MM/DD - MM/DD')"
}
Do not include any other text, just the raw JSON object.`,
                        },
                    ],
                },
            ],
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude Vision API error: ${response.status} — ${error}`);
    }

    const data = await response.json();
    const text = data.content[0]?.text;

    if (!text) {
        throw new Error('No response text from Claude');
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Could not parse JSON from Claude response');
    }

    return JSON.parse(jsonMatch[0]);
}
