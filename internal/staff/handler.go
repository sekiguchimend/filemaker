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
	AreaDivision     *string  `json:"areaDivision,omitempty"`
	Group            *string  `json:"group,omitempty"`
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
	PhoneNumber      *string  `json:"phoneNumber,omitempty"`
	MobileEmail      *string  `json:"mobileEmail,omitempty"`
	PcEmail          *string  `json:"pcEmail,omitempty"`
	BathTowel        *int     `json:"bathTowel,omitempty"`
	Equipment        *int     `json:"equipment,omitempty"`
	Remarks          *string  `json:"remarks"`
	Vehicle          *struct {
		ID        string  `json:"id"`
		CarType   *string `json:"carType,omitempty"`
		Color     *string `json:"color,omitempty"`
		Capacity  *int    `json:"capacity,omitempty"`
		Area      *string `json:"area,omitempty"`
		Character *string `json:"character,omitempty"`
		Number    *int    `json:"number,omitempty"`
		IsETC     *bool   `json:"isETC,omitempty"`
	} `json:"vehicle,omitempty"`
	Schedule *struct {
		Mon *struct {
			Work  bool   `json:"work"`
			Start string `json:"start"`
			End   string `json:"end"`
		} `json:"mon,omitempty"`
		Tue *struct {
			Work  bool   `json:"work"`
			Start string `json:"start"`
			End   string `json:"end"`
		} `json:"tue,omitempty"`
		Wed *struct {
			Work  bool   `json:"work"`
			Start string `json:"start"`
			End   string `json:"end"`
		} `json:"wed,omitempty"`
		Thu *struct {
			Work  bool   `json:"work"`
			Start string `json:"start"`
			End   string `json:"end"`
		} `json:"thu,omitempty"`
		Fri *struct {
			Work  bool   `json:"work"`
			Start string `json:"start"`
			End   string `json:"end"`
		} `json:"fri,omitempty"`
		Sat *struct {
			Work  bool   `json:"work"`
			Start string `json:"start"`
			End   string `json:"end"`
		} `json:"sat,omitempty"`
		Sun *struct {
			Work  bool   `json:"work"`
			Start string `json:"start"`
			End   string `json:"end"`
		} `json:"sun,omitempty"`
	} `json:"schedule,omitempty"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
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
	s := *iso
	// ISO 8601形式: 2024-01-10T09:00:00+09:00 または 2024-01-10T09:00:00Z
	// または PostgreSQL形式: 2024-01-10 09:00:00+09

	// Tをスペースに置換
	s = strings.ReplaceAll(s, "T", " ")

	// タイムゾーン部分を削除
	// パターン1: +09:00 または +09:00:00 の形式
	if idx := strings.Index(s, "+"); idx > 0 {
		// +の位置が日付部分（YYYY-MM-DD）の後にあることを確認（インデックス10以上）
		if idx >= 10 {
			s = s[:idx]
		}
	}
	// パターン2: -05:00 の形式（タイムゾーンがマイナスの場合）
	// ただし、日付部分のハイフンと区別する必要がある
	// スペースの後の-を探す
	if spaceIdx := strings.Index(s, " "); spaceIdx > 0 && spaceIdx >= 10 {
		timePart := s[spaceIdx+1:]
		// 時刻部分（HH:MM:SS）の後に-がある場合、それはタイムゾーン
		// HH:MM:SS-XX:XX の形式を探す
		if colonCount := strings.Count(timePart, ":"); colonCount >= 2 {
			// HH:MM:SS の形式がある場合、その後の-を探す
			if minusIdx := strings.LastIndex(timePart, "-"); minusIdx > 8 {
				// HH:MM:SS の後（インデックス8以上）にある-はタイムゾーン
				s = s[:spaceIdx+1+minusIdx]
			}
		}
	}
	// パターン3: UTCのZを削除
	if strings.HasSuffix(s, "Z") {
		s = strings.TrimSuffix(s, "Z")
	} else if strings.Contains(s, " Z") {
		s = strings.ReplaceAll(s, " Z", "")
	}

	// 末尾のスペースを削除
	s = strings.TrimSpace(s)
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
		"area_division", "group", "status", "employment_type", "job_description", "position",
		"joining_date", "resignation_date", "phone_number", "mobile_email_address", "pc_email_address",
		"bath_towel", "equipment", "remarks",
		"mon_start", "mon_end",
		"tue_start", "tue_end",
		"wed_start", "wed_end",
		"thu_start", "thu_end",
		"fri_start", "fri_end",
		"sat_start", "sat_end",
		"sun_start", "sun_end",
		"created_at", "updated_at",
		"staff_car:vehicle(id,car_type,color,capacity,area,character,number,is_etc)",
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

		// 電話番号をマスク（個人情報保護）
		maskedPhone := maskPhone(s.PhoneNumber)

		// 車両情報をマッピング
		var vehicle *struct {
			ID        string  `json:"id"`
			CarType   *string `json:"carType,omitempty"`
			Color     *string `json:"color,omitempty"`
			Capacity  *int    `json:"capacity,omitempty"`
			Area      *string `json:"area,omitempty"`
			Character *string `json:"character,omitempty"`
			Number    *int    `json:"number,omitempty"`
			IsETC     *bool   `json:"isETC,omitempty"`
		}
		if s.StaffCar != nil {
			vehicle = &struct {
				ID        string  `json:"id"`
				CarType   *string `json:"carType,omitempty"`
				Color     *string `json:"color,omitempty"`
				Capacity  *int    `json:"capacity,omitempty"`
				Area      *string `json:"area,omitempty"`
				Character *string `json:"character,omitempty"`
				Number    *int    `json:"number,omitempty"`
				IsETC     *bool   `json:"isETC,omitempty"`
			}{
				ID:        s.StaffCar.ID,
				CarType:   s.StaffCar.CarType,
				Color:     s.StaffCar.Color,
				Capacity:  s.StaffCar.Capacity,
				Area:      s.StaffCar.Area,
				Character: s.StaffCar.Character,
				Number:    s.StaffCar.Number,
				IsETC:     s.StaffCar.IsETC,
			}
		}

		// スケジュール情報をマッピング（hhmm関数を使用）
		hhmmHelper := func(t *string, fallback string) string {
			if t == nil || *t == "" {
				return fallback
			}
			parts := strings.Split(*t, ":")
			if len(parts) >= 2 {
				return fmt.Sprintf("%s:%s", parts[0], parts[1])
			}
			return *t
		}

		schedule := &struct {
			Mon *struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			} `json:"mon,omitempty"`
			Tue *struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			} `json:"tue,omitempty"`
			Wed *struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			} `json:"wed,omitempty"`
			Thu *struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			} `json:"thu,omitempty"`
			Fri *struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			} `json:"fri,omitempty"`
			Sat *struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			} `json:"sat,omitempty"`
			Sun *struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			} `json:"sun,omitempty"`
		}{}

		// 各曜日のスケジュールを設定
		if s.MonStart != nil && s.MonEnd != nil {
			schedule.Mon = &struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			}{
				Work:  true,
				Start: hhmmHelper(s.MonStart, "09:00"),
				End:   hhmmHelper(s.MonEnd, "18:00"),
			}
		}
		if s.TueStart != nil && s.TueEnd != nil {
			schedule.Tue = &struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			}{
				Work:  true,
				Start: hhmmHelper(s.TueStart, "09:00"),
				End:   hhmmHelper(s.TueEnd, "18:00"),
			}
		}
		if s.WedStart != nil && s.WedEnd != nil {
			schedule.Wed = &struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			}{
				Work:  true,
				Start: hhmmHelper(s.WedStart, "09:00"),
				End:   hhmmHelper(s.WedEnd, "18:00"),
			}
		}
		if s.ThuStart != nil && s.ThuEnd != nil {
			schedule.Thu = &struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			}{
				Work:  true,
				Start: hhmmHelper(s.ThuStart, "09:00"),
				End:   hhmmHelper(s.ThuEnd, "18:00"),
			}
		}
		if s.FriStart != nil && s.FriEnd != nil {
			schedule.Fri = &struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			}{
				Work:  true,
				Start: hhmmHelper(s.FriStart, "09:00"),
				End:   hhmmHelper(s.FriEnd, "18:00"),
			}
		}
		if s.SatStart != nil && s.SatEnd != nil {
			schedule.Sat = &struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			}{
				Work:  true,
				Start: hhmmHelper(s.SatStart, "10:00"),
				End:   hhmmHelper(s.SatEnd, "16:00"),
			}
		}
		if s.SunStart != nil && s.SunEnd != nil {
			schedule.Sun = &struct {
				Work  bool   `json:"work"`
				Start string `json:"start"`
				End   string `json:"end"`
			}{
				Work:  true,
				Start: hhmmHelper(s.SunStart, "00:00"),
				End:   hhmmHelper(s.SunEnd, "00:00"),
			}
		}

		rec := StaffLedgerRecord{
			ID:               s.ID,
			SFID:             coalesce(toStringPtrFromIntPtr(s.SFID), ""),
			LastName:         last,
			FirstName:        first,
			LastNameKana:     s.LastNameFurigana,
			FirstNameKana:    s.FirstNameFurigana,
			AreaDivision:     s.AreaDivision,
			Group:            s.Group,
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
			PhoneNumber:      maskedPhone,
			MobileEmail:      s.MobileEmail,
			PcEmail:          s.PcEmail,
			BathTowel:        s.BathTowel,
			Equipment:        s.Equipment,
			Remarks:          s.Remarks, // nilの場合はomitemptyでJSONに含まれない
			Vehicle:          vehicle,
			Schedule:         schedule,
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

// --- Update (partial) ---
type UpdateDay struct {
	Work  *bool   `json:"work"`
	Start *string `json:"start"`
	End   *string `json:"end"`
}

type UpdateStaffDetailRequest struct {
	Sfid             *string `json:"sfid"`
	LastName         *string `json:"lastName"`
	FirstName        *string `json:"firstName"`
	LastNameKana     *string `json:"lastNameKana"`
	FirstNameKana    *string `json:"firstNameKana"`
	AreaDivision     *string `json:"areaDivision"`
	EmploymentStatus *string `json:"employmentStatus"` // 'active' | ''
	EmploymentDate   *string `json:"employmentDate"`   // YYYY-MM-DD
	EmploymentType   *string `json:"employmentType"`   // 'employee' | 'part_time'
	JobDriver        *bool   `json:"jobDriver"`
	JobOffice        *bool   `json:"jobOffice"`
	Role             *string `json:"role"`
	PhoneNumber      *string `json:"phoneNumber"`
	MobileEmail      *string `json:"mobileEmail"`
	PcEmail          *string `json:"pcEmail"`
	VehicleId        *string `json:"vehicleId"`
	BathTowel        *int    `json:"bathTowel"`
	Equipment        *int    `json:"equipment"`
	Remarks          *string `json:"remarks"`
	Car              *struct {
		CarType   *string `json:"carType"`
		Color     *string `json:"color"`
		Capacity  *int    `json:"capacity"`
		Area      *string `json:"area"`
		Character *string `json:"character"`
		Number    *int    `json:"number"`
		IsETC     *bool   `json:"isETC"`
	} `json:"car"`
	Schedule map[string]UpdateDay `json:"schedule"`
}

func roleKeyToPosition(role string) string {
	switch role {
	case "chairman":
		return "会長"
	case "advisor":
		return "顧問"
	case "president":
		return "社長"
	case "general_manager":
		return "統括部長"
	case "manager":
		return "マネージャ"
	case "admin_manager":
		return "管理部長"
	case "office_manager":
		return "内勤部長"
	case "female_manager":
		return "女子管理責任"
	case "office_staff":
		return "内勤"
	case "pr":
		return "PR"
	default:
		return role
	}
}

func buildJobDescription(d *bool, o *bool) *string {
	if d == nil && o == nil {
		return nil
	}
	var parts []string
	if d != nil && *d {
		parts = append(parts, "送迎")
	}
	if o != nil && *o {
		parts = append(parts, "事務")
	}
	s := strings.Join(parts, ",")
	return &s
}

func currentValueString(v any) string {
	if p, ok := v.(*string); ok && p != nil {
		return *p
	}
	return ""
}

func currentValueInt(v any) int {
	if p, ok := v.(*int); ok && p != nil {
		return *p
	}
	return 0
}

func currentValueBool(v any) bool {
	if p, ok := v.(*bool); ok && p != nil {
		return *p
	}
	return false
}

func UpdateStaffHandler(c *gin.Context) {
	id := c.Param("id")
	if strings.TrimSpace(id) == "" {
		c.JSON(http.StatusBadRequest, ErrorResponse{Code: "VAL_001", Message: "missing id"})
		return
	}
	ctx, cancel := context.WithTimeout(c.Request.Context(), 12*time.Second)
	defer cancel()

	client, err := supa.NewClientFromEnv()
	if err != nil {
		log.Printf("DB_001: failed to init supabase client: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_001", Message: "backend initialization error"})
		return
	}

	var req UpdateStaffDetailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("VAL_002: invalid body: %v", err)
		c.JSON(http.StatusBadRequest, ErrorResponse{Code: "VAL_002", Message: "invalid request body"})
		return
	}

	// 1) 現在値を取得
	qget := url.Values{}
	qget.Set("select", strings.Join([]string{
		"id", "sfid", "first_name", "last_name", "first_name_furigana", "last_name_furigana",
		"area_division", "status", "employment_type", "job_description", "position",
		"joining_date", "phone_number", "mobile_email_address", "pc_email_address",
		"mon_start", "mon_end", "tue_start", "tue_end", "wed_start", "wed_end",
		"thu_start", "thu_end", "fri_start", "fri_end", "sat_start", "sat_end", "sun_start", "sun_end",
		"staff_car:vehicle(id,car_type,color,capacity,area,character,number,is_etc)",
	}, ","))
	qget.Set("id", "eq."+id)
	qget.Set("limit", "1")
	body, _, getErr := client.Get(ctx, "/rest/v1/staff", qget)
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
	current := rows[0]

	// 2) パッチを構築（差分比較せず、リクエストで受けた値をそのまま反映）
	patch := map[string]any{}
	// sfid
	if req.Sfid != nil {
		if v := strings.TrimSpace(*req.Sfid); v == "" {
			patch["sfid"] = nil
		} else {
			// parse integer
			digits := strings.TrimPrefix(strings.TrimPrefix(v, "+"), "-")
			sign := 1
			if strings.HasPrefix(v, "-") {
				sign = -1
			}
			val := 0
			valid := true
			for _, ch := range digits {
				if ch < '0' || ch > '9' {
					valid = false
					break
				}
				val = val*10 + int(ch-'0')
			}
			if valid {
				patch["sfid"] = val * sign
			}
		}
	}
	// names
	if req.LastName != nil {
		patch["last_name"] = *req.LastName
	}
	if req.FirstName != nil {
		patch["first_name"] = *req.FirstName
	}
	if req.LastNameKana != nil {
		patch["last_name_furigana"] = *req.LastNameKana
	}
	if req.FirstNameKana != nil {
		patch["first_name_furigana"] = *req.FirstNameKana
	}
	// area
	if req.AreaDivision != nil {
		patch["area_division"] = *req.AreaDivision
	}
	// status
	if req.EmploymentStatus != nil {
		patch["status"] = (*req.EmploymentStatus == "active")
	}
	// basics counts
	if req.BathTowel != nil {
		patch["bath_towel"] = *req.BathTowel
	}
	if req.Equipment != nil {
		patch["equipment"] = *req.Equipment
	}
	// joining_date
	if req.EmploymentDate != nil {
		if strings.TrimSpace(*req.EmploymentDate) == "" {
			patch["joining_date"] = nil
		} else {
			patch["joining_date"] = *req.EmploymentDate
		}
	}
	// employment_type
	if req.EmploymentType != nil {
		patch["employment_type"] = *req.EmploymentType
	}
	// job_description
	if jd := buildJobDescription(req.JobDriver, req.JobOffice); jd != nil {
		patch["job_description"] = *jd
	}
	// role / position
	if req.Role != nil {
		patch["position"] = roleKeyToPosition(*req.Role)
	}
	// contacts
	if req.PhoneNumber != nil {
		patch["phone_number"] = *req.PhoneNumber
	}
	if req.MobileEmail != nil {
		patch["mobile_email_address"] = *req.MobileEmail
	}
	if req.PcEmail != nil {
		patch["pc_email_address"] = *req.PcEmail
	}
	// remarks
	if req.Remarks != nil {
		if strings.TrimSpace(*req.Remarks) == "" {
			patch["remarks"] = nil
		} else {
			patch["remarks"] = *req.Remarks
		}
	}
	// schedule (times)
	if req.Schedule != nil {
		setTime := func(day string, upd UpdateDay) {
			if upd.Work != nil && !*upd.Work {
				patch[day+"_start"] = nil
				patch[day+"_end"] = nil
				return
			}
			if upd.Start != nil {
				patch[day+"_start"] = *upd.Start
			}
			if upd.End != nil {
				patch[day+"_end"] = *upd.End
			}
		}
		if v, ok := req.Schedule["mon"]; ok {
			setTime("mon", v)
		}
		if v, ok := req.Schedule["tue"]; ok {
			setTime("tue", v)
		}
		if v, ok := req.Schedule["wed"]; ok {
			setTime("wed", v)
		}
		if v, ok := req.Schedule["thu"]; ok {
			setTime("thu", v)
		}
		if v, ok := req.Schedule["fri"]; ok {
			setTime("fri", v)
		}
		if v, ok := req.Schedule["sat"]; ok {
			setTime("sat", v)
		}
		if v, ok := req.Schedule["sun"]; ok {
			setTime("sun", v)
		}
	}
	// vehicle foreign key (always reflect)
	if req.VehicleId != nil {
		newVehicle := strings.TrimSpace(*req.VehicleId)
		if newVehicle == "" {
			patch["vehicle"] = nil
		} else {
			patch["vehicle"] = newVehicle
		}
	}

	// staff_car patch (if requested)
	var carPatched bool
	if req.Car != nil {
		// determine target vehicle id
		var targetVid *string
		if req.VehicleId != nil && strings.TrimSpace(*req.VehicleId) != "" {
			targetVid = req.VehicleId
		} else if current.StaffCar != nil {
			idCopy := current.StaffCar.ID
			targetVid = &idCopy
		}
		if targetVid != nil {
			carPatch := map[string]any{}
			sameVehicle := current.StaffCar != nil && current.StaffCar.ID == *targetVid
			setCarField := func(key string, newPtr any, curVal any) {
				switch nv := newPtr.(type) {
				case *string:
					if nv != nil {
						if !sameVehicle || currentValueString(curVal) != *nv {
							carPatch[key] = *nv
						}
					}
				case *int:
					if nv != nil {
						if !sameVehicle || currentValueInt(curVal) != *nv {
							carPatch[key] = *nv
						}
					}
				case *bool:
					if nv != nil {
						if !sameVehicle || currentValueBool(curVal) != *nv {
							carPatch[key] = *nv
						}
					}
				}
			}
			// helpers current values
			var cur *struct {
				CarType, Color, Area, Character *string
				Capacity, Number                *int
				IsETC                           *bool
			}
			if current.StaffCar != nil {
				cur = &struct {
					CarType, Color, Area, Character *string
					Capacity, Number                *int
					IsETC                           *bool
				}{
					CarType:   current.StaffCar.CarType,
					Color:     current.StaffCar.Color,
					Area:      current.StaffCar.Area,
					Character: current.StaffCar.Character,
					Capacity:  current.StaffCar.Capacity,
					Number:    current.StaffCar.Number,
					IsETC:     current.StaffCar.IsETC,
				}
			}
			setCarField("car_type", req.Car.CarType, func() *string {
				if cur != nil {
					return cur.CarType
				}
				return nil
			}())
			setCarField("color", req.Car.Color, func() *string {
				if cur != nil {
					return cur.Color
				}
				return nil
			}())
			setCarField("capacity", req.Car.Capacity, func() *int {
				if cur != nil {
					return cur.Capacity
				}
				return nil
			}())
			setCarField("area", req.Car.Area, func() *string {
				if cur != nil {
					return cur.Area
				}
				return nil
			}())
			setCarField("character", req.Car.Character, func() *string {
				if cur != nil {
					return cur.Character
				}
				return nil
			}())
			setCarField("number", req.Car.Number, func() *int {
				if cur != nil {
					return cur.Number
				}
				return nil
			}())
			setCarField("is_etc", req.Car.IsETC, func() *bool {
				if cur != nil {
					return cur.IsETC
				}
				return nil
			}())

			if len(carPatch) > 0 {
				qcar := url.Values{}
				qcar.Set("id", "eq."+*targetVid)
				if _, _, err := client.Patch(ctx, "/rest/v1/staff_car", qcar, carPatch); err != nil {
					log.Printf("DB_003: supabase patch car error: %v", err)
					c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_003", Message: "database update error (car)"})
					return
				}
				carPatched = true
			}
		}
	}

	if len(patch) == 0 && !carPatched {
		c.JSON(http.StatusOK, gin.H{"updated": 0, "message": "no changes"})
		return
	}

	// 3) staff パッチ送信（差分がある場合のみ）
	var staffUpdated []map[string]any
	if len(patch) > 0 {
		qpatch := url.Values{}
		qpatch.Set("id", "eq."+id)
		respBody, _, patchErr := client.Patch(ctx, "/rest/v1/staff", qpatch, patch)
		if patchErr != nil {
			log.Printf("DB_003: supabase patch error: %v", patchErr)
			c.JSON(http.StatusInternalServerError, ErrorResponse{Code: "DB_003", Message: "database update error"})
			return
		}
		// PostgREST returns an array with updated row when Prefer=return=representation
		_ = json.Unmarshal(respBody, &staffUpdated)
	}

	c.JSON(http.StatusOK, gin.H{
		"updated":       1,
		"changedFields": patch,
		"row":           staffUpdated,
	})
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
	VehicleId        *string `json:"vehicleId,omitempty"`
	BathTowel        *int    `json:"bathTowel,omitempty"`
	Equipment        *int    `json:"equipment,omitempty"`
	Sfid             string  `json:"sfid"`
	LastName         string  `json:"lastName"`
	FirstName        string  `json:"firstName"`
	LastNameKana     *string `json:"lastNameKana,omitempty"`
	FirstNameKana    *string `json:"firstNameKana,omitempty"`
	AreaDivision     *string `json:"areaDivision,omitempty"`
	PhoneNumber      *string `json:"phoneNumber,omitempty"`
	MobileEmail      *string `json:"mobileEmail,omitempty"`
	PcEmail          *string `json:"pcEmail,omitempty"`
	Remarks          *string `json:"remarks"`
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
		"bath_towel", "equipment", "remarks",
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
		BathTowel:        s.BathTowel,
		Equipment:        s.Equipment,
		Sfid:             coalesce(toStringPtrFromIntPtr(s.SFID), ""),
		LastName:         coalesce(s.LastName, ""),
		FirstName:        coalesce(s.FirstName, ""),
		LastNameKana:     s.LastNameFurigana,
		FirstNameKana:    s.FirstNameFurigana,
		AreaDivision:     s.AreaDivision,
		PhoneNumber:      s.PhoneNumber,
		MobileEmail:      s.MobileEmail,
		PcEmail:          s.PcEmail,
		Remarks:          s.Remarks, // nilの場合はomitemptyでJSONに含まれないが、フロントエンドでundefinedとして処理される
		Schedule:         schedule,
	}
	if s.StaffCar != nil {
		id := s.StaffCar.ID
		resp.VehicleId = &id
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
