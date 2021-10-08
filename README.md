# Ini adalah program iNose versi 2.

## Framework yang digunakan:
- React
- Tailwind

## Sistem:
- Python, selalu jalan diawal. Dia nungguin stdin 

## Utilities

### Pendaftaran serial baru
1. Generate random string di website <a href="http://www.unit-conversion.info/texttools/random-string-generator/">Random String Generator</a>
2. Setting random generator sebagai beerikut <br/>
    &nbsp;&nbsp;&nbsp;&nbsp; Allowed Chars : ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 <br/>
    &nbsp;&nbsp;&nbsp;&nbsp; Number of Strings : {Sesuaikan dengan kebutuhan} <br/>
    &nbsp;&nbsp;&nbsp;&nbsp; Length : 64 <br/>
3. Masuk ke server dan ke directory /var/www/html/screening-api
4. Jalankan perintah ```php artisan device:add {masukkan string random}```
5. Nomor serial baru berhasil ditambahkan <br/>


### Pembuatan inose-serial
1. Masuk ke dalam terminal raspi
2. Jalankan perintah ```cd /usr/local/bin```
3. Jalankan perintah ```sudo nano inose-serial```
4. Tuliskan kode berikut <br/> 
    ```
    #!/usr/bin/python3
    print('{masukkan random string untuk alat ini}')
    ```
5. Simpan dengan ``` Ctrl + x ```
6. 6. Jalankan dengan ``` sudo chmod 755 inose-serial ```
7. inose-serial berhasil dibuat

### Pembuatan nfc-inose dummy untuk alat yang tidak memiliki NFC
1. Masuk ke dalam terminal raspi
2. Jalankan perintah ```cd /usr/local/bin```
3. Jalankan perintah ```sudo nano nfc-inose```
4. Tuliskan kode berikut <br/> 
    ```
    #!/usr/bin/python3
    input()
    ```
5. Simpan dengan ``` Ctrl + x ```
6. Jalankan dengan ``` sudo chmod 755 nfc-inose ```
7. nfc-inose dummy berhasil dibuat

### Install LightGBM 32 bit

Jalankan dengan ``` pip3 install install lightgbm --install-option=--bit32 ```

