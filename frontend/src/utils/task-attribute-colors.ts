import { NONE_BADGE_COLOR, PRIORITY_COLOR_MAP, STATUS_COLOR_MAP } from '@/constants/task-attribute-colors';

export function getStatusBadgeColor(statusId: number | null | undefined): string {
    return statusId != null ? STATUS_COLOR_MAP[statusId] : NONE_BADGE_COLOR;
}

export function getPriorityBadgeColor(priorityId: number | null | undefined): string {
    return priorityId != null ? PRIORITY_COLOR_MAP[priorityId] : NONE_BADGE_COLOR;
}
