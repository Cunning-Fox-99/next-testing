export interface  Team {
    name: string;
    description: string;
    workHours: string;
    members: Member[];
    portfolio: string[];
    workDays?: string[];
    isOwner?: boolean;
}

export interface Member {
    fio: string;
    email: string;
}