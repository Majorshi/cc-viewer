# TaskGet

ดึงบันทึกเต็มสำหรับ task เดียวโดย ID รวมถึง description, สถานะปัจจุบัน, owner, metadata, และ dependency edge ใช้เมื่อ summary ที่ส่งคืนโดย `TaskList` ไม่เพียงพอที่จะลงมือกับ task

## เมื่อใดควรใช้

- คุณเลือก task จาก `TaskList` และต้องการ description เต็มก่อนเริ่มงาน
- คุณกำลังจะ mark task เป็น `completed` และต้องการตรวจสอบ acceptance criteria อีกครั้ง
- คุณต้องการตรวจสอบว่า task นี้ `blocks` หรือ `blockedBy` อะไรเพื่อตัดสินใจขั้นตอนถัดไป
- คุณกำลังสืบสวนประวัติ — ใครเป็น owner, metadata อะไรที่แนบอยู่, เมื่อไหร่ที่เปลี่ยนสถานะ
- Teammate หรือ session ก่อนหน้าอ้างถึง task ID และคุณต้องการ context

ชอบ `TaskList` เมื่อต้องการเพียงการสแกนระดับสูง; สงวน `TaskGet` สำหรับบันทึกเฉพาะที่คุณตั้งใจจะอ่านอย่างตั้งใจหรือแก้ไข

## พารามิเตอร์

- `taskId` (string, required): ตัวระบุ task ที่ส่งคืนโดย `TaskCreate` หรือ `TaskList` ID คงที่ตลอดอายุของ task

## ตัวอย่าง

### ตัวอย่างที่ 1

ค้นหา task ที่คุณเพิ่งเห็นใน list

```
TaskGet(taskId: "t_01HXYZ...")
```

Field ทั่วไปของ response: `id`, `subject`, `description`, `activeForm`, `status`, `owner`, `blocks`, `blockedBy`, `metadata`, `createdAt`, `updatedAt`

### ตัวอย่างที่ 2

แก้ไข dependency ก่อนเริ่ม

```
TaskGet(taskId: "t_01HXYZ...")
# ตรวจสอบ blockedBy — หาก task ใดที่อ้างถึงยัง pending
# หรือ in_progress ให้ทำงานบน blocker ก่อน
```

## หมายเหตุ

- `TaskGet` เป็น read-only และปลอดภัยที่จะเรียกซ้ำ; ไม่เปลี่ยนสถานะหรือ ownership
- หาก `blockedBy` ไม่ว่างและมี task ที่ไม่ใช่ `completed` อย่าเริ่ม task นี้ — แก้ blocker ก่อน (หรือประสานกับ owner ของมัน)
- Field `description` อาจยาว อ่านให้ครบก่อนลงมือ; การสแกนนำไปสู่การพลาด acceptance criteria
- `taskId` ที่ไม่รู้จักหรือถูกลบจะคืน error รัน `TaskList` อีกครั้งเพื่อเลือก ID ปัจจุบัน
- หากคุณกำลังจะแก้ไข task ให้เรียก `TaskGet` ก่อนเพื่อหลีกเลี่ยงการ overwrite field ที่ teammate เพิ่งเปลี่ยน
