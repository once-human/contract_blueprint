export type FieldType = 'text' | 'date' | 'signature' | 'checkbox' | 'select' | 'textBlock';

export interface Field {
    id: string;
    type: FieldType;
    label: string;
    content?: string; // For textBlock types (static text)
    required?: boolean;
    options?: string[]; // For select types
    position: { x: number; y: number };
    width?: number | string;
    hideLabel?: boolean;
}

export interface Blueprint {
    id: string;
    name: string;
    fields: Field[];
}

export interface ContractField extends Field {
    value: string | boolean | null;
}

export const ContractStatus = {
    CREATED: 'CREATED',
    APPROVED: 'APPROVED',
    SENT: 'SENT',
    SIGNED: 'SIGNED',
    LOCKED: 'LOCKED',
    REVOKED: 'REVOKED',
} as const;

export type ContractStatus = (typeof ContractStatus)[keyof typeof ContractStatus];

export interface Contract {
    id: string;
    name: string;
    blueprintId: string;
    fields: ContractField[];
    status: ContractStatus;
    createdAt: string;
}
