export interface ChatI {
    _id: string;
    participants: {
        username: string;
        email: string;
    }[];
    messages: string[];
}