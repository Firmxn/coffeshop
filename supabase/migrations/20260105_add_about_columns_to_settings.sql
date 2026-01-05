ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS about_hero TEXT DEFAULT 'ARCoffee adalah coffeeshop lokal yang lahir dari kecintaan mendalam terhadap kopi Indonesia. Kami percaya bahwa setiap cangkir kopi memiliki cerita, dan kami hadir untuk membuat momen ngopi Anda menjadi lebih bermakna.';

ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS about_story TEXT DEFAULT 'Berawal dari sebuah mimpi kecil, ARCoffee didirikan oleh sekelompok pecinta kopi yang ingin menghadirkan pengalaman ngopi yang berbeda di tengah hiruk-pikuk kota.

Kami bekerja sama langsung dengan petani kopi dari berbagai daerah di Indonesia - dari Aceh, Toraja, hingga Papua - untuk memastikan setiap biji yang kami sajikan memiliki kualitas terbaik dan mendukung kesejahteraan petani lokal.

Dengan barista yang terlatih dan menu yang dapat dikustomisasi sesuai selera, kami berkomitmen untuk memberikan pengalaman yang personal dan memorable di setiap kunjungan Anda.';
