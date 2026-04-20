# TeamDelete

Mevcut aktif ekibi yıkar, yapılandırma dizinini ve paylaşılan görev dizinini kaldırır. Bu, `TeamCreate`'in temizlik karşılığıdır ve genellikle ekibin hedefi ulaşıldıktan ve tüm ekip arkadaşları kapatıldıktan sonra çağrılır.

## Ne Zaman Kullanılır

- Ekip işini tamamladı ve nihai rapor kullanıcıya teslim edildi.
- Ekip hatayla oluşturuldu veya kapsamı o kadar büyük ölçüde değişti ki, devam etmek yerine sıfırdan başlamak daha temiz.
- Yeni bir ekip oluşturmanız gerekiyor ancak zaten bir tane aktif — eskisini önce silin, çünkü aynı anda yalnızca bir ekibe liderlik edilebilir.
- Bir ekip oturumlar arasında eski hale geldi ve `~/.claude/teams/` altındaki kalıcı durumu artık gerekli değil.

Ekip arkadaşları hala çalışırken ÇAĞIRMAYIN — önce `SendMessage` ile bir `shutdown_request` ile onları kapatın, her `shutdown_response`'u bekleyin, sonra silin.

## Parametreler

`TeamDelete` tipik çağrısında parametre almaz. Çağıran oturuma ait mevcut aktif ekip üzerinde çalışır.

## Örnekler

### Örnek 1: Başarı sonrası rutin kapanış

1. Ekibe bir kapatma isteği yayınlayın:
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. Her ekip arkadaşının bir `shutdown_response` ile yanıt vermesini bekleyin.
3. Ekip dizinini ve görev dizinini kaldırmak için `TeamDelete()` çağırın.

### Örnek 2: Yanlış yapılandırılmış bir ekibi değiştirme

`TeamCreate` yanlış `agent_type` veya `description` ile çağrıldıysa, önce hiç ekip arkadaşı oluşturulmadığından emin olun (veya onları kapatın), sonra:

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## Notlar

- `TeamDelete` herhangi bir ekip arkadaşı hala aktifse başarısız olur. Hata yanıtı canlı ekip arkadaşlarını listeler — her birine `SendMessage` aracılığıyla bir `shutdown_request` gönderin, `shutdown_response`'larını bekleyin ve tekrar deneyin.
- Silme, aracın bakış açısından geri döndürülemez. Ekibin `~/.claude/teams/{team_name}/config.json`'daki yapılandırması ve görev dizini diskten kaldırılır. Görev listesinin korunmasına ihtiyacınız varsa, silmeden önce dizini dışa aktarın veya kopyalayın.
- Yalnızca ekibi oluşturan lider oturum onu silebilir. Oluşturulan bir ekip arkadaşı kendi ekibinde `TeamDelete` çağıramaz.
- Ekibi silmek, ekip arkadaşlarının depoda yaptığı dosya sistemi değişikliklerini geri almaz. Bunlar sıradan git-izlemeli düzenlemelerdir ve istenmiyorsa ayrıca geri alınmaları gerekir.
- `TeamDelete` başarıyla döndükten sonra, oturum yeni bir ekip için yeniden `TeamCreate` çağırmakta özgürdür.
