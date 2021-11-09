errorMessage === 'The email address is badly formatted.'
  ? 'Format email yang anda masukan salah.'
  : null,
  errorMessage ===
  'A network error (such as timeout, interrupted connection or unreachable host) has occurred.'
    ? 'Koneksi internet anda bermasalah.'
    : null,
  errorMessage === ' The email address is already in use by another account.'
    ? 'Alamat email ini sudah pernah digunakan.'
    : null;
