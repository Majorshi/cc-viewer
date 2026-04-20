# TeamCreate

จัดตั้งทีมร่วมงานใหม่พร้อม task list ที่แชร์และช่องทางส่งข้อความระหว่าง agent ทีมเป็น primitive การประสานงานสำหรับงานหลาย agent — session หลักทำหน้าที่เป็น leader และ spawn teammate ที่มีชื่อผ่าน tool `Agent`

## เมื่อใดควรใช้

- ผู้ใช้ขอทีม swarm ฝูง หรือการทำงานร่วมกันหลาย agent อย่างชัดเจน
- โปรเจกต์มีงานอิสระชัดเจนหลายสายที่ได้ประโยชน์จากผู้เชี่ยวชาญเฉพาะ (เช่น frontend, backend, test, doc)
- คุณต้องการ task list แชร์ที่คงอยู่ซึ่ง agent หลายตัวอัปเดตขณะที่คืบหน้า
- คุณต้องการ teammate ที่มีชื่อและระบุตำแหน่งได้ที่สามารถแลกเปลี่ยนข้อความผ่าน `SendMessage` แทนที่จะเป็นการเรียก subagent แบบ one-shot

อย่าใช้สำหรับการค้นหามอบหมายเดียวหรือการ fan-out ขนานครั้งเดียว — การเรียก `Agent` ธรรมดาเบากว่าและเพียงพอ

## พารามิเตอร์

- `team_name` (string, required): ตัวระบุเฉพาะของทีม ใช้เป็นชื่อ directory ภายใต้ `~/.claude/teams/` และเป็น argument `team_name` เมื่อ spawn teammate
- `description` (string, required): ข้อความสั้นเกี่ยวกับเป้าหมายของทีม แสดงแก่ teammate ทุกคนเมื่อ spawn และเขียนลง team config
- `agent_type` (string, optional): persona subagent เริ่มต้นที่ใช้กับ teammate ที่ไม่ override ค่าทั่วไปคือ `general-purpose`, `Explore`, หรือ `Plan`

## ตัวอย่าง

### ตัวอย่างที่ 1: สร้างทีม refactor

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

หลังสร้าง spawn teammate ด้วย `Agent` โดยใช้ `team_name: "refactor-crew"` และค่า `name` ที่แตกต่างกัน เช่น `db-lead`, `migrations`, และ `tests`

### ตัวอย่างที่ 2: สร้างทีมสืบสวน

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

Teammate ที่ spawn แต่ละตัวสืบทอด `Explore` เป็น persona เริ่มต้น ตรงกับธรรมชาติการสืบสวนแบบ read-only ของงาน

## หมายเหตุ

- สามารถนำทีมได้เพียงทีมเดียวในคราวเดียวจาก session ที่กำหนด จบหรือลบทีมปัจจุบันก่อนสร้างอีก
- ทีมมี task list แชร์ 1:1 Leader เป็นเจ้าของการสร้าง การมอบหมาย และการปิด task; teammate อัปเดตสถานะของ task ที่พวกเขากำลังทำ
- Team configuration ถูก persist ที่ `~/.claude/teams/{team_name}/config.json` และ directory task อยู่ข้างๆ ไฟล์เหล่านี้รอดข้าม session จนกว่าจะถูกลบชัดเจนด้วย `TeamDelete`
- Teammate ถูก spawn โดยใช้ tool `Agent` ด้วย `team_name` ที่ match บวก `name` ที่แตกต่าง `name` กลายเป็นที่อยู่ที่ใช้โดย `SendMessage`
- เลือก `team_name` ที่ปลอดภัยต่อ filesystem (ตัวอักษร ตัวเลข dash underscore) หลีกเลี่ยง space หรือ slash
- เขียน `description` เพื่อให้ teammate ใหม่เอี่ยมที่อ่านเย็นๆ จะเข้าใจเป้าหมายของทีมโดยไม่ต้องการ context เพิ่ม มันกลายเป็นส่วนหนึ่งของ startup prompt ของ teammate ทุกคน
