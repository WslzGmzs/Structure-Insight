export interface RecentProject {
    id: string;
    name: string;
    openedAt: number;
}

export interface ConfirmationState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
}

