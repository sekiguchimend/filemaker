package staff

type StaffCarDTO struct {
	ID        string  `json:"id"`
	CarType   *string `json:"car_type"`
	Color     *string `json:"color"`
	Capacity  *int    `json:"capacity"`
	Area      *string `json:"area"`
	Character *string `json:"character"`
	Number    *int    `json:"number"`
	IsETC     *bool   `json:"is_etc"`
}

type StaffDTO struct {
	ID                string       `json:"id"`
	SFID              *int         `json:"sfid"`
	FirstName         *string      `json:"first_name"`
	LastName          *string      `json:"last_name"`
	FirstNameFurigana *string      `json:"first_name_furigana"`
	LastNameFurigana  *string      `json:"last_name_furigana"`
	AreaDivision      *string      `json:"area_division"`
	Group             *string      `json:"group"`
	Status            *bool        `json:"status"`
	BathTowel         *int         `json:"bath_towel"`
	Equipment         *int         `json:"equipment"`
	EmploymentType    *string      `json:"employment_type"`
	JobDescription    *string      `json:"job_description"`
	Position          *string      `json:"position"`
	JoiningDate       *string      `json:"joining_date"`
	ResignationDate   *string      `json:"resignation_date"`
	PhoneNumber       *string      `json:"phone_number"`
	MobileEmail       *string      `json:"mobile_email_address"`
	PcEmail           *string      `json:"pc_email_address"`
	Remarks           *string      `json:"remarks"`
	MonStart          *string      `json:"mon_start"`
	MonEnd            *string      `json:"mon_end"`
	TueStart          *string      `json:"tue_start"`
	TueEnd            *string      `json:"tue_end"`
	WedStart          *string      `json:"wed_start"`
	WedEnd            *string      `json:"wed_end"`
	ThuStart          *string      `json:"thu_start"`
	ThuEnd            *string      `json:"thu_end"`
	FriStart          *string      `json:"fri_start"`
	FriEnd            *string      `json:"fri_end"`
	SatStart          *string      `json:"sat_start"`
	SatEnd            *string      `json:"sat_end"`
	SunStart          *string      `json:"sun_start"`
	SunEnd            *string      `json:"sun_end"`
	CreatedAt         *string      `json:"created_at"`
	UpdatedAt         *string      `json:"updated_at"`
	StaffCar          *StaffCarDTO `json:"staff_car"`
}
