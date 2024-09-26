import {UserType} from "@/types/user.type";

export interface ITeam {
    _id: string;
    name: string;
    description: string;
    workHours?: string;
    members: UserType[];
    portfolio: string[];
    workDays?: string[];
    isOwner?: boolean;
    isSearchingOpen: boolean
}