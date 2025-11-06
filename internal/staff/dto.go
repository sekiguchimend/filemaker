package staff

type StaffCarDTO struct {
	ID        string  `json:"id"`
	CarType   *string `json:"car_type"`
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
	PhoneNumber       *string      `json:"phone_number"`
	Remarks           *string      `json:"remarks"`
	StaffCar          *StaffCarDTO `json:"staff_car"`
}

