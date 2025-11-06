import { z } from "zod"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const StaffCarSchema = z.object({
  id: z.string(),
  car_type: z.string().nullable(),
  area: z.string().nullable(),
  character: z.string().nullable(),
  number: z.number().nullable(),
  is_etc: z.boolean().nullable(),
})

const StaffSchema = z.object({
  id: z.string(),
  sfid: z.number().nullable().optional(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  first_name_furigana: z.string().nullable(),
  last_name_furigana: z.string().nullable(),
  area_division: z.string().nullable(),
  group: z.string().nullable(),
  status: z.boolean().nullable(),
  phone_number: z.string().nullable(),
  remarks: z.string().nullable(),
  staff_car: StaffCarSchema.nullable().optional(),
})

type Staff = z.infer<typeof StaffSchema>

async function fetchStaff(): Promise<Staff[]> {
  const res = await fetch("http://localhost:8080/api/staff", { cache: "no-store" })
  if (!res.ok) {
    throw new Error("failed to fetch staff")
  }
  const data = await res.json()
  // APIレスポンスは配列想定
  return z.array(StaffSchema).parse(data)
}

function formatPlate(car?: Staff["staff_car"] | null): string {
  if (!car) return "-"
  const parts = [car.area ?? "", car.character ?? "", car.number?.toString() ?? ""].filter(Boolean)
  return parts.length ? parts.join(" ") : "-"
}

export default async function DemoStaffPage() {
  let rows: Staff[] = []
  try {
    rows = await fetchStaff()
  } catch (e) {
    return (
      <div className="p-4">
        <p className="text-red-600">データ取得に失敗しました。</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-semibold">スタッフ一覧（デモ）</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>氏名</TableHead>
            <TableHead>ふりがな</TableHead>
            <TableHead>地域区分</TableHead>
            <TableHead>グループ</TableHead>
            <TableHead>在職</TableHead>
            <TableHead>電話</TableHead>
            <TableHead>車種</TableHead>
            <TableHead>ナンバー</TableHead>
            <TableHead>ETC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => {
            const fullName = [r.last_name ?? "", r.first_name ?? ""].join(" ").trim() || "-"
            const yomi = [r.last_name_furigana ?? "", r.first_name_furigana ?? ""].join(" ").trim() || "-"
            const status = r.status === null ? "-" : r.status ? "在職" : "退職"
            const phone = r.phone_number ?? "-"
            const carType = r.staff_car?.car_type ?? "-"
            const plate = formatPlate(r.staff_car)
            const etc = r.staff_car?.is_etc === null ? "-" : r.staff_car?.is_etc ? "有" : "無"
            return (
              <TableRow key={r.id}>
                <TableCell>{fullName}</TableCell>
                <TableCell>{yomi}</TableCell>
                <TableCell>{r.area_division ?? "-"}</TableCell>
                <TableCell>{r.group ?? "-"}</TableCell>
                <TableCell>{status}</TableCell>
                <TableCell>{phone}</TableCell>
                <TableCell>{carType}</TableCell>
                <TableCell>{plate}</TableCell>
                <TableCell>{etc}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}



