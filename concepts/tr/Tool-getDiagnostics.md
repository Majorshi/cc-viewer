# getDiagnostics

Bağlı IDE'den belirli bir dosya veya IDE'nin şu anda açık olan her dosyası için dil-sunucu tanılamalarını (hatalar, uyarılar, ipuçları) alır. Bir görevin yapıldığını ilan etmeden önce kod değişikliklerinin temiz derlendiğini doğrulamak için kullanılır.

## Ne Zaman Kullanılır

- Bir `Edit` veya `Write`'tan sonra değişikliğin bir tür hatası, sözdizimi hatası veya lint uyarısı getirmediğini onaylamak.
- Çözülmemiş sorunlar için açık her dosyayı taramak için bir görevi sonlandırmadan önce.
- Kullanıcının bildirdiği bir hatayı teşhis ederken — IDE'den tam derleyici veya tür-denetleyici mesajını çekmek tahmin etmekten kaçınır.
- Yalnızca statik doğruluğu kontrol etmeniz gerektiğinde tam bir derleme veya test komutu çalıştırmaya hafif bir alternatif olarak.

`getDiagnostics`'e test paketi yerine güvenmeyin. Dil sunucusunun gördüğünü bildirir, test veya üretim zamanında çalışanı değil.

## Parametreler

- `uri` (string, opsiyonel): Tanılamaları almak için dosya URI'si (tipik olarak `file:///absolute/path`). Atlandığında, araç IDE'nin şu anda açık olan her dosya için tanılamaları döndürür.

## Örnekler

### Örnek 1: Düzenlemeden sonra tek bir dosyayı kontrol edin

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

`src/auth.ts` için herhangi bir TypeScript hatası, ESLint uyarısı veya diğer dil-sunucu mesajlarını döndürür.

### Örnek 2: Tüm açık dosyaları tarayın

```
getDiagnostics()
```

Şu anda açık olan her editördeki tanılamaları döndürür. Başka yerlerde hiçbir şeyin gerilemediğinden emin olmak için çok dosyalı bir refactoring'in sonunda kullanışlıdır.

## Notlar

- `getDiagnostics` bir IDE-köprüsü aracıdır. Yalnızca Claude Code destekleyici bir IDE entegrasyonuna (örneğin VS Code uzantısı) bağlı olduğunda mevcuttur. Düz terminal oturumunda araç görünmez.
- Sonuçlar, IDE'nin yüklediği dil sunucularını yansıtır — TypeScript, Pyright, ESLint, rust-analyzer vb. Kalite ve kapsam, Claude Code'a değil, kullanıcının IDE kurulumuna bağlıdır.
- Tanılamalar canlıdır. Bir düzenlemeden sonra, boş bir sonucu başarı olarak yorumlamadan önce dil sunucusuna yeniden analiz etmek için bir süre tanıyın — dosya az önce kaydedildiyse yeniden çalıştırın.
- Önem düzeyleri tipik olarak `error`, `warning`, `information` ve `hint`'i içerir. Önce `error`'a odaklanın; uyarılar kasıtlı proje stili olabilir.
- Şu anda IDE'de açık olmayan dosyalar için, dosya gerçek sorunlar içerse bile dil sunucusunun bildirecek hiçbir tanılaması olmayabilir. Yetkili kapsam için dosyayı açın veya derlemeyi çalıştırın.
