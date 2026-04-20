# TeamDelete

รื้อทีมที่ active ในปัจจุบัน ลบ directory configuration ของมันและ directory task ที่แชร์ นี่คือคู่ตรงข้ามในการทำความสะอาดของ `TeamCreate` และโดยทั่วไปเรียกหลังเป้าหมายของทีมสำเร็จและ teammate ทุกคนปิดระบบแล้ว

## เมื่อใดควรใช้

- ทีมเสร็จงานและส่งรายงานสุดท้ายให้ผู้ใช้แล้ว
- ทีมถูกสร้างโดยผิดพลาดหรือขอบเขตเปลี่ยนไปมากจนเริ่มใหม่สะอาดกว่าการทำต่อ
- คุณต้องสร้างทีมใหม่แต่ยังมีทีม active อยู่ — ลบทีมเก่าก่อน เพราะสามารถนำทีมได้เพียงทีมเดียวในคราวเดียว
- ทีมเก่าค้างข้าม session และ persisted state ใต้ `~/.claude/teams/` ไม่จำเป็นแล้ว

อย่าเรียกขณะ teammate ยังรันอยู่ — ปิด teammate ก่อนผ่าน `SendMessage` ด้วย `shutdown_request` รอ `shutdown_response` ทุกตัวแล้วลบ

## พารามิเตอร์

`TeamDelete` ไม่รับ parameter ในการ invoke ทั่วไป มันทำงานบนทีมที่ active ในปัจจุบันซึ่งเป็นของ session ที่เรียก

## ตัวอย่าง

### ตัวอย่างที่ 1: Shutdown ตามปกติหลังสำเร็จ

1. Broadcast คำขอ shutdown ไปยังทีม:
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. รอให้ teammate แต่ละคนตอบด้วย `shutdown_response`
3. เรียก `TeamDelete()` เพื่อลบ directory ทีมและ directory task

### ตัวอย่างที่ 2: แทนที่ทีมที่ตั้งค่าผิด

หาก `TeamCreate` ถูกเรียกด้วย `agent_type` หรือ `description` ที่ผิด ให้ตรวจสอบก่อนว่ายังไม่มี teammate ถูก spawn (หรือปิด) แล้ว:

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## หมายเหตุ

- `TeamDelete` ล้มเหลวหาก teammate ใดยัง active อยู่ response error จะ list teammate ที่ live — ส่ง `shutdown_request` ผ่าน `SendMessage` ให้แต่ละตัว รอ `shutdown_response` แล้ว retry
- การลบเป็น irreversible จากมุมมองของ tool Config ของทีมที่ `~/.claude/teams/{team_name}/config.json` และ directory task ถูกลบจาก disk หากต้องการรักษา task list ให้ export หรือคัดลอก directory ก่อนลบ
- เฉพาะ session leader ที่สร้างทีมเท่านั้นที่ลบได้ Teammate ที่ถูก spawn ไม่สามารถเรียก `TeamDelete` บนทีมของตัวเองได้
- การลบทีมไม่ rollback การเปลี่ยนแปลง filesystem ที่ teammate ทำใน repository สิ่งเหล่านั้นคือการแก้ไขที่ติดตามโดย git ปกติและต้องถูก revert แยกหากไม่ต้องการ
- หลัง `TeamDelete` คืนค่าสำเร็จ session อิสระที่จะเรียก `TeamCreate` อีกครั้งสำหรับทีมใหม่
