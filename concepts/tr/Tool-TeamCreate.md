# TeamCreate

Paylaşılan görev listesi ve ajanlar arası mesajlaşma kanalı ile yeni bir iş birliği ekibi kurar. Bir ekip, çoklu-ajan çalışması için koordinasyon temel öğesidir — ana oturum lider olarak hareket eder ve `Agent` aracı aracılığıyla isimlendirilmiş ekip arkadaşları oluşturur.

## Ne Zaman Kullanılır

- Kullanıcı açıkça bir ekip, sürü, tayfa veya çoklu-ajan iş birliği ister.
- Bir projenin, özelleşmiş uzmanlardan (örneğin frontend, backend, testler, dokümanlar) yararlanan birkaç açıkça bağımsız iş akışı vardır.
- İlerleme kaydettikçe birden fazla ajanın güncellediği kalıcı bir paylaşılan görev listesine ihtiyacınız var.
- Tek seferlik alt ajan çağrıları yerine `SendMessage` aracılığıyla mesaj alışverişinde bulunabilen isimlendirilmiş, adreslenebilir ekip arkadaşları istersiniz.

Tek bir devredilmiş arama veya tek seferlik paralel fan-out için KULLANMAYIN — düz `Agent` çağrıları daha hafif ve yeterlidir.

## Parametreler

- `team_name` (string, zorunlu): Ekip için benzersiz tanımlayıcı. `~/.claude/teams/` altındaki dizin adı olarak ve ekip arkadaşlarını oluştururken `team_name` argümanı olarak kullanılır.
- `description` (string, zorunlu): Ekibin hedefinin kısa ifadesi. Her ekip arkadaşına oluşturulurken gösterilir ve ekip yapılandırmasına yazılır.
- `agent_type` (string, opsiyonel): Onu geçersiz kılmayan ekip arkadaşlarına uygulanan varsayılan alt ajan persona'sı. Tipik değerler `general-purpose`, `Explore` veya `Plan`'dır.

## Örnekler

### Örnek 1: Bir refactoring ekibi oluşturun

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

Oluşturmadan sonra, `team_name: "refactor-crew"` ve `db-lead`, `migrations` ve `tests` gibi farklı `name` değerleri kullanarak `Agent` ile ekip arkadaşları oluşturun.

### Örnek 2: Bir inceleme ekibi oluşturun

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

Oluşturulan her ekip arkadaşı, işin yalnızca-okuma inceleme doğasıyla eşleşen varsayılan persona olarak `Explore`'u miras alır.

## Notlar

- Belirli bir oturumdan aynı anda yalnızca bir ekibe liderlik edilebilir. Başka bir tane oluşturmadan önce mevcut ekibi bitirin veya silin.
- Bir ekip paylaşılan bir görev listesiyle 1:1'dir. Lider, görev oluşturma, atama ve kapatmaya sahiptir; ekip arkadaşları üzerinde çalıştıkları görevlerin durumunu günceller.
- Ekip yapılandırması `~/.claude/teams/{team_name}/config.json`'da saklanır ve görev dizini de yanında bulunur. Bu dosyalar, `TeamDelete` ile açıkça kaldırılana kadar oturumlar boyunca hayatta kalır.
- Ekip arkadaşları, eşleşen `team_name` artı farklı bir `name` ile `Agent` aracı kullanılarak oluşturulur. `name`, `SendMessage` tarafından kullanılan adres olur.
- Dosya sistemi güvenli (harfler, rakamlar, tireler, alt çizgiler) bir `team_name` seçin. Boşluklardan veya slash'lardan kaçının.
- `description`'ı, yeni bir ekip arkadaşının onu soğuk okuduğunda daha fazla bağlam olmadan ekibin hedefini anlayacağı şekilde yazın. Her ekip arkadaşının başlangıç promptunun parçası olur.
