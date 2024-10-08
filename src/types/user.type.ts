

export interface UserType {
	_id: string,
	images: string[],
	email: string,
	profileImage?: string,
	username?: string,
	workHours?: string,
	profession?: string,
	about?: string,
	daysOff?: string[],
	phone?: string,

}

export type IUserOptional = Partial<UserType>;