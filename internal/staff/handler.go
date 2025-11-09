package staff

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	supa "nissyo/internal/supabase"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func maskPhone(phone *string) *string {
	if phone == nil {
		return nil
	}
	p := strings.TrimSpace(*phone)
	if len(p) < 4 {
		masked := "****"
		return &masked
	}
	masked := "***-***-" + p[len(p)-4:]
	return &masked
}

func GetStaffHandler(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	client, err := supa.NewClientFromEnv()
	if err != nil {
		// 環境変数の詳細値はログに出さない
		log.Printf("DB_001: failed to init supabase client: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "backend initialization error"})
		return
	}

	q := url.Values{}
	q.Set("select", strings.Join([]string{
		"id", "sfid", "first_name", "last_name", "first_name_furigana", "last_name_furigana",
		"area_division", "group", "status", "employment_type", "job_description", "position",
		"joining_date", "resignation_date", "phone_number", "remarks",
		"mon_start", "mon_end",
		"tue_start", "tue_end",
		"wed_start", "wed_end",
		"thu_start", "thu_end",
		"fri_start", "fri_end",
		"sat_start", "sat_end",
		"sun_start", "sun_end",
		"created_at", "updated_at",
		"staff_car:vehicle(id,car_type,area,character,number,is_etc)",
	}, ","))
	q.Set("order", "created_at.desc")
	q.Set("limit", "100")

	body, _, getErr := client.Get(ctx, "/rest/v1/staff", q)
	if getErr != nil {
		log.Printf("DB_001: supabase get error: %v", getErr)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "database fetch error"})
		return
	}

	var rows []StaffDTO
	if err := json.Unmarshal(body, &rows); err != nil {
		log.Printf("DB_002: json decode error: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_002", Message: "response decode error"})
		return
	}

	// 個人情報(電話番号)は返却時にマスク
	for i := range rows {
		rows[i].PhoneNumber = maskPhone(rows[i].PhoneNumber)
	}

	c.JSON(http.StatusOK, rows)
}

// --- Staff Ledger ---
type StaffLedgerRecord struct {
	ID               string   `json:"id"`
	SFID             string   `json:"sfid"`
	LastName         string   `json:"lastName"`
	FirstName        string   `json:"firstName"`
	LastNameKana     *string  `json:"lastNameKana,omitempty"`
	FirstNameKana    *string  `json:"firstNameKana,omitempty"`
	EmploymentDate   string   `json:"employmentDate"`
	RetirementDate   *string  `json:"retirementDate,omitempty"`
	EmploymentType   string   `json:"employmentType"`
	JobTypes         []string `json:"jobTypes"`
	Role             string   `json:"role"`
	EmploymentStatus string   `json:"employmentStatus"`
	AdjustmentRate   float64  `json:"adjustmentRate"`
	DisplayOrder     int      `json:"displayOrder"`
	AccountName      string   `json:"accountName"`
	AccessType       string   `json:"accessType"`
	AccessStatus     string   `json:"accessStatus"`
	CreatedAt        string   `json:"createdAt"`
	UpdatedAt        string   `json:"updatedAt"`
}

func coalesce(ptr *string, fallback string) string {
	if ptr != nil {
		return *ptr
	}
	return fallback
}

func parseDateOnly(iso *string) string {
	if iso == nil || *iso == "" {
		return ""
	}
	s := *iso
	// expect like 2024-01-10T09:00:00+09:00
	if idx := strings.Index(s, "T"); idx > 0 {
		return s[:idx]
	}
	return s
}

func formatDateTimeLikeSample(iso *string) string {
	if iso == nil || *iso == "" {
		return ""
	}
	// 2024-01-10T09:00:00+09:00 -> 2024-01-10 09:00:00
	s := *iso
	s = strings.ReplaceAll(s, "T", " ")
	if idx := strings.IndexAny(s, "+-Z"); idx > 0 {
		return s[:idx]
	}
	return s
}

func mapJobTypes(job *string) []string {
	j := strings.TrimSpace(strings.ToLower(coalesce(job, "")))
	var out []string
	if strings.Contains(j, "送迎") || strings.Contains(j, "driver") {
		out = append(out, "driver")
	}
	if strings.Contains(j, "事務") || strings.Contains(j, "office") {
		out = append(out, "office")
	}
	if len(out) == 0 {
		out = []string{"office"}
	}
	return out
}

func mapRole(position *string) string {
	p := strings.TrimSpace(strings.ToLower(coalesce(position, "")))
	switch {
	case strings.Contains(p, "会長"):
		return "chairman"
	case strings.Contains(p, "顧問"):
		return "advisor"
	case strings.Contains(p, "社長"):
		return "president"
	case strings.Contains(p, "統括"):
		return "general_manager"
	case strings.Contains(p, "管理部長"):
		return "admin_manager"
	case strings.Contains(p, "内勤部長"):
		return "office_manager"
	case strings.Contains(p, "女子"):
		return "female_manager"
	case strings.Contains(p, "pr"):
		return "pr"
	case strings.Contains(p, "マネージャ"):
		return "manager"
	default:
		return "office_staff"
	}
}

func GetStaffLedgerHandler(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	client, err := supa.NewClientFromEnv()
	if err != nil {
		log.Printf("DB_001: failed to init supabase client: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "backend initialization error"})
		return
	}

	q := url.Values{}
	q.Set("select", strings.Join([]string{
		"id", "sfid", "first_name", "last_name", "first_name_furigana", "last_name_furigana",
		"employment_type", "job_description", "position", "status",
		"joining_date", "resignation_date", "created_at", "updated_at",
	}, ","))
	q.Set("order", "created_at.asc")
	q.Set("limit", "200")

	body, _, getErr := client.Get(ctx, "/rest/v1/staff", q)
	if getErr != nil {
		log.Printf("DB_001: supabase get error: %v", getErr)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "database fetch error"})
		return
	}

	var rows []StaffDTO
	if err := json.Unmarshal(body, &rows); err != nil {
		log.Printf("DB_002: json decode error: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_002", Message: "response decode error"})
		return
	}

	records := make([]StaffLedgerRecord, 0, len(rows))
	for i, s := range rows {
		last := coalesce(s.LastName, "")
		first := coalesce(s.FirstName, "")
		rec := StaffLedgerRecord{
			ID:               s.ID,
			SFID:             coalesce(toStringPtrFromIntPtr(s.SFID), ""),
			LastName:         last,
			FirstName:        first,
			LastNameKana:     s.LastNameFurigana,
			FirstNameKana:    s.FirstNameFurigana,
			EmploymentDate:   parseDateOnly(s.JoiningDate),
			RetirementDate:   s.ResignationDate,
			EmploymentType:   mapEmploymentType(s.EmploymentType),
			JobTypes:         mapJobTypes(s.JobDescription),
			Role:             mapRole(s.Position),
			EmploymentStatus: mapEmploymentStatus(s.Status),
			AdjustmentRate:   1.0,
			DisplayOrder:     i + 1,
			AccountName:      buildAccountName(last, first, s.SFID),
			AccessType:       "staff",
			AccessStatus:     "active",
			CreatedAt:        formatDateTimeLikeSample(s.CreatedAt),
			UpdatedAt:        formatDateTimeLikeSample(s.UpdatedAt),
		}
		records = append(records, rec)
	}

	c.JSON(http.StatusOK, records)
}

func toStringPtrFromIntPtr(n *int) *string {
	if n == nil {
		return nil
	}
	s := fmt.Sprintf("%03d", *n)
	return &s
}

func mapEmploymentType(t *string) string {
	switch strings.ToLower(coalesce(t, "")) {
	case "正社員", "employee":
		return "employee"
	case "アルバイト", "part_time":
		return "part_time"
	default:
		return "employee"
	}
}

func mapEmploymentStatus(b *bool) string {
	if b == nil {
		return ""
	}
	if *b {
		return "active"
	}
	return ""
}

func buildAccountName(last, first string, sfid *int) string {
	if sfid != nil {
		return fmt.Sprintf("staff_%03d", *sfid)
	}
	// fallback: romaji-like simple, removing spaces
	name := strings.TrimSpace(last + "_" + first)
	if name == "_" || name == "" {
		return "staff_000"
	}
	return name
}

// ------- Staff Detail -------
type DaySchedule struct {
	Work  bool   `json:"work"`
	Start string `json:"start"`
	End   string `json:"end"`
}

type StaffDetailResponse struct {
	EmploymentStatus string  `json:"employmentStatus"`
	EmploymentDate   string  `json:"employmentDate"`
	EmploymentType   string  `json:"employmentType"`
	JobDriver        bool    `json:"jobDriver"`
	JobOffice        bool    `json:"jobOffice"`
	Role             string  `json:"role"`
	EtcEnabled       bool    `json:"etcEnabled"`
	Sfid             string  `json:"sfid"`
	LastName         string  `json:"lastName"`
	FirstName        string  `json:"firstName"`
	LastNameKana     *string `json:"lastNameKana,omitempty"`
	FirstNameKana    *string `json:"firstNameKana,omitempty"`
	AreaDivision     *string `json:"areaDivision,omitempty"`
	PhoneNumber      *string `json:"phoneNumber,omitempty"`
	MobileEmail      *string `json:"mobileEmail,omitempty"`
	PcEmail          *string `json:"pcEmail,omitempty"`
	Car              *struct {
		CarType   *string `json:"carType,omitempty"`
		Color     *string `json:"color,omitempty"`
		Capacity  *int    `json:"capacity,omitempty"`
		Area      *string `json:"area,omitempty"`
		Character *string `json:"character,omitempty"`
		Number    *int    `json:"number,omitempty"`
		IsETC     *bool   `json:"isETC,omitempty"`
	} `json:"car,omitempty"`
	Schedule interface{} `json:"schedule"` // map[string]DaySchedule
}

func hhmm(t *string, fallback string) string {
	if t == nil || *t == "" {
		return fallback
	}
	parts := strings.Split(*t, ":")
	if len(parts) >= 2 {
		return fmt.Sprintf("%s:%s", parts[0], parts[1])
	}
	return *t
}

func GetStaffDetailHandler(c *gin.Context) {
	id := c.Param("id")
	if strings.TrimSpace(id) == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{Code: "VAL_001", Message: "missing id"})
		return
	}
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	client, err := supa.NewClientFromEnv()
	if err != nil {
		log.Printf("DB_001: failed to init supabase client: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "backend initialization error"})
		return
	}

	q := url.Values{}
	q.Set("select", strings.Join([]string{
		"id", "sfid", "first_name", "last_name", "first_name_furigana", "last_name_furigana",
		"status", "employment_type", "job_description", "position",
		"joining_date", "area_division", "phone_number", "mobile_email_address", "pc_email_address",
		"mon_start", "mon_end",
		"tue_start", "tue_end",
		"wed_start", "wed_end",
		"thu_start", "thu_end",
		"fri_start", "fri_end",
		"sat_start", "sat_end",
		"sun_start", "sun_end",
		"staff_car:vehicle(id,car_type,color,capacity,area,character,number,is_etc)",
	}, ","))
	q.Set("id", "eq."+id)
	q.Set("limit", "1")

	body, _, getErr := client.Get(ctx, "/rest/v1/staff", q)
	if getErr != nil {
		log.Printf("DB_001: supabase get error: %v", getErr)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "database fetch error"})
		return
	}
	var rows []StaffDTO
	if err := json.Unmarshal(body, &rows); err != nil {
		log.Printf("DB_002: json decode error: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_002", Message: "response decode error"})
		return
	}
	if len(rows) == 0 {
		c.JSON(http.StatusNotFound, ErrorResponse{Code: "DB_404", Message: "staff not found"})
		return
	}
	s := rows[0]

	schedule := map[string]DaySchedule{
		"mon": {Work: s.MonStart != nil && s.MonEnd != nil, Start: hhmm(s.MonStart, "09:00"), End: hhmm(s.MonEnd, "18:00")},
		"tue": {Work: s.TueStart != nil && s.TueEnd != nil, Start: hhmm(s.TueStart, "09:00"), End: hhmm(s.TueEnd, "18:00")},
		"wed": {Work: s.WedStart != nil && s.WedEnd != nil, Start: hhmm(s.WedStart, "09:00"), End: hhmm(s.WedEnd, "18:00")},
		"thu": {Work: s.ThuStart != nil && s.ThuEnd != nil, Start: hhmm(s.ThuStart, "09:00"), End: hhmm(s.ThuEnd, "18:00")},
		"fri": {Work: s.FriStart != nil && s.FriEnd != nil, Start: hhmm(s.FriStart, "09:00"), End: hhmm(s.FriEnd, "18:00")},
		"sat": {Work: s.SatStart != nil && s.SatEnd != nil, Start: hhmm(s.SatStart, "10:00"), End: hhmm(s.SatEnd, "16:00")},
		"sun": {Work: s.SunStart != nil && s.SunEnd != nil, Start: hhmm(s.SunStart, "00:00"), End: hhmm(s.SunEnd, "00:00")},
	}

	resp := StaffDetailResponse{
		EmploymentStatus: mapEmploymentStatus(s.Status),
		EmploymentDate:   parseDateOnly(s.JoiningDate),
		EmploymentType:   mapEmploymentType(s.EmploymentType),
		JobDriver:        strings.Contains(strings.ToLower(coalesce(s.JobDescription, "")), "driver") || strings.Contains(coalesce(s.JobDescription, ""), "送迎"),
		JobOffice:        strings.Contains(strings.ToLower(coalesce(s.JobDescription, "")), "office") || strings.Contains(coalesce(s.JobDescription, ""), "事務"),
		Role:             mapRole(s.Position),
		EtcEnabled:       s.StaffCar != nil && s.StaffCar.IsETC != nil && *s.StaffCar.IsETC,
		Sfid:             coalesce(toStringPtrFromIntPtr(s.SFID), ""),
		LastName:         coalesce(s.LastName, ""),
		FirstName:        coalesce(s.FirstName, ""),
		LastNameKana:     s.LastNameFurigana,
		FirstNameKana:    s.FirstNameFurigana,
		AreaDivision:     s.AreaDivision,
		PhoneNumber:      s.PhoneNumber,
		MobileEmail:      s.MobileEmail,
		PcEmail:          s.PcEmail,
		Schedule:         schedule,
	}
	if s.StaffCar != nil {
		resp.Car = &struct {
			CarType   *string `json:"carType,omitempty"`
			Color     *string `json:"color,omitempty"`
			Capacity  *int    `json:"capacity,omitempty"`
			Area      *string `json:"area,omitempty"`
			Character *string `json:"character,omitempty"`
			Number    *int    `json:"number,omitempty"`
			IsETC     *bool   `json:"isETC,omitempty"`
		}{
			CarType:   s.StaffCar.CarType,
			Color:     s.StaffCar.Color,
			Capacity:  s.StaffCar.Capacity,
			Area:      s.StaffCar.Area,
			Character: s.StaffCar.Character,
			Number:    s.StaffCar.Number,
			IsETC:     s.StaffCar.IsETC,
		}
	}

	c.JSON(http.StatusOK, resp)
}
