# executeCode

Bir IDE entegrasyonu tarafından sağlanan canlı bir kernel veya sandbox içinde bir kod parçacığını yürütür (örneğin mevcut açık notebook'a bağlı Jupyter kerneli). Araç yalnızca Claude Code, Jupyter kerneli seçili VS Code uzantısı gibi uyumlu bir IDE köprüsüyle birlikte çalışırken mevcuttur.

## Ne Zaman Kullanılır

- Aktif bir Jupyter kernelinde zaten yüklü duruma karşı hızlı bir hesaplama, veri incelemesi veya çizim çalıştırmak.
- Bir kod parçacığını bir notebook hücresine yapıştırmadan önce doğrulamak.
- Kernelde var olan ancak diske serileştirilmemiş bir bellek içi dataframe, değişken veya modeli keşfetmek.
- Kullanıcının IDE'de satır içi işlenmesini istediği bir grafik veya sayısal sonuç üretmek.

`Bash` ile `python script.py` çalıştırmanın daha iyi hizmet edeceği bağımsız betikler veya taze bir kernel arasında kalıcı olması gereken kod için KULLANMAYIN.

## Parametreler

- `code` (string, zorunlu): Mevcut kernelde yürütülecek kod. Notebook hücresine yapıştırılmış gibi çalışır — tanımlanan değişkenler yeniden başlatılana kadar kernelde kalır.
- `language` (string, opsiyonel): IDE köprüsü birden fazla kerneli desteklediğinde parçacığın dili. En yaygın olarak atlanır; varsayılan olarak aktif kernelin dilini kullanır (genellikle Python).

## Örnekler

### Örnek 1: Bir bellek içi dataframe'i incelemek

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

Kernelde zaten yüklü bir dataframe'in ilk satırlarını, şeklini ve sütun dtypes'ını döndürür.

### Örnek 2: Hızlı sayısal kontrol

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

Notebook hücresi oluşturmadan tek seferlik bir hesaplama çalıştırır.

## Notlar

- `executeCode` bir IDE-köprüsü aracıdır. Claude Code'un düz terminal oturumlarında mevcut değildir; yalnızca oturum bir kernel sunan bir IDE'ye bağlı olduğunda (örneğin VS Code Jupyter uzantısı) görünür.
- Durum kernelde kalıcıdır. Bir `executeCode` çağrısı tarafından tanımlanan değişkenler sonraki çağrılara, notebook hücrelerine ve kullanıcıya görünür kalır — yan etkilere dikkat edin.
- Uzun süren veya bloklayıcı kod kerneli bloklar. Parçacıkları kısa tutun; dakikalarca süren iş için gerçek bir betik yazın ve `Bash` aracılığıyla çalıştırın.
- Çıktı (stdout, dönüş değerleri, görüntüler) oturuma döndürülür. Çok büyük çıktılar IDE köprüsü tarafından kesilebilir.
- Dosya düzenlemeleri için `Edit`, `Write` veya `NotebookEdit`'i tercih edin — `executeCode` kaynak dosyaları yazmak için bir ikame değildir.
