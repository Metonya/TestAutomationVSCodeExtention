# VS Code Karate Test Otomasyon Eklentisi

Bu VS Code eklentisi, Karate DSL kullanarak API testi yazma ve inceleme süreçlerini kolaylaştırmak için tasarlanmıştır. GitHub Copilot Chat ile entegre çalışarak, kullanıcıların doğal dilde komutlar vererek test oluşturmasına, mevcut testlerini incelemesine ve Karate DSL hakkında sorular sormasına olanak tanır.

## Özellikler

* **Swagger'dan Karate Testi Oluşturma:** Bir Swagger dosyası (URL veya Bitbucket deposu yoluyla) sağlandığında, eklenti kapsamlı bir Karate test şablonu oluşturur.
* **Karate Test İncelemesi:** Kullanıcılar, `.feature` dosyalarını yükleyerek veya içeriğini doğrudan sohbete yapıştırarak testlerini inceletebilirler.  Eklenti, kodun doğruluğu, bütünlüğü, okunabilirliği ve performansı hakkında geri bildirim sağlar.
* **Karate DSL Hakkında Soru-Cevap:** Kullanıcılar, Karate DSL sözdizimi, özellikleri ve en iyi uygulamaları hakkında sorular sorabilirler.
* **Problem Çözme (Yapım Aşaması):**  İleride, kullanıcıların Karate testleriyle ilgili karşılaştıkları sorunları çözmelerine yardımcı olacak özellikler eklenecektir.
* **Test Çalıştırma (Yapım Aşaması):**  Testlerin çalıştırılması ve sonuçlarının raporlanması için özellikler eklenecektir.

## Kullanım

Eklentiyi kullanmak için, VS Code'da Copilot Chat'i açın ve aşağıdaki komutları kullanın:

* **`@testautomation /karate [repository_adı]`**:  Belirtilen Bitbucket deposundan Swagger dosyasını alarak bir Karate testi oluşturur.  (Bitbucket entegrasyonu henüz tam olarak uygulanmamıştır. Şimdilik test amaçlı bir Swagger URL'si kullanılmaktadır.)
    * **Örnek:** `@testautomation /karate benim-repo`
* **`@testautomation /karate [soru]`**: Karate DSL ile ilgili sorular sorun.
    * **Örnek:** `@testautomation /karate Bir JSON dosyasını nasıl okurum?`
* **`@testautomation /karate testimi gözden geçir`**:  Bir `.feature` dosyası yükleyin veya içeriğini sohbete yapıştırarak testinizi inceletin.
* **`@testautomation [test otomasyon sorusu]`**: Genel test otomasyon soruları için.
    * **Örnek:** `@testautomation API testi nedir?`

## Dosya Yapısı

* **`extension.ts`**:  Eklentinin ana dosyası.  Sohbet komutlarını, istemleri ve kullanıcı etkileşimlerini yönetir.
* **`bitbucket.ts`**: Bitbucket API entegrasyonunu içerir (şimdilik yer tutucu).
* **`karate.ts`**: Karate testi oluşturma mantığını içerir.

## Prompts

* **`BASE_PROMPT`**: Genel test otomasyon asistanı promptu.
* **`KARATE_CATEGORY_PROMPT`**: `/karate` komutu içindeki kullanıcı niyetini sınıflandırmak için kullanılır.
* **`REVIEW_PROMPT(featureFileContent)`**:  Karate testi incelemesi için kullanılır.  `.feature` dosyasının içeriğini parametre olarak alır.


## Örnek Prompts

**`KARATE_CATEGORY_PROMPT` Örneği:**
Use code with caution.
Markdown
Kullanıcı: @testautomation /karate benim-repo'dan test oluştur

**`REVIEW_PROMPT` Örneği:**
Use code with caution.
Kullanıcı: @testautomation /karate testimi gözden geçir
(Kullanıcı bir .feature dosyası yükler)

**`BASE_PROMPT` Örneği:**
Use code with caution.
Kullanıcı: @testautomation JMeter nedir?

## Geliştirme Alanları (TODO List)

* **Bitbucket Entegrasyonu:**  `bitbucket.ts` dosyasındaki `getSwaggerFromBitbucket` fonksiyonunu gerçek Bitbucket API entegrasyonu ile tamamlayın.  Token yönetimi ve hata işlemeyi ekleyin.
* **Dosya Yükleme (Review):** `extension.ts` dosyasındaki `review` case'inde, dosya yolu verildiğinde dosyayı okuma mantığını uygulayın (`vscode.workspace.fs.readFile` kullanarak).
* **Problem Çözme:** "problem" kategorisi için sorun giderme ve çözüm önerileri sunan bir özellik geliştirin.  Bu, kullanıcıdan hata mesajlarını veya sorun açıklamalarını almayı ve Copilot'a uygun bir prompt göndermeyi içerebilir.
* **Test Çalıştırma:** "test execution" kategorisi için test çalıştırma ve raporlama özelliği ekleyin.  Karate testlerini çalıştırmak ve sonuçları kullanıcıya (başarılı/başarısız testler, raporlar vb.) göstermek için bir mekanizma oluşturun.  Ayrıca, test sonuçlarını Copilot'a göndererek analiz etmesini ve ek bilgiler sağlamasını sağlayabilirsiniz.
* **Daha Fazla Test Aracı Entegrasyonu:**  JMeter, Selenium gibi diğer test otomasyon araçları için destek ekleyin.
* **Dil Desteği:**  Eklentiye İngilizce dil desteği ekleyin.
* **Kullanıcı Arayüzü Geliştirmeleri:**  Eklentinin kullanıcı arayüzünü daha kullanıcı dostu hale getirmek için iyileştirmeler yapın.


## Ek Bilgiler

Bu eklenti, hala geliştirme aşamasındadır ve yukarıda listelenen özelliklerin bazıları henüz tam olarak uygulanmamıştır. Katkıda bulunmak ve geri bildirim sağlamak için lütfen proje sayfasını ziyaret edin.  (Proje sayfası henüz oluşturulmamıştır.)