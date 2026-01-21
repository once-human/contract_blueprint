import { ContractStatus } from '../models';

export const getAvailableTransitions = (currentStatus: ContractStatus): ContractStatus[] => {
    switch (currentStatus) {
        case ContractStatus.CREATED:
            return [ContractStatus.APPROVED, ContractStatus.REVOKED];
        case ContractStatus.APPROVED:
            return [ContractStatus.SENT, ContractStatus.REVOKED];
        case ContractStatus.SENT:
            return [ContractStatus.SIGNED, ContractStatus.REVOKED];
        case ContractStatus.SIGNED:
            return [ContractStatus.LOCKED];
        case ContractStatus.LOCKED:
            return []; // Final state
        case ContractStatus.REVOKED:
            return [ContractStatus.CREATED]; // Allow restarting? Or final? Assuming restart for now or specific workflow.
        default:
            return [];
    }
};

export const getStatusColor = (status: ContractStatus): string => {
    switch (status) {
        case ContractStatus.CREATED: return '#3498db'; // Blue
        case ContractStatus.APPROVED: return '#2ecc71'; // Green
        case ContractStatus.SENT: return '#f1c40f'; // Yellow
        case ContractStatus.SIGNED: return '#9b59b6'; // Purple
        case ContractStatus.LOCKED: return '#95a5a6'; // Gray
        case ContractStatus.REVOKED: return '#e74c3c'; // Red
        default: return '#ecf0f1';
    }
};
