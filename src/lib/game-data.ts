export const learningLevelOneItems = [
  {
    id: "ha",
    aksara: "\u1BA0",
    latin: "ha",
    title: "Huruf Ha",
    note: "Huruf pembuka yang sering dikenalkan pertama.",
    audioSrc: "/assets/audio/ha.wav",
  },
  {
    id: "na",
    aksara: "\u1B94",
    latin: "na",
    title: "Huruf Na",
    note: "Bentuknya mudah dikenali dan cocok untuk latihan awal.",
    audioSrc: "/assets/audio/na.wav",
  },
  {
    id: "ca",
    aksara: "\u1B8E",
    latin: "ca",
    title: "Huruf Ca",
    note: "Latihan pengenalan bentuk dan sebutan.",
    audioSrc: "/assets/audio/ca.wav",
  },
  {
    id: "ra",
    aksara: "\u1B9B",
    latin: "ra",
    title: "Huruf Ra",
    note: "Mulai masuk ke variasi lengkung aksara.",
    audioSrc: "/assets/audio/ra.wav",
  },
  {
    id: "ka",
    aksara: "\u1B8A",
    latin: "ka",
    title: "Huruf Ka",
    note: "Cocok dipakai untuk latihan baca dan kuis awal.",
    audioSrc: "/assets/audio/ka.wav",
  },
] as const;

export const learningRarangkenItems = [
  {
    id: "panghulu",
    mark: "\u1BA4",
    example: "\u1B8A\u1BA4",
    latin: "ki",
    title: "Tanda bunyi i",
    note: "Tanda ini menambahkan bunyi i pada huruf dasar.",
  },
  {
    id: "panyuku",
    mark: "\u1BA5",
    example: "\u1B8A\u1BA5",
    latin: "ku",
    title: "Tanda bunyi u",
    note: "Tanda ini menambahkan bunyi u pada huruf dasar.",
  },
  {
    id: "pamepet",
    mark: "\u1BA8",
    example: "\u1B8A\u1BA8",
    latin: "keu",
    title: "Tanda bunyi eu",
    note: "Tanda ini menambahkan bunyi eu pada huruf dasar.",
  },
  {
    id: "paneuleung",
    mark: "\u1BA7",
    example: "\u1B8A\u1BA7",
    latin: "ke",
    title: "Tanda bunyi e",
    note: "Tanda ini menambahkan bunyi e pada huruf dasar.",
  },
  {
    id: "panolong",
    mark: "\u1BA9",
    example: "\u1B8A\u1BA9",
    latin: "ko",
    title: "Tanda bunyi o",
    note: "Tanda ini menambahkan bunyi o pada huruf dasar.",
  },
] as const;

export const learningNumberItems = [
  {
    id: "one",
    aksara: "\u1BB1",
    latin: "1",
    title: "Angka Satu",
    note: "Ini adalah angka satu dalam aksara Sunda.",
  },
  {
    id: "three",
    aksara: "\u1BB3",
    latin: "3",
    title: "Angka Tiga",
    note: "Cocok untuk latihan membaca angka dasar.",
  },
  {
    id: "five",
    aksara: "\u1BB5",
    latin: "5",
    title: "Angka Lima",
    note: "Bentuk angka ini bagus untuk dibiasakan dalam kuis.",
  },
  {
    id: "seven",
    aksara: "\u1BB7",
    latin: "7",
    title: "Angka Tujuh",
    note: "Membantu mengenal urutan angka Sunda lebih jauh.",
  },
  {
    id: "nine",
    aksara: "\u1BB9",
    latin: "9",
    title: "Angka Sembilan",
    note: "Sering dipakai dalam latihan campuran huruf dan angka.",
  },
] as const;

export const readingLevelOneItems = learningLevelOneItems.map((item) => ({
  id: item.id,
  aksara: item.aksara,
  expected: item.latin,
  audioSrc: item.audioSrc,
}));

export const tracingLevelOneItems = learningLevelOneItems.map((item) => ({
  id: item.id,
  aksara: item.aksara,
  latin: item.latin,
}));

export const quizLevelOneQuestions = [
  {
    id: "q1",
    aksara: "\u1B8A",
    prompt: "Pilih jawaban yang sesuai dengan aksara Sunda berikut.",
    options: ["ka", "pa", "sa", "ta"],
    answer: "ka",
  },
  {
    id: "q2",
    aksara: "\u1BA0",
    prompt: "Aksara ini dibaca apa?",
    options: ["ha", "da", "ya", "ba"],
    answer: "ha",
  },
  {
    id: "q3",
    aksara: "\u1B94",
    prompt: "Pilih bacaan latin yang benar.",
    options: ["ca", "ra", "na", "ga"],
    answer: "na",
  },
  {
    id: "q4",
    aksara: "\u1B8E",
    prompt: "Huruf ini mewakili bunyi apa?",
    options: ["ja", "ca", "wa", "la"],
    answer: "ca",
  },
  {
    id: "q5",
    aksara: "\u1B9B",
    prompt: "Jawaban yang benar untuk aksara ini adalah...",
    options: ["ra", "ma", "ta", "ka"],
    answer: "ra",
  },
  {
    id: "q6",
    aksara: "\u1BB1",
    prompt: "Ini adalah angka Sunda berapa?",
    options: ["1", "2", "3", "4"],
    answer: "1",
  },
  {
    id: "q7",
    aksara: "\u1BB3",
    prompt: "Pilih angka latin yang sesuai.",
    options: ["2", "4", "3", "7"],
    answer: "3",
  },
  {
    id: "q8",
    aksara: "\u1BB5",
    prompt: "Angka Sunda ini dibaca...",
    options: ["4", "5", "6", "8"],
    answer: "5",
  },
  {
    id: "q9",
    aksara: "\u1BB7",
    prompt: "Jawaban angka yang benar adalah...",
    options: ["6", "7", "8", "9"],
    answer: "7",
  },
  {
    id: "q10",
    aksara: "\u1BB9",
    prompt: "Aksara angka ini menunjukkan bilangan...",
    options: ["7", "8", "9", "0"],
    answer: "9",
  },
] as const;

export const quizLetterLevelOneQuestions = quizLevelOneQuestions.slice(0, 5);
export const quizNumberLevelOneQuestions = quizLevelOneQuestions.slice(5);
